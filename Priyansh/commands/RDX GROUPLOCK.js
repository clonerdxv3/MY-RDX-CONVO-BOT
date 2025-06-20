const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "locknick",
  version: "1.4.0",
  hasPermssion: 1,
  credits: "Sardar RDX + ChatGPT",
  description: "Lock group name, photo, and nicknames. Mention everyone to lock nicknames.",
  commandCategory: "group",
  usages: "[on/off/add/remove] (@tag)",
  cooldowns: 5
};

const lockDataPath = path.join(__dirname, "cache", "locknick.json");
let lockData = fs.existsSync(lockDataPath) ? JSON.parse(fs.readFileSync(lockDataPath)) : {};

function saveLockData() {
  fs.writeFileSync(lockDataPath, JSON.stringify(lockData, null, 2));
}

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const mentions = Object.keys(event.mentions);

  if (!args[0]) return api.sendMessage("⚠️ استعمال: locknick on/off/add/remove @user", threadID, event.messageID);

  const action = args[0].toLowerCase();

  if (action === "on") {
    const threadInfo = await api.getThreadInfo(threadID);
    const nicknames = {};
    for (const user of threadInfo.userInfo) {
      nicknames[user.id] = user.nickname || "";
    }

    lockData[threadID] = {
      nicknames,
      threadName: threadInfo.threadName || "Group",
      imageSrc: threadInfo.imageSrc || null
    };
    saveLockData();

    return api.sendMessage("🔒 Group name, image aur nicknames lock kar diye gaye hain.", threadID, event.messageID);
  }

  if (action === "off") {
    if (!lockData[threadID]) return api.sendMessage("⚠️ Pehle se unlocked hai.", threadID, event.messageID);
    delete lockData[threadID];
    saveLockData();
    return api.sendMessage("✅ Sab locks hata diye gaye hain.", threadID, event.messageID);
  }

  if (action === "add") {
    if (!mentions[0]) return api.sendMessage("⚠️ Kisi ko tag karein.", threadID, event.messageID);
    const userID = mentions[0];
    const threadInfo = await api.getThreadInfo(threadID);
    const user = threadInfo.userInfo.find(u => u.id == userID);
    const currentNickname = user?.nickname || "";

    if (!lockData[threadID]) lockData[threadID] = { nicknames: {} };
    if (!lockData[threadID].nicknames) lockData[threadID].nicknames = {};

    lockData[threadID].nicknames[userID] = currentNickname;

    saveLockData();
    return api.sendMessage(`✅ ${user.name} ka nickname lock kar diya gaya hai.`, threadID, event.messageID);
  }

  if (action === "remove") {
    if (!mentions[0]) return api.sendMessage("⚠️ Kisi ko tag karein.", threadID, event.messageID);
    const userID = mentions[0];
    if (lockData[threadID]?.nicknames?.[userID]) {
      delete lockData[threadID].nicknames[userID];
      saveLockData();
      return api.sendMessage("✅ Nickname lock hata diya gaya hai.", threadID, event.messageID);
    } else {
      return api.sendMessage("⚠️ Is user ka nickname locked nahi hai.", threadID, event.messageID);
    }
  }

  return api.sendMessage("❌ Invalid input! Use: locknick on/off/add/remove @user", threadID, event.messageID);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, logMessageType, logMessageData, body } = event;

  if (!lockData[threadID]) return;

  // Log the event for debug
  console.log("📥 Event Type:", logMessageType);

  // Lock nickname changes
  if (logMessageType === "log:thread-nickname") {
    const userID = logMessageData.participant_id;
    const lockedNick = lockData[threadID].nicknames?.[userID];

    if (lockedNick !== undefined && logMessageData.nickname !== lockedNick) {
      await api.changeNickname(lockedNick, threadID, userID);
      api.sendMessage(`🔄 Nickname badla gaya tha: "${logMessageData.nickname || "خالی"}"\nWapas purana laga diya gaya.`, threadID);
    }
  }

  // ✅ Fix: Lock group name (bug-free)
  if (logMessageType === "log:thread-name") {
    const originalName = lockData[threadID].threadName;
    if (logMessageData?.name && logMessageData.name !== originalName) {
      try {
        await api.setTitle(originalName, threadID);
        api.sendMessage("⚠️ Group name change hua tha. Wapas original name set kar diya gaya.", threadID);
      } catch (err) {
        console.error("❌ Group name restore failed:", err.message);
      }
    }
  }

  // Lock group image
  if (logMessageType === "log:thread-image") {
    const originalImg = lockData[threadID].imageSrc;
    if (originalImg) {
      try {
        const imgRes = await axios.get(originalImg, { responseType: "stream" });
        await api.changeGroupImage(imgRes.data, threadID);
        api.sendMessage("⚠️ Group image change ki gayi thi. Wapas original image laga di gayi hai.", threadID);
      } catch (err) {
        console.error("❌ Image restore failed:", err.message);
      }
    }
  }

  // Mention everyone → set + lock all nicknames
  if (body && body.toLowerCase().startsWith("mention everyone")) {
    const args = body.split(" ");
    args.shift(); // remove 'mention'
    args.shift(); // remove 'everyone'
    const customNick = args.join(" ") || "🔥Member";

    const threadInfo = await api.getThreadInfo(threadID);
    const mentions = [];

    if (!lockData[threadID].nicknames) lockData[threadID].nicknames = {};

    for (const user of threadInfo.userInfo) {
      if (user.id !== api.getCurrentUserID()) {
        try {
          await api.changeNickname(customNick, threadID, user.id);
          lockData[threadID].nicknames[user.id] = customNick;
          mentions.push({ tag: user.name, id: user.id });
        } catch (e) {
          console.error(`❌ Nickname set failed for ${user.id}:`, e.message);
        }
      }
    }

    saveLockData();

    return api.sendMessage({
      body: `📢 All members' nicknames set to: "${customNick}" and locked.`,
      mentions
    }, threadID);
  }
};

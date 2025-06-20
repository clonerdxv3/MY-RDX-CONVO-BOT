const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "locknick",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Sardar RDX",
  description: "Lock all members' nicknames in a group",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5
};

const lockNickDataPath = path.join(__dirname, "cache", "locknick.json");
let lockNickData = fs.existsSync(lockNickDataPath) ? JSON.parse(fs.readFileSync(lockNickDataPath)) : {};

function saveLockData() {
  fs.writeFileSync(lockNickDataPath, JSON.stringify(lockNickData, null, 2));
}

module.exports.run = async function ({ api, event, args, Threads }) {
  const threadID = event.threadID;

  if (!args[0]) return api.sendMessage("⚠️ استعمال: locknick on/off", threadID, event.messageID);

  if (args[0].toLowerCase() === "on") {
    const threadInfo = await api.getThreadInfo(threadID);
    const nicknames = {};

    for (const user of threadInfo.userInfo) {
      nicknames[user.id] = user.nickname || "";
    }

    lockNickData[threadID] = nicknames;
    saveLockData();

    return api.sendMessage("🔒 تمام ممبرز کے nicknames لاک کر دیے گئے ہیں۔", threadID, event.messageID);
  }

  if (args[0].toLowerCase() === "off") {
    if (!lockNickData[threadID]) return api.sendMessage("⚠️ Nickname پہلے سے unlock ہیں۔", threadID, event.messageID);

    delete lockNickData[threadID];
    saveLockData();
    return api.sendMessage("✅ Nickname لاک ختم کر دیا گیا ہے۔", threadID, event.messageID);
  }

  return api.sendMessage("❌ Invalid input! استعمال کریں: locknick on/off", threadID, event.messageID);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, logMessageType, logMessageData } = event;

  if (!lockNickData[threadID]) return;

  if (logMessageType === "log:thread-nickname") {
    const userID = logMessageData.participant_id;
    const lockedNick = lockNickData[threadID][userID] || "";

    if (logMessageData.nickname !== lockedNick) {
      await api.changeNickname(lockedNick, threadID, userID);
      api.sendMessage(
        `🔄 Nickname detect ہوا: "${logMessageData.nickname || "خالی"}"\nپرانا nickname دوبارہ لگا دیا گیا۔`,
        threadID
      );
    }
  }
};

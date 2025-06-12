const axios = require("axios");

module.exports.config = {
  name: "tiktalk",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sardar rdx | modified by ChatGPT",
  description: "AI chatbot jo 'tiktalk on/off' par kaam karta hai",
  commandCategory: "AI",
  usePrefix: false,
  usages: "tiktalk on / tiktalk off / tiktalk clear",
  cooldowns: 5,
};

let isActive = false;
let userMemory = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  if (!isActive || !body) return;

  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userQuery = body.trim();
  if (!userMemory[senderID]) userMemory[senderID] = [];

  const history = userMemory[senderID].join("\n");
  const fullMessage = `${history}\nUser: ${userQuery}\nBot:`;

  const apiURL = `https://shankar-gpt-3-api.vercel.app/api?message=${encodeURIComponent(fullMessage)}`;

  try {
    const res = await axios.get(apiURL);
    const reply = res.data.response || "⚠️ Kuch samajh nahi aaya.";

    userMemory[senderID].push(`User: ${userQuery}`);
    userMemory[senderID].push(`Bot: ${reply}`);
    if (userMemory[senderID].length > 16) userMemory[senderID].splice(0, 2);

    return api.sendMessage(reply, threadID, messageID);
  } catch (err) {
    console.log("API error:", err.message);
    return api.sendMessage("❌ AI se jawab nahi aaya.", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const input = args[0]?.toLowerCase();

  if (input === "on") {
    isActive = true;
    return api.sendMessage("✅ TikTalk AI bot ab active hai.", threadID, messageID);
  }

  if (input === "off") {
    isActive = false;
    return api.sendMessage("❌ TikTalk AI bot ab band hai.", threadID, messageID);
  }

  if (input === "clear") {
    if (args[1] === "all") {
      userMemory = {};
      return api.sendMessage("🧹 Sabki memory clear kar di gayi.", threadID, messageID);
    } else {
      delete userMemory[senderID];
      return api.sendMessage("🧹 Aapki memory clear kar di gayi.", threadID, messageID);
    }
  }

  return api.sendMessage("📘 Commands:\ntiktalk on\ntiktalk off\ntiktalk clear [all]", threadID, messageID);
};

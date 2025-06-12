const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "hercai",
  version: "1.6.1",
  hasPermission: 0,
  credits: "SHANKAR SIR",
  description: "AI bot jo har user ki baat cheet ko yaad rakh kar jawab dega",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[Bot ke message par reply karein]",
  cooldowns: 5,
};

let userMemory = {};
let isActive = true;

// ⬇️ Owner UID + last welcome time tracking
const OWNER_UID = "61574147701060";
let lastWelcomeTime = {};

// ⬇️ Boss welcome messages
const welcomeMessages = [
  "👑 Boss agaye! Sab sidhe ho jao 😎",
  "🔥 Welcome back king! Tashreef laayein",
  "💼 Sir online ho gaye, ab kaam hoga!",
  "🎩 Boss ki entry hui hai, show shuru!",
];

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, messageID, body, messageReply } = event;
  if (!body) return;

  // ⬇️ Chat on/off control
  const loweredBody = body.toLowerCase().trim();
  if (loweredBody === "chat on") {
    isActive = true;
    return api.sendMessage("✅ Chat bot ab active hai.", threadID, messageID);
  }

  if (loweredBody === "chat off") {
    isActive = false;
    return api.sendMessage("❌ Chat bot ab inactive hai.", threadID, messageID);
  }

  if (!isActive) return;

  // ✅ Respectful Welcome for Owner every 30 mins
  const now = Date.now();
  if (
    senderID === OWNER_UID &&
    (!lastWelcomeTime[threadID] || now - lastWelcomeTime[threadID] > 30 * 60 * 1000)
  ) {
    lastWelcomeTime[threadID] = now;
    const msg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    api.sendMessage(msg, threadID);
  }

  // ⬇️ Hercai main logic
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;
  const userQuery = body.trim();
  if (!userMemory[senderID]) userMemory[senderID] = [];

  const conversationHistory = userMemory[senderID].join("\n");
  const fullQuery = conversationHistory + `\nUser: ${userQuery}\nBot (reply in Roman Urdu):`;

  const apiURL = `https://shankar-gpt-3-api.vercel.app/api?message=${encodeURIComponent(fullQuery)}`;

  try {
    const response = await axios.get(apiURL);
    let botReply = response.data.response || "Mujhe samajhne mein dikkat ho rahi hai. Kya aap dobara keh sakte hain?";

    userMemory[senderID].push(`User: ${userQuery}`);
    userMemory[senderID].push(`Bot: ${botReply}`);
    if (userMemory[senderID].length > 15) userMemory[senderID].splice(0, 2);

    return api.sendMessage({
      body: botReply,
      mentions: [{
        tag: "Bot",
        id: api.getCurrentUserID()
      }]
    }, threadID, messageID);
  } catch (error) {
    console.error("API Error:", error.message);
    return api.sendMessage("❌ AI se jawab laane mein masla hua. Barah-e-karam baad mein koshish karein.", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const command = args[0] && args[0].toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ Hercai bot ab active hai.", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ Hercai bot ab inactive hai.", threadID, messageID);
  } else if (command === "clear") {
    if (args[1] && args[1].toLowerCase() === "all") {
      userMemory = {};
      return api.sendMessage("🧹 Sab users ki chat history clear kar di gayi hai.", threadID, messageID);
    }
    if (userMemory[senderID]) {
      delete userMemory[senderID];
      return api.sendMessage("🧹 Aapki chat history clear kar di gayi hai.", threadID, messageID);
    } else {
      return api.sendMessage("⚠️ Aapki koi bhi saved history mojood nahi hai.", threadID, messageID);
    }
  }
};

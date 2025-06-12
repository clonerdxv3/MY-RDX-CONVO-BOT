const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "ai", // ✅ command name 'ai' kar diya
  version: "1.6.2",
  hasPermission: 0,
  credits: "sardar rdx | modified by ChatGPT",
  description: "AI bot jo har user ki baat cheet ko yaad rakh kar jawab dega",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[ai on / ai off / ai clear]",
  cooldowns: 5,
};

let userMemory = {};
let isActive = false; // ❗️By default inactive

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body) return;

  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userQuery = body.trim();

  if (!userMemory[senderID]) userMemory[senderID] = [];

  const conversationHistory = userMemory[senderID].join("\n");
  const fullQuery = conversationHistory + `\nUser: ${userQuery}\nBot:`;

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
    return api.sendMessage("✅ AI bot ab *active* hai. Aap reply kar sakte hain.", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ AI bot ab *inactive* hai. Jab tak 'ai on' nahi likhenge, bot kaam nahi karega.", threadID, messageID);
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
  } else {
    return api.sendMessage("ℹ️ AI bot ka istemal:\n- ai on\n- ai off\n- ai clear [all]", threadID, messageID);
  }
};

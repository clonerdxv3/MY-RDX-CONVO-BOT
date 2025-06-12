const axios = require("axios");

module.exports.config = {
  name: "ai", // <-- Yeh 'ai' command ban gaya
  version: "1.0.0",
  hasPermission: 0,
  credits: "sardar rdx | Fixed by ChatGPT",
  description: "AI bot jo reply karta hai jab 'ai on' kiya jaye",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[ai on/off/clear]",
  cooldowns: 5,
};

let userMemory = {};
let isActive = false; // Default inactive rakha gaya

// ✅ Bot tabhi kaam karega jab 'ai on' ho
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
    let botReply = response.data.response || "Mujhe samajhne mein dikkat ho rahi hai.";

    userMemory[senderID].push(`User: ${userQuery}`);
    userMemory[senderID].push(`Bot: ${botReply}`);
    if (userMemory[senderID].length > 15) userMemory[senderID].splice(0, 2);

    return api.sendMessage({
      body: botReply,
      mentions: [{ tag: "Bot", id: api.getCurrentUserID() }]
    }, threadID, messageID);
  } catch (error) {
    console.error("API Error:", error.message);
    return api.sendMessage("❌ AI se jawab laane mein masla hua.", threadID, messageID);
  }
};

// ✅ Commands: ai on / ai off / ai clear
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const input = args[0]?.toLowerCase();

  switch (input) {
    case "on":
      isActive = true;
      return api.sendMessage("✅ AI bot ab active hai. Reply karne ke liye tayar hai.", threadID, messageID);

    case "off":
      isActive = false;
      return api.sendMessage("❌ AI bot ab inactive hai. Jab tak 'ai on' nahi likhenge, bot kaam nahi karega.", threadID, messageID);

    case "clear":
      if (args[1]?.toLowerCase() === "all") {
        userMemory = {};
        return api.sendMessage("🧹 Sab users ki chat history clear kar di gayi hai.", threadID, messageID);
      }
      if (userMemory[senderID]) {
        delete userMemory[senderID];
        return api.sendMessage("🧹 Aapki chat history clear kar di gayi hai.", threadID, messageID);
      }
      return api.sendMessage("⚠️ Aapki koi bhi saved history nahi mili.", threadID, messageID);

    default:
      return api.sendMessage("📘 Commands:\n• ai on\n• ai off\n• ai clear [all]", threadID, messageID);
  }
};

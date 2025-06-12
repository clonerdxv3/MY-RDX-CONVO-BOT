const axios = require("axios");
const moment = require("moment-timezone");

let autoReplyEnabled = true; // Default: Auto-chat is ON

module.exports.config = {
  name: "ai-autochat",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Modified by ChatGPT",
  description: "ChatGPT auto-reply with chat on/off command",
  commandCategory: "chatbots",
  usages: "Say 'chat on' or 'chat off'",
  cooldowns: 3,
};

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID].name;
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, threadID, messageID } = event;

  if (!body || senderID == api.getCurrentUserID()) return;

  const messageText = body.toLowerCase().trim();

  // Toggle chat on/off
  if (messageText === "chat on") {
    autoReplyEnabled = true;
    return api.sendMessage("Auto chat is now ON.", threadID, messageID);
  }

  if (messageText === "chat off") {
    autoReplyEnabled = false;
    return api.sendMessage("Auto chat is now OFF.", threadID, messageID);
  }

  // If chat is off, don't reply
  if (!autoReplyEnabled) return;

  // ChatGPT reply section
  api.setMessageReaction("⌛", messageID, () => {}, true);
  api.sendTypingIndicator(threadID, true);

  const apiKey = "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";
  const userName = await getUserName(api, senderID);
  const currentTime = moment().tz("Asia/Kolkata").format("MMM D, YYYY - hh:mm A");
  const prompt = `You are ChatGPT, chatting with a user named ${userName}. Current time: ${currentTime}`;
  const userMessage = `User: ${body}\nAssistant:`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    api.sendMessage("I'm having trouble replying right now.", threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = async () => {
  // No command needed
};

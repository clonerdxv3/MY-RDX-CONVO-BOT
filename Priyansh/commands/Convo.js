module.exports.config = {
  name: "convo",
  version: "2.0.1",
  hasPermssion: 2,
  credits: "ChatGPT + Zain",
  description: "Send a series of insults",
  commandCategory: "fun",
  usages: "convo on | convo off",
  cooldowns: 5
};

let isOn = false;

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, senderID, body } = event;
  if (handleReply.author !== senderID) return;

  switch (handleReply.step) {
    case 1:
      {
        const tid = body.trim();
        api.sendMessage("✅ Name saved.\n🛠️ Step 2: Enter the sender name:", threadID, (err, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            tid,
            step: 2
          });
        });
      }
      break;

    case 2:
      {
        const name = body.trim();
        api.sendMessage("✅ Name saved.\n🕐 Step 3: Enter delay speed in milliseconds (e.g., 3000)", threadID, (err, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            tid: handleReply.tid,
            name,
            step: 3
          });
        });
      }
      break;

    case 3:
      {
        const speed = parseInt(body.trim());
        if (isNaN(speed) || speed < 100) {
          return api.sendMessage("❗ Invalid speed. Please enter a number above 100.", threadID);
        }

        const { tid, name } = handleReply;
        api.sendMessage(`🔥 Starting convo in TID: ${tid} with name: ${name} and speed: ${speed}ms`, threadID);
        fireMessages(api, tid, name, speed);
      }
      break;
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, senderID } = event;

  if (args[0] === "off") {
    isOn = false;
    return api.sendMessage("❌ Convo OFF. Stopped.", threadID);
  }

  if (args[0] === "on") {
    isOn = true;
    return api.sendMessage("📥 Step 1: Send the TID to target:", threadID, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        step: 1
      });
    });
  }

  return api.sendMessage("❗ Use: convo on | convo off", threadID);
};

function fireMessages(api, tid, heaterName, speed) {
  const messages = [
    "T3R9 B99P BOT 3NT3R S9L3 APN3 B99P S3 JUB99N L9D9Y3G9🤞🏻👅👅",
    "BOT KO G9LI D3N3 W9LO TUMH9RII B9HN KII (+)🙊💋",
    "T3RII M99 BHOSD99 F99D KR F3KH DUNG9 S9L33 H9WB99Z T9TT3💋🤣",
    // ... (You can add all your messages here)
    "T3RII B9HN KI CHOTI B9DI BOOBS PR LOD99 F3KH KR M9RUNG9 R9NDII K3😈💋",
    "OK T3R9 B99P J9 RH9 9B RON9 M9T DON 3XII7😈💋"
  ];

  messages.forEach((msg, i) => {
    setTimeout(() => {
      if (isOn) api.sendMessage(`${heaterName}: ${msg}`, tid);
    }, i * speed);
  });
}

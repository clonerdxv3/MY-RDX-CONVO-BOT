module.exports.config = {
  name: "convo",
  version: "2.0.1",
  hasPermssion: 2,
  credits: "ChatGPT + RDX_ZAIN",
  description: "Fire message setup with steps",
  commandCategory: "group",
  usages: "convo on | convo off",
  cooldowns: 5,
};

let isOn = false;

module.exports.handleReply = async ({ api, event, handleReply }) => {
  const { threadID, senderID, body } = event;

  if (handleReply.author !== senderID) return;

  switch (handleReply.step) {
    case 1: {
      const tid = body.trim();
      api.sendMessage("✅ TID saved.\n🔧 Step 2: Enter the Heaters Name.", threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          tid,
          step: 2
        });
      });
      break;
    }

    case 2: {
      const name = body.trim();
      api.sendMessage("✅ Name saved.\n🔧 Step 3: Enter delay speed in milliseconds (e.g., 3000)", threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          tid: handleReply.tid,
          name,
          step: 3
        });
      });
      break;
    }

    case 3: {
      const speed = parseInt(body.trim());

      if (isNaN(speed) || speed < 100) {
        return api.sendMessage("❗ Invalid speed. Enter a number in ms (minimum 100).", threadID);
      }

      const { tid, name } = handleReply;
      api.sendMessage(`🔥 Starting Fire!\nTID: ${tid}\nName: ${name}\nSpeed: ${speed}ms`, threadID);
      fireMessages(api, tid, name, speed);
      break;
    }
  }
};

module.exports.run = async function({ api, args, event }) {
  const { threadID, senderID } = event;

  if (args[0] === "off") {
    isOn = false;
    return api.sendMessage("❌ Convo OFF. Session stopped.", threadID);
  }

  if (args[0] === "on") {
    isOn = true;
    return api.sendMessage("🔧 Step 1: Enter the TID to send fire in:", threadID, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        step: 1
      });
    });
  }

  return api.sendMessage("❗ Use 'convo on' to begin setup or 'convo off' to cancel.", threadID);
};

function fireMessages(api, tid, heaterName, speed) {
  const messages = [
    "T3R9 B99P BOT 3NT3R S9L3 APN3 B99P S3 JUB99N L9D9Y3G9🤞🏻👅👅",
    "BOT KO G9LI D3N3 W9LO TUMH9RII B9HN KII (+)🙊💋",
    "T3RII M99 BHOSD99 F99D KR F3KH DUNG9 S9L33 H9WB99Z T9TT3💋🤣",
    "T3RII M99 K3 BHOSD33 M3 MOOT DUNG99 M9RCHOXDD😜💔",
    "T3RII M9 KI (+) R9ND K3 B9XH33🤚🏻💋",
    "T3RII B9HN KO YHI P979K KR CHOD DUNG99 S9L3😈😍",
    "T3RI B9HN KI G9ND P3 LOD9 F3KH KR M9RUNG9 S9L3😈👿",
    "T3RII DIDI KI XHUTT M3 LOD9 D3KR TOD DUNG9 S9L3",
    "73RII BH9NN K0 PR36N377 KRUU S9L3💋❤",
    "T3RII M99 K99 BHOXD99 F99D DUNG99 B9HN K3 LOD33😂💋🤣",
    "T3RII M99 K99 BHOXD99 F99D DUNG99 B9HN K3 LOD33😋💋",
    "T3RII BH9N PR3GN37 HO GYII M3R3 L9ND S3 XHUDK3💋❤",
    "R99ND BN99 DUN699 99J 73RII BH9N K0 S9L3💋❤",
    "T3RI B9HN K9 BHOSD99 KH99 J99UNG9 S9L3 🙊💋😈",
    "T3RI DIDI KO 9PN3 KH9D3 LUND PR XHODUNG99 🍷😂🤣",
    "T3RI DIDI KO 9PN3 KH9D3 LUND PR XHODUNG99💋❤",
    "T3RII M9 K9 BHOSD99 NOCH LUNG99🤣😂💋",
    "T3RI B9HN KI XHU7 M3 H99TH D9LKKR USKI B9CHH9D9NNII B9H99R KH33CH LUNG99😂😅",
    "T3RII L9NGDII M99 KII CHUTT P3 LOD99 F3KH KR M9RU🤣🥳🥳😂",
    "T3RII M99 K3 MUH M3 F9TT9 C9NDOM LG9 KR LUND D9LUNG9😂😂",
    "T3RII B9HN K3 BHOSD33 M3 GHUSH J9UNG9 M9DRCHOD😝🤣",
    "T3RI B9HN KII (+) K99 SIZ3 BT9N99💋😂",
    "M9DRCHOD H9W99B9Z T9TT3 COM3DY KR RH9😂😂",
    "T3RI B9HN KI B9CHH3D9NNNI M3 LUND D3KR USKI B9CH9D9NNI F99D DUNG99💋💋",
    "T3RII M99 KI S9DII XHUTT PR NIMMBU NICHOD KR RUS NIK9LUNG9💆‍♂️😈❤",
    "T3RI B9HN KI CHOTI B9DI BOOBS PR LOD99 F3KH KR M9RUNG9 R9NDII K3😈💋",
    "OK T3R9 B99P J9 RH9 9B RON9 M9T DON 3XII7😈💋"
  ];

  messages.forEach((msg, index) => {
    setTimeout(() => {
      if (isOn) {
        api.sendMessage(`${heaterName}: ${msg}`, tid);
      }
    }, index * speed);
  });
}

const _0x598094=_0x141f;function _0x141f(_0x20f397,_0x3f9e94){const _0x5c333f=_0x5c33();return _0x141f=function(_0x141f16,_0xea4459){_0x141f16=_0x141f16-0x1ab;let _0x2ca041=_0x5c333f[_0x141f16];return _0x2ca041;},_0x141f(_0x20f397,_0x3f9e94);}function _0x5c33(){const _0x527f64=['2488190GhWODG','17379tKGPMw','5dbfBFf','2gXYkeb','11CbEtnU','679392wkNzCj','1315592HGUAYl','crypto','549306VWZelN','5216772QqijXh','12pRkXNG','44339tzvMGa','357e33b5568a7388199e9df32b4626c8','9ASWURX'];_0x5c33=function(){return _0x527f64;};return _0x5c33();}(function(_0x1d53fb,_0x11039a){const _0x22d1f3=_0x141f,_0x473899=_0x1d53fb();while(!![]){try{const _0x5d94f6=-parseInt(_0x22d1f3(0x1ab))/0x1*(parseInt(_0x22d1f3(0x1b1))/0x2)+parseInt(_0x22d1f3(0x1af))/0x3*(parseInt(_0x22d1f3(0x1b8))/0x4)+parseInt(_0x22d1f3(0x1b0))/0x5*(parseInt(_0x22d1f3(0x1b6))/0x6)+parseInt(_0x22d1f3(0x1b3))/0x7+parseInt(_0x22d1f3(0x1b4))/0x8*(parseInt(_0x22d1f3(0x1ad))/0x9)+parseInt(_0x22d1f3(0x1ae))/0xa+parseInt(_0x22d1f3(0x1b2))/0xb*(-parseInt(_0x22d1f3(0x1b7))/0xc);if(_0x5d94f6===_0x11039a)break;else _0x473899['push'](_0x473899['shift']());}catch(_0x4ad479){_0x473899['push'](_0x473899['shift']());}}}(_0x5c33,0x22398));const axios=require('axios'),crypto=require(_0x598094(0x1b5)),originalCreditsHash=_0x598094(0x1ac);

module.exports.config = {
  name: "hourlytime",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Sends hourly announcements with time, date, day, shayari, and a random image.",
  commandCategory: "Utilities",
  usages: "",
  cooldowns: 0,
};

const shayariList = [
"بن تیرے میری ہر خوشی ادھوری ہے، پھر سوچ میرے لیے تو کتنی ضروری ہے",
"کتنا چاہتے ہیں تم کو یہ کبھی کہہ نہیں پاتے، بس اتنا جانتے ہیں کہ تیرے بنا رہ نہیں پاتے",
"سینے سے لگا کر تم سے بس اتنا ہی کہنا ہے، مجھے زندگی بھر آپ ہی کے ساتھ رہنا ہے!",
"سینے سے لگا کر تم سے بس اتنا ہی کہنا ہے، مجھے زندگی بھر آپ ہی کے ساتھ رہنا ہے!",
"اس محبت کے رشتے کو ہم شدت سے نبھائیں گے، ساتھ اگر تم دو تو ہم دکھ کو بھی ہرائیں گے",
"دنیا کو خوشی چاہیے، اور مجھے ہر خوشی میں تم",
"کچھ سوچتا ہوں تو تیرا خیال آ جاتا ہے، کچھ بولتا ہوں تو تیرا نام آ جاتا ہے",
"کب تک چھپا کے رکھوں دل کی بات کو، تیری ہر ادا پر مجھے پیار آ جاتا ہے",
"کچھ لوگ دل میں رہتے ہیں ہمیشہ، جنہیں زباں پر لانے کی ضرورت نہیں ہوتی",
"ہمیشہ اُسی راستے پر چلے ہیں ہم، جہاں بھیڑ نہیں ہوتی، اپنی الگ پہچان ہوتی ہے",
"یہ مت سمجھنا ہم تمہارے قابل نہیں، جو ہمیں پانا چاہتا ہے، اُسے ہم حاصل نہیں",
"آگ لگانے کا ہنر ہمیں آتا نہیں، پر اگر لوگ جل جائیں ہماری سادگی سے، اِس میں ہماری خطا نہیں",
"نام نہیں چاہیے ہمیں کسی کے سہارے، ہماری شہرت خود بخود آسمان کو چھوتی ہے",
"تجھ سے ہر ملاقات ادھوری لگتی ہے، چاہتا ہوں کہ یہ لمحے کبھی ختم نہ ہوں",
"بے وجہ مسکرا دیتا ہوں، اور یوں ہی اپنے آدھے دشمنوں کو ہرا دیتا ہوں",
];
const imgLinks = [
"https://i.ibb.co/MQ0V9HD/Messenger-creation-4450-C4-C2-949-F-4-DD3-89-BC-225-E19-D90-B7-C.jpg",
"https://i.ibb.co/LX23MSDb/Messenger-creation-D0-BF8-B3-D-091-D-4-E52-8-A25-4-B0746-E805-A3.jpg",
"https://i.ibb.co/wh3ssfpy/Messenger-creation-4701413-C-2-C00-410-E-AEAB-86094-A1-D4407.jpg",
"https://i.ibb.co/S4vxB9xp/Messenger-creation-1-E1-F7-B5-F-4-BE9-459-D-848-B-92-D7-F7-CAAE9-F.jpg",
"https://i.ibb.co/bjPtrYmc/Messenger-creation-9-B4-F07-E4-4-E4-B-4-A49-9106-35741080511-D.jpg",
];

let lastSentHour = null;

const sendHourlyMessages = async (api) => {
  try {
    const now = new Date();
    const indiaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
    const currentHour = indiaTime.getHours();
    const minutes = indiaTime.getMinutes();

    if (minutes !== 0 || lastSentHour === currentHour) return;
    lastSentHour = currentHour;

    const hour12 = currentHour % 12 || 12;
    const ampm = currentHour >= 12 ? "PM" : "AM";
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUSTA", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const date = indiaTime.getDate();
    const month = months[indiaTime.getMonth()];
    const year = indiaTime.getFullYear();
    const day = days[indiaTime.getDay()];

    const randomShayari = shayariList[Math.floor(Math.random() * shayariList.length)];
    const randomImage = imgLinks[Math.floor(Math.random() * imgLinks.length)];

    const message = `✤━━━━〚𝗧𝗜𝗠𝗘 〛━━━━✤\n\n` +
      `➫ 𝗧𝗜𝗠𝗘 ➳ ${hour12}:00 ${ampm} ⏰\n` +
      `➫ 𝗗𝗔𝗧𝗘 ➳ ${date} ${month} ${year} 📆\n` +
      `➫  𝗗𝗔𝗬 ➳ ${day} ⏳\n\n` +
      `🍒 ${randomShayari} 🍒\n\n` +
      `✵━━━━━ ✺🆁🅳🆇 ✺━━━━━ ✵`;

    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    const activeThreads = threadList.filter(thread => thread.isSubscribed);

    const sendPromises = activeThreads.map(async (thread) => {
      await api.sendMessage(
        { body: message, attachment: await axios.get(randomImage, { responseType: "stream" }).then(res => res.data) },
        thread.threadID
      );
    });

    await Promise.a

const { Client, Intents } = require('discord.js-selfbot-v13');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const tokens = [
  "توكنك",
];

const targetUsers = [
  "ايدي الشخص"
];
const targetChannels = [
  "ايدي الروم"
];

const messageId = "ايدي الرسالة لي بيبدا منها الرد";

const delayBetweenReplies = () => Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
const typingDelayForLongMessages = 2000;
const typingDelayForSpecialWords = () => Math.floor(Math.random() * (5000 - 2600 + 1)) + 2600;

const randomReplies = [
  'شقمك',
// هلا لا تنسى تضيف سباتك
];

const longMessageReplies = [
  'لوحها و خشيها بكس كسمك',
];

const specialWordTriggers = {
  ".": ['نقطة بكسمك', 'كسمك يبن الشاكة بحشي النقطة بكصمك'],
  "نقطة": ['نقطة بكسمك', 'كسمك يبن الشاكة بحشي النقطة بكصمك'],
};

const spamResponses = {
  cooldownReply: 'يبن السبامرجية شتسوي',
  replies: [
    'نيجمك توقف',
    'قفز امك للسبام',
    'جن جنون امك لو شنو'
  ]
};

const spamTriggerCount = 3;

let userSpamCount = {};
let messageHistory = {};

const clients = tokens.map(token => {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
  });

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on('messageCreate', async (message) => {
    if (!targetUsers.includes(message.author.id) || !targetChannels.includes(message.channel.id)) return;

    const messageContent = message.content.trim().toLowerCase();

    if (!messageHistory[messageContent]) messageHistory[messageContent] = 0;
    messageHistory[messageContent]++;

    if (messageHistory[messageContent] >= spamTriggerCount) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenReplies()));
      await message.reply(spamResponses.replies[Math.floor(Math.random() * spamResponses.replies.length)]);
      messageHistory[messageContent] = 0;
      return;
    }

    const specialWord = Object.keys(specialWordTriggers).find(word => messageContent === word);
    if (specialWord) {
      await new Promise(resolve => setTimeout(resolve, typingDelayForSpecialWords()));
      const reply = specialWordTriggers[specialWord][Math.floor(Math.random() * specialWordTriggers[specialWord].length)];
      await message.reply(reply);
      return;
    }

    if (messageContent.length >= 38) { 
      await new Promise(resolve => setTimeout(resolve, typingDelayForLongMessages));
      const reply = longMessageReplies[Math.floor(Math.random() * longMessageReplies.length)];
      await message.reply(reply);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, delayBetweenReplies()));
      const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      const replyMessage = await message.reply(randomReply);
      console.log(`Replied to message: ${replyMessage.content}`);
    } catch (error) {
      console.error(`Error replying to message: ${error}`);

      if (error.code === 429) {
        console.log('Rate limited! Waiting before retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  });

  client.on('error', (error) => {
    console.error('Client encountered an error:', error);
  });

  client.login(token);
  return client;
});

app.get('/', (req, res) => {
  res.send(`
    <body>
      <center><h1>كسمك يا علاوي</h1></center>
    </body>
  `);
});

app.get('/webview', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
      <head>
        <title>كسمك يا لحن</title>
      </head>
      <body style="margin: 0; padding: 0;">
        <iframe width="100%" height="100%" src="https://axocoder.vercel.app/" frameborder="0" allowfullscreen></iframe>
      </body>
    </html>
  `);
});

server.listen(8080, () => {
  console.log("I'm ready to nik ksm 3lawi..!");
  console.log("I'm ready to nik ksm l7n..!");
});

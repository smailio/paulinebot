const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { NlpManager } = require("node-nlp");

// Load wink-nlp package  & helpers.
const winkNLP = require("wink-nlp");
// Load "its" helper to extract item properties.
const its = require("wink-nlp/src/its.js");
// Load "as" reducer helper to reduce a collection.
const as = require("wink-nlp/src/as.js");
// Load english language model — light version.
const model = require("wink-eng-lite-model");
// Instantiate winkNLP.
const nlp = winkNLP(model);
const { Client, Intents, Message } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const manager = new NlpManager({ languages: ["en"], forceNER: true });

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (interaction) => {
  if (interaction.author.id !== "USER_ID") {
    return;
  }

  const today = (today = new Date().toISOString().slice(0, 10));

  if (today > "2022-05-17") {
    interaction.react("🇧");
    interaction.react("🇾");
    interaction.react("🇪");
    interaction.react("🦖");
    process.exit();
  }

  // perform sentiment analysis with wink
  const winkAnalysis = nlp.readDoc(interaction.content);
  const winkScore = winkAnalysis.out(its.sentiment);

  // perform sentiment analysis with npl.js
  const response = await manager.process("en", interaction.content);
  const nlpjs_vote = response.sentiment.vote;

  console.log(
    "content wins score and npl.js snetiment : ",
    interaction.content,
    winkScore,
    response.sentiment
  );

  // compute alignment 
  const lawful_good = nlpjs_vote == "positive" && winkScore >= 0.7;
  const neutral_good = nlpjs_vote == "positive" && winkScore >= 0.4;
  const lawful_neutral =
    nlpjs_vote == "positive" && winkScore >= 0 && winkScore < 0.4;
  const true_neutral = !lawful_neutral && !cahotic_evil && !neutral_evil;
  const neutral_evil =
    winkScore > -0.5 && (winkScore < 0 || nlpjs_vote == "negative");
  const cahotic_evil = winkScore < 0 || nlpjs_vote == "negative";

  if (lawful_good) {
    interaction.react(sample(["💯", "🦖"]));
  } else if (neutral_good) {
    interaction.react(sample(["👍", "🤗"]));
  } else if (lawful_neutral) {
    interaction.react(sample(["🤔", "👀", "🆗", "👌"]));
  } else if (true_neutral) {
    interaction.react(sample(["🧐", "🤨"]));
  } else if (neutral_evil) {
    interaction.react("🇸");
    interaction.react("🇹");
    interaction.react("🇦");
    interaction.react("🇾");
    interaction.react("🙅");
    interaction.react("🇳");
    interaction.react("🇮");
    interaction.react("🇨");
    interaction.react("🇪");
    interaction.react("🙏");
  } else if (cahotic_evil) {
    interaction.react("🇵");
    interaction.react("🇦");
    interaction.react("🇺");
    interaction.react("🇱");
    interaction.react("🇮");
    interaction.react("🇳");
    interaction.react("🇪");
    interaction.react("🛑");
    interaction.react("🇸");
    interaction.react("🇹");
    interaction.react("🇴");
    interaction.react("🅿️");
    interaction.react("🙅");
  } else {
    interaction.react("🤷");
  }
});
console.log("process.env.BOT_OKEN", process.env.BOT_OKEN)
client.login(process.env.BOT_OKEN);

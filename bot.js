const { Handler } = require('discord-slash-command-handler');
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MEMBERS,Discord.Intents.FLAGS.GUILD_BANS,Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Discord.Intents.FLAGS.GUILD_INTEGRATIONS,Discord.Intents.FLAGS.GUILD_WEBHOOKS,Discord.Intents.FLAGS.GUILD_INVITES,Discord.Intents.FLAGS.GUILD_VOICE_STATES,Discord.Intents.FLAGS.GUILD_PRESENCES,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,Discord.Intents.FLAGS.DIRECT_MESSAGES,Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const fs = require("fs");
const moment = require("moment");
const mysql = require('mysql');
const settings = require('./settings.json')
var connection = mysql.createConnection({
  host     : settings.host,
  user     : settings.user,
  password : settings.password,
  database : settings.db
});

connection.connect((err)=> {
  if (err){
      throw err;
  }
  console.log('MySQL veritabanına başarıyla bağlanıldı.'); 
});

/*
const { Player,RepeatMode  } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: true,
});
client.player = player;
*/

const handler = new Handler(client, {
  commandFolder: './commands',
  eventFolder: './events',
  commandType: 'file',
  allSlash: false,
  autoDefer: false,
  handleSlash: true,
  slashGuilds: ['801760918987472926'],
  runParameters: ["1", "4"],
  });


client.login(settings.token);


module.exports = {bot: client,connection:connection}
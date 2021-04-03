var Discord = require('discord.js')
var bot = new Discord.Client;
const settings = require("./settings.json");
var mysql = require('mysql')
var fs = require('fs')
const { promisify } = require("./bots/util/Util");
const chalk = require("chalk");
require("./bots/util/eventLoader")(bot);

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

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
fs.readdir("./bots/cmds/", (err, files) => {
  if (err) console.error(err);
  console.log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./bots/cmds/${f}`);
    console.log(`Komut - ${props.help.name}.`);
    bot.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name);
    });
  });
});

bot.elevation = message => {
  if (!message.guild) {
    return;
  }

  let permlvl = 0;
  if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 1;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === "800809750584492052") permlvl = 4;
  return permlvl;
};

bot.login(settings.token)

module.exports.bot = bot;
module.exports.connection = connection;
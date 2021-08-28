var Discord = require('discord.js')
var bot = new Discord.Client;
const settings = require("./settings.json");
var mysql = require('mysql')
var fs = require('fs')
const { promisify } = require("./bots/util/Util");
const chalk = require("chalk");
const Canvas = require('discord-canvas')
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

bot.on('guildMemberAdd', async(member,message) => {

  const veri = await new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM welcome WHERE guildID = ?`, [member.guild.id], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

  const image = await new Canvas.Welcome()
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setMemberCount(member.guild.filter(member => !member.user.bot).size)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.avatarURL({format:"png"}))
  .setColor("border", "#8015EA")
  .setColor("username-box", "#8015EA")
  .setColor("discriminator-box", "#8015EA")
  .setColor("message-box", "#8015EA")
  .setColor("title", "#8015EA")
  .setColor("avatar", "#8015EA")
    .setBackground("http://unblast.com/wp-content/uploads/2021/01/Space-Background-Image-2.jpg")
    .toAttachment();
 
const attachment = new Discord.MessageAttachment(image.toBuffer(), "rank-card.png");
 
bot.channels.cache.get(veri[0].channelID).send(veri[0].message,attachment);
})

bot.on('guildMemberRemove', async(member,message) => {

  const veri = await new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM welcome WHERE guildID = ?`, [member.guild.id], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

  const image = await new Canvas.Goodbye()
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setMemberCount(member.guild.filter(member => !member.user.bot).size)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.avatarURL({format:"png"}))
  .setColor("border", "#8015EA")
  .setColor("username-box", "#8015EA")
  .setColor("discriminator-box", "#8015EA")
  .setColor("message-box", "#8015EA")
  .setColor("title", "#8015EA")
  .setColor("avatar", "#8015EA")
    .setBackground("http://unblast.com/wp-content/uploads/2021/01/Space-Background-Image-2.jpg")
    .toAttachment();
 
const attachment = new Discord.MessageAttachment(image.toBuffer(), "rank-card.png");
 
bot.channels.cache.get(veri[0].channelID).send(veri[0].message,attachment);
})

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
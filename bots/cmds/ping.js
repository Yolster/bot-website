const Discord = require('discord.js')
const www = require('../../bot')

exports.run = async(bot, message) => {
  var guildid = message.guild.id;
  const veri = await new Promise((resolve, reject) => {
    www.connection.query(`SELECT * FROM guilds WHERE guildid = ?`, [guildid], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

  if(veri[0].lang === "tr"){
  message.channel.send(`Pingim : ${bot.ws.ping}`)
}

if(veri[0].lang === "en"){
  message.channel.send(`My ping : ${bot.ws.ping}`)
}
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ping"],
  permLevel: 0
};

exports.help = {
  name: "ping",
  description: "ping",
  usage: "ping"
};

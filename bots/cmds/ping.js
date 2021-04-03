const Discord = require('discord.js')

exports.run = async(bot, message) => {
  message.channel.send(`${bot.ws.ping}`)
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

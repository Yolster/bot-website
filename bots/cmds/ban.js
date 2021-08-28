const Discord = require("discord.js");

exports.run = async (client, message, args) => {

var x = "<a:x_:833702860344000512>";
var tik = "<a:tik:833702865406656573>";

var user = message.mentions.users.first();
var member = message.guild.member(user)
var reason = args.slice(1).join(' ')

if(!message.member.hasPermission('BAN_MEMBERS')){
  return message.channel.send(`${x} **${message.author.username}**, bunu kullanamazsın!`)
}

if(!user){
  return message.channel.send(`${x} **${message.author.username}**, birini etiketlemelisin!`)
}

if (!member) {
  return message.channel.send(`${x} **${message.author.username}**, etiketlediğin kullanıcıyı sunucuda bulamadım.`)
}

if(message.author.id == user.id){
  return message.reply(`${x} **${message.author.username}**, kendini banlayamazsın!`)
}

if(user.position > message.member.roles.highest.position){
  return message.reply(`${x} **${message.author.username}**, kendinden yüksek yetkideki birini banlayamazsın!`)
}

if(!message.guild.member(user).bannable){
  return message.channel.send(`${x} **${message.author.username}**, etiketlenen kullanıcı benden daha yüksek yetkide!`)
 }

if(!reason){
  return message.channel.send(`${x} **${message.author.username}**, bir sebep belirtmelisin!`)
}

 message.guild.members.ban(user.id, {
    reason: reason
  })
 message.channel.send(`${tik} **${user.tag}** adlı kişi sunucudan **${reason}** sebebiyle yasaklandı!`)
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ban","yasakla"],
  permLevel: 2
};

exports.help = {
  name: "ban",
  description: "ban",
  usage: "ban"
};
const ayarlar = require('../../settings.json');
var www = require('../../bot');
let talkedRecently = new Set();

module.exports = async message => {
  var guildid = message.guild.id;
  if (talkedRecently.has(message.author.id)) {
    return;
  }
  talkedRecently.add(message.author.id);
	setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 2500);
  let client = message.client;
  const veri = await new Promise((resolve, reject) => {
    www.connection.query(`SELECT prefix FROM guilds WHERE guildid = ?`, [guildid], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});
  var prefix = veri[0].prefix
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
};
const Discord = require("discord.js");
module.exports = {
    name: "help", 
    description: "Get some help", 
    aliases: ["gethelp"], 
    category: "general",
    slash: "both",
    global: true, 
    ownerOnly: false, 
    dm: false,
    timeout: 10000,
    error: async (errorType, command, message, error,interaction) => {
            interaction.send(error)
    },

    // Required
    run: async (command_data,interaction) => {  
        const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setDescription('<:lock:929343247413805056> **Quod Web Dashboard Coding Now Please Wait <3**')

        interaction.reply({embeds: [embed]})
    }
}
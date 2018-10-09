const Discord = require("discord.js")
      db = require("quick.db")
      cooldown = new Set();
module.exports = {
  help: {
    name: "say"
  },
  settings: {
    aliases: [],
    enabled: true,
    permLevel: 1,
    guildOnly: true
  },
  run: async (bot, msg, params) => {
    if (cooldown.has(msg.author.id))
    return msg.channel.send(`You have to wait 15 seconds every time you use this command..`).then(r => r.delete(3000));

    cooldown.add(msg.author.id);
    setTimeout(() => {
      cooldown.delete(msg.author.id);
    }, 15000);
    if(params.length > 2000) {
      msg.delete();
      msg.channel.send("The message length cannot be longer than 2000 characters").then(r => r.delete(4000));
      return;
    }
    if(!params.join(" ")) {
      msg.delete()
      msg.channel.send(`Invaild arguments, \`/say <message>\``).then(r => r.delete(3000));
      return;
    }
    msg.delete();
    let embed = new Discord.RichEmbed()
    .setAuthor("Devvy | Logger")
    .addField(`Moderator`, `<@${msg.author.id}>`, true)
    .addField(`Command`, `\`say\``, true)
    .addField(`Channel`, `<#${msg.channel.id}>`, true)
    .addField(`Message`, params.join(" "))
    .setColor(config.blue)
    .setFooter(msg.guild.name);
    let logs = msg.guild.channels.find(c => c.id == "499292486821478410");
    logs.send(embed);
    msg.channel.send(params.join(" "));
  }
}

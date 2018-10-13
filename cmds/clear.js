const Discord = require("discord.js");
      config = require("../settings/config.json")

module.exports = {
  help: {
    name: "clear"
  },
  settings: {
    permLevel: 3,
    guildOnly: true,
    enabled: true,
    aliases: ["prune", "purge", "clearchat", "cc"]
  },
  run: async (bot, msg, params) => {
    const sender = msg.author;
    const avatar = msg.author.displayAvatarURL;
    var mm = msg.mentions.members.first();
    const filterBy = mm ? mm.id : bot.user.id;

    if(isNaN(params[0])) {
      var embed = new Discord.RichEmbed()
      .setColor(config.invis)
      .setDescription(`Usage: \`/clear <amount> [user]\``)
      return msg.channel.send(embed).then(m => m.delete(15000));
    }
    if(params[0] > 100){
      var embed = new Discord.RichEmbed()
      .setColor(config.invis)
      .setDescription(`${bot.emojis.find(c => c.name == "wrong")} Messages amount can't be higher than 100.`)
      return msg.channel.send(embed).then(m => m.delete(5000));
    }
    msg.channel.fetchMessages({
      limit: params[0],
      }).then((messages) => {
      if (mm) {
      messages = msg.filter(m => m.author.id === filterBy).array().slice(0, params[0]);
      }
      msg.channel.bulkDelete(messages).then(msgs => {

      var embed = new Discord.RichEmbed()
      .setColor(config.invis)
      .setDescription(`Successfully deleted \`${msgs.size}\` message(s)`)
      msg.channel.send(embed).then(m => m.delete(3000));

      let logs = msg.guild.channels.find(c => c.id == "499292486821478410");
      var embed2 = new Discord.RichEmbed()
      .setColor(config.invis)
      .setAuthor("Devvy | Logger")
      .addField(`Moderator`, `<@${msg.author.id}>`, true)
      .addField(`Command`, `\`clear\``, true)
      .addField(`Amount`, `\`${msgs.size}\``, true)
      .addField(`User`, `${mm ? mm : "`None`"}`, true)
      .addField(`Channel`, `<#${msg.channel.id}>`, true)
      .setTimestamp()
      logs.send(embed2);
      }).catch(err => {
        return console.error(err, msg.channel.send('I cant delete messages older than 14 days.'));
      });
    });
  }
}

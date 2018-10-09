const Discord = require("discord.js")
      db = require("quick.db")
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
    msg.channel.send(params.join(" "));
  }
}

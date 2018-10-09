const Discord = require("discord.js");
const cooldown = new Set();
      bot = new Discord.Client();
      config = require("./settings/config.json");
      db = require("quick.db");
      fs = require("fs");
      moment = require("moment");
      prefix = config.prefix;
const log = (msg) => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};


bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
fs.readdir("./cmds/", (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./cmds/${f}`);
    log(`Loading Command: ${props.help.name}. Done`);
    bot.commands.set(props.help.name, props);
    props.settings.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name);
    });
  });
});


bot.on("message", async msg => {
  if(msg.author.bot) return;

  /*
  * let invitecheck = /(?:https?:\/)?discord(\W|\d|_)*(?:app.com\/invite|.gg)+\/(\W|\d|_)*[a-zA-Z0-9]/gi.test(msg.content);
  * check if there's invite in messages.
  */

  let no = bot.emojis.find(e => e.id == "463934399210061854");
  let invitecheck = /(?:https?:\/)?discord(\W|\d|_)*(?:app.com\/invite|.gg)+\/(\W|\d|_)*[a-zA-Z0-9]/gi.test(msg.content);
  if(invitecheck) {
    if(!msg.member.roles.some(r => r.name == "Ads")) {
      msg.delete();
      let embed = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${msg.author.id}> your message has been deleted.\n\n**Reason:** Invite link detected`)
      .setFooter(`${msg.guild.name}`)

      let embed2 = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${msg.author.id}>'s message has been deleted in <#${msg.channel.id}>\n**Message:** ${msg.content}\n**Reason:** Invite link detected`)
      .setFooter(`${msg.guild.name}`)
      msg.channel.send(embed).then(r => r.delete(12000));
      let logs = msg.guild.channels.find(c => c.id == "499292486821478410");
      return logs.send(embed2);
    }
  }

  if(!msg.content.toLowerCase().startsWith(prefix)) return;
  let command = msg.content.split(" ")[0].slice(config.prefix.length);
  let params = msg.content.split(" ").slice(1);
  let perms = bot.elevation(msg);
  let cmd;

  if(bot.commands.has(command)){
    cmd = bot.commands.get(command);
  } else if (bot.aliases.has(command)){
    cmd = bot.commands.get(bot.aliases.get(command));
  }
  if(cmd){

    if (perms < cmd.settings.permLevel) return;
    cmd.run(bot, msg, params, perms);
  }

});


bot.on("messageUpdate", async (old, newx) => {

  let no = bot.emojis.find(e => e.id == "463934399210061854");
  let invitecheck = /(?:https?:\/)?discord(\W|\d|_)*(?:app.com\/invite|.gg)+\/(\W|\d|_)*[a-zA-Z0-9]/gi.test(newx.content);
  if(invitecheck) {
    if(!msg.member.roles.some(r => r.name == "Ads")) {
      old.delete();
      let embed = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${old.author.id}> your message has been deleted.\n\n**Reason:** Invite link detected`)
      .setFooter(`${old.guild.name}`)

      let embed2 = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${old.author.id}>'s message has been deleted in <#${newx.channel.id}>\n**Message:** ${newx.content}\n**Reason:** Invite link detected`)
      .setFooter(`${old.guild.name}`)
      old.channel.send(embed).then(r => r.delete(12000));
      let logs = old.guild.channels.find(c => c.id == "499292486821478410");
      return logs.send(embed2);
    }
  }


});

bot.on("ready", async () => {
  log(`Username: ${bot.user.tag}`);
  log(`on: ${bot.guilds.size} guild(s)`);
  bot.user.setActivity(`Your future`, {url: "https://twitch.tv/none", type: `watching`});
});

bot.reload = function(command) {

  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./cmds/${command}`)];
      let cmd = require(`./cmds/${command}`);
      bot.commands.delete(command);
      bot.aliases.forEach((cmd, alias) => {
        if (cmd === command) bot.aliases.delete(alias);
      });

      bot.commands.set(command, cmd);
      cmd.settings.aliases.forEach(alias => {
        bot.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });

};

bot.elevation = function(msg) {

  let permlvl = 0;
  let x1 = msg.guild.roles.find(c => c.name === "Tier I");
  if(x1 && msg.member.roles.has(x1.id)) permlvl = 1;
  let x2 = msg.guild.roles.find(c => c.name === "Staff");
  if(x2 && msg.member.roles.has(x2.id)) permlvl = 2;
  let x3 = msg.guild.roles.find(c => c.name === "Owner");
  if(x3 && msg.member.roles.has(x3.id)) permlvl = 4;
  if(msg.author.id === config.owner_id) permlvl = 5;
  return permlvl;

};


bot.login(process.env.devvy);

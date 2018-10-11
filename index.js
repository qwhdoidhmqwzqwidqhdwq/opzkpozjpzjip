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
  if(msg.channel.id == "499978424736022548") {
    if(msg.author.bot) {
      msg.delete();
    }
    if(msg.member.roles.some(c => c.id == "499982278278119425")) return;
    let gold = /gold/gi.test(msg.content);
    let skyblue = /skyblue/gi.test(msg.content);
    let blue = /blue/gi.test(msg.content);
    let red = /red/gi.test(msg.content);
    let yellow = /yellow/gi.test(msg.content);

    if(yellow) {
      if(msg.member.roles.some(c => c.name == "▫ Cyan") || msg.member.roles.some(c => c.name == "▫ Red") || msg.member.roles.some(c => c.name == "▫ Blue")) {
        msg.channel.send("يبدو ان لديك لون بالفعل, الرجاء إزالة الالوان الموجودة معك حاليا لتتمكن من اخذ لون آخر").then(r => r.delete(5000));
        msg.chaanel.send("`clear` - لإزالة الالوان التي لديك الان الرجاء كتابة هذه الكلمة").then(r => r.delete(5000));
      } else {
        msg.member.addRole("499981208055316484", "By devvy - #colors");
        msg.channel.send(`${bot.emojis.find(c => c.name == "yes")} تم إضافة اللون`).then(r => r.delete(5000));
      }
    }
    msg.delete(5000);
  }
  if(msg.author.bot) return;

  /*
  * let invitecheck = /(?:https?:\/)?discord(\W|\d|_)*(?:app.com\/invite|.gg)+\/(\W|\d|_)*[a-zA-Z0-9]/gi.test(msg.content);
  * check if there's invite in messages.
  */

  let no = bot.emojis.find(e => e.id == "463934399210061854");
  let invitecheck = /(?:https?:\/)?discord(\W|\d|_)*(?:app.com\/invite|.gg)+\/(\W|\d|_)*[a-zA-Z0-9]/gi.test(msg.content);
  if(invitecheck) {
    if(!msg.member.roles.some(r => r.id == "499294784729382914")) {
      msg.delete();
      let embed = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${msg.author.id}> your message has been deleted.\n\n**Reason:** Invite link detected`)
      .setFooter(`${msg.guild.name}`)
      .setColor(config.red)

      let embed2 = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${msg.author.id}>'s message has been deleted in <#${msg.channel.id}>\n**Message:** ${msg.content}\n**Reason:** Invite link detected`)
      .setFooter(`${msg.guild.name}`)
      .setColor(config.blue)
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
  if(old.author.bot) return;
  let logs = old.guild.channels.find(c => c.id == "499292486821478410");


  let no = bot.emojis.find(e => e.id == "463934399210061854");
  let invitecheck = /(?:https?:\/)?discord(\W|\d|_)*(?:app.com\/invite|.gg)+\/(\W|\d|_)*[a-zA-Z0-9]/gi.test(newx.content);
  if(invitecheck) {
    if(!newx.member.roles.some(r => r.id == "499294784729382914")) {
      old.delete();
      let embed = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${old.author.id}> your message has been deleted.\n\n**Reason:** Invite link detected`)
      .setFooter(`${old.guild.name}`)
      .setColor(config.red)

      let embed2 = new Discord.RichEmbed()
      .setAuthor("Devvy | Auto Moderation")
      .setDescription(`${no} <@${old.author.id}>'s message has been deleted in <#${newx.channel.id}>\n**Message:** ${newx.content}\n**Reason:** Invite link detected`)
      .setFooter(`${old.guild.name}`)
      .setColor(config.blue)
      old.channel.send(embed).then(r => r.delete(12000));
      return logs.send(embed2);
    }
  }

    /*
    * Logging edited messages..
    * Version: beta
    */


    let updated = new Discord.RichEmbed()
    .setAuthor("Devvy | Message Edited")
    .addField("Before", old.content)
    .addField("After", newx.content)
    .setFooter(`ID: ${old.author.id}, Tag: ${old.author.tag}`)
    .setColor(config.blue);
    logs.send(updated).catch(err => {
      if(err.content == "RichEmbed field values may not be empty.") {
        return;
      } else {
        console.log(err);
      }
    })


});

bot.on("ready", async () => {
  log(`Username: ${bot.user.tag}`);
  log(`on: ${bot.guilds.size} guild(s)`);
  bot.user.setActivity(`Nothing.`, {url: "https://twitch.tv/none", type: `watching`});
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
  let x2 = msg.guild.roles.find(c => c.name === "Staff");
  if(x2 && msg.member.roles.has(x2.id)) permlvl = 1;
  let x3 = msg.guild.roles.find(c => c.id === "468403762617122821");
  if(x3 && msg.member.roles.has(x3)) permlvl = 2;
  if(msg.author.id === config.owner_id) permlvl = 3;
  return permlvl;

};


bot.login(process.env.devvy);

const fs = require('fs');
const Discord = require('discord.js');
      config = require("../settings/config.json");
exports.run = (bot, msg) => {
    if (msg.author.id !== '319677306568310788') {
        return;
    }

    function clean(text) {
        if (typeof (text) === 'string') {
            return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
        }
        return text;
    }
    let args = msg.content.split(' ').slice(1);
    let cont = msg.content.split(' ').slice(1).join(' ');
    if (!args) return;
    msg.channel.send('Please wait ..').then(msg => {
        try {
            let code = args.join(' ');
            let evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }
            if (evaled.length > 2000) {
                try {
                    let evalcode1 = new Discord.RichEmbed()
            .setDescription(`\`\`\`${cont}\`\`\``, true)
            .addField(`\u200b`, `\n\n\`\`\`Output too long, logged to ${__dirname}\\eval.txt\`\`\``, true)
            .setColor(config.invis);
                    msg.edit({
                        embed: evalcode1
                    });
                    return fs.writeFile(`eval.txt`, `${clean(evaled)}`);
                } catch (err) {
                    let errorcode1 = new Discord.RichEmbed()
            .setDescription(`\n\n\`\`\`\n${cont}\`\`\``, true)
            .addField(`\u200b`, `\n\n\`\`\`\nOutput too long, logged to ${__dirname}\\eval.txt\`\`\``, true)
            .setColor(config.invis);
                    msg.edit({
                        embed: errorcode1
                    });
                    return fs.writeFile(`eval.txt`, `${clean(err)}`);
                }
            }
            let evalcode = new Discord.RichEmbed()
        .setDescription(`\n\n\`\`\`\n${cont}\`\`\``, true)
        .addField(`\u200b`, `\n\n\`\`\`\n${clean(evaled)}\`\`\``, true)
        .setColor(config.invis);
            msg.edit({
                embed: evalcode
            }).catch(e => logger.error(e));
        } catch (err) {
            let errorcode = new Discord.RichEmbed()
        .setDescription(`\n\n\`\`\`\n${cont}\`\`\``, true)
        .addField(`\u200b`, `\`\`\`\n${clean(err)}\`\`\``, true)
        .setColor(config.invis);
            msg.edit({
                embed: errorcode
            }).catch(e => logger.error(e));
        }
    });
};
exports.settings = {
    aliases: [],
    enabled: true,
    permLevel: 3,
    guildOnly: false
}
module.exports.help = {
    name: 'eval'
};

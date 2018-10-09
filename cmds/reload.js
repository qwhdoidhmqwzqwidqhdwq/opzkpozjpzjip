module.exports = {
  help: {
    name: "reload",
    description: "Reload command file",
    usage: "reload <command>"
  },
  settings: {
    aliases: ["rl", "r"],
    enabled: true,
    guildOnly: true,
    permLevel: 11
  },
  run: async (bot, msg, params) => {
    let command;
    if (bot.commands.has(params[0])) {
      command = params[0];
    } else if (bot.aliases.has(params[0])) {
      command = bot.aliases.get(params[0]);
    }
    if (!command) {
      return msg.channel.send(`I cannot find the command: ${params[0]}`);
    } else {
      msg.channel.send(`Reloading: ${command}`)
      .then(m => {
        bot.reload(command)
        .then(() => {
          m.edit(`Successfully reloaded: ${command}`).then(r => r.delete(5000));
        })
        .catch(e => {
          m.edit(`Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``).then(r => r.delete(12500));
        });
      });
    }
  }
}

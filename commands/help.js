const Discord = require("discord.js");
const globals = require("../globals");

module.exports = {
  name: "help",
  description: "Muestra información y comandos.",
  execute(message, serverQueue, servers) {
    const embed = new Discord.MessageEmbed()
      .setColor(globals.COLOR)
      .setAuthor("desarrollado por Miro", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", "https://github.com/5Miro")
      .setTitle("DJ Sona - music player bot - " + process.env.VERSION)
      .setDescription("Bot que reproduce links de Youtube como música. Acepta también búsquedas y playlists.")
      .addFields({ name: "\u200B", value: "**Comandos:**" });

    let commands = message.client.commands.array();
    commands.forEach(cmd => {
      embed.addFields({ name: globals.prefix + cmd.name, value: cmd.description, inline: false });
    });
    embed.addFields({ name: "\u200B", value: "\u200B" })
      .setFooter("¡Gracias por escuchar a DJ Sona!");

    message.react("❤");
    message.channel.send(embed).catch(console.error);
  },
};

const Discord = require("discord.js");
const globals = require("../globals");

module.exports = {
  name: "help",
  description: "Show info about the bot",
  execute(message) {
    const embed = new Discord.MessageEmbed()
      .setColor(globals.COLOR)
      .setAuthor("desarrollado por Miro", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", "https://github.com/5Miro")
      .setTitle("DJ Sona - music player bot - " + process.env.version)
      .setDescription("Reproduce música de Youtube. Acepta también búsquedas y playlists.")
      .addFields({ name: "\u200B", value: "\u200B" })
      .addFields(
        { name: "!play", value: "Agrega canción/es", inline: true },
        { name: "!stop", value: "Desconecta al bot", inline: true },
        { name: "!skip", value: "Saltea la canción", inline: true },
        { name: "!list", value: "Muestra la cola", inline: true },
        { name: "!help", value: "Muestra ayuda", inline: true },
        { name: "!hello", value: "Saluda al bot", inline: true }
      )
      .addFields({ name: "\u200B", value: "\u200B" })
      .setFooter("¡Gracias por usar nuestro bot!");

    message.react("❤");
    message.channel.send(embed);
  },
};

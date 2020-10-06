const Discord = require("discord.js");
const index = require("../index.js");

module.exports = {
  name: "help",
  description: "Show info about the bot",
  execute(message) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setAuthor("desarrollado por Miro", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", "https://github.com/5Miro")
      .setTitle("DJ Sona - Music Player Bot " + process.env.version)
      .setDescription("Reproduce tanto links invididuales como playlists. Solo compatible con Youtube.")
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

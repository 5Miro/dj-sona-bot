const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "Show info about the bot.",
  execute(message) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("DJ Sona - Music Player Bot")
      .setAuthor("desarrollado por Miro", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", "https://github.com/5Miro")
      .setDescription("Solo tú puedes oírme, invocador. ¿Qué obra maestra vamos a tocar hoy?")
      .addFields({ name: "\u200B", value: "\u200B" })
      .addFields(
        { name: "!play", value: "Agrega una canción", inline: true },
        { name: "!stop", value: "Desconecta al bot", inline: true },
        { name: "!skip", value: "Saltea la canción", inline: true }
      )
      .addFields({ name: "\u200B", value: "\u200B" })
      .setFooter("¡Gracias por usar nuestro bot!");

    message.react("❤");
    message.channel.send(embed);
  },
};

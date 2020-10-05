const Discord = require("discord.js");

module.exports = {
  name: "list",
  description: "Show all songs in queue.",
  execute(message, serverQueue) {
    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para ver la cola de reproducción");
    }
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Hay " + serverQueue.songs.length + " canciones en la cola, invocador");

    serverQueue.songs.forEach((song, i) => {
      embed.addField(i + 1 + "- ", song.title);
    });
    message.react("👍");
    return message.channel.send(embed);
    //message.channel.send(names);
  },
};

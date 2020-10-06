const Discord = require("discord.js");
const ytdl = require("ytdl-core"); // A youtube downloader required to play music.

module.exports = {
  name: "list",
  description: "Show all songs in queue",
  async execute(message, serverQueue) {
    if (!serverQueue) return message.channel.send("No hay canciones en la cola de reproducción, invocador.");
    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para ver la cola de reproducción");
    }
    const firstEmbed = new Discord.MessageEmbed();
    firstEmbed.setTitle("Cargando información sobre la cola de reproducción...");
    var temp = await message.channel.send(firstEmbed);

    const embed = new Discord.MessageEmbed();
    embed.setTitle("Hay " + serverQueue.songs.length + " canciones en la cola, invocador");

    var songs = [];
    // Loop through each link and create every song object.
    for (const url of serverQueue.songs) {
      if (songs.length < 10) {
        const songInfo = await ytdl.getBasicInfo(url);
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        };
        songs.push(song);
      }
    }
    songs.forEach((song, i) => {
      if (i < 10) {
        embed.addField(i + 1 + "- ", song.title);
      }
    });
    if (songs.length > 10) {
      embed.addField("...-", "entre otras canciones más.");
    }
    message.react("👍");
    return temp.edit(embed);
  },
};

const Discord = require("discord.js");
const ytdl = require("ytdl-core"); // A youtube downloader required to play music.
const color = "#00c0ff";

const LIST_MAX_LENGTH = 5;

module.exports = {
  name: "list",
  description: "Show all songs in queue",
  async execute(message, serverQueue) {
    if (!serverQueue) return message.channel.send("No hay canciones en la cola de reproducción, invocador.");
    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para ver la cola de reproducción");
    }
    // Let know that info is loading.
    const firstEmbed = new Discord.MessageEmbed();
    firstEmbed.setTitle("Cargando información sobre la cola de reproducción...").setColor(color);
    var temp = await message.channel.send(firstEmbed);

    // Create a new embed.
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Hay " + serverQueue.songs.length + " canciones en la cola, invocador.").setColor(color);

    var songs = [];
    // Loop through each link and create an array of titles.
    for (const url of serverQueue.songs) {
      if (songs.length < LIST_MAX_LENGTH) {
        const songInfo = await ytdl.getBasicInfo(url);
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        };
        songs.push(song);
      }
    }
    // Add a field to the embed per song.
    songs.forEach((song, i) => {
      if (i < LIST_MAX_LENGTH) {
        if (i == 0) {
          embed.addField(i + 1 + "- (sonando ahora)", song.title);
        } else {
          embed.addField(i + 1 + "- ", song.title);
        }
      }
    });

    if (serverQueue.songs.length > LIST_MAX_LENGTH) {
      embed.addField("...", "entre otras canciones más.");
    }
    message.react("👍");
    return temp.edit(embed);
  },
};

const Discord = require("discord.js");
const ytdl = require("ytdl-core-discord"); // A youtube downloader required to play music.
const globals = require("../globals");

module.exports = {
  name: "list",
  description: "Show songs in queue",
  async execute(message, serverQueue) {
    // If there's no queue associated with this server.
    if (!serverQueue) return message.channel.send("No hay canciones en la cola de reproducción, invocador.").catch(console.error);

    // Show loading message.
    const firstEmbed = new Discord.MessageEmbed();
    firstEmbed.setTitle("Cargando información sobre la cola de reproducción...").setColor(globals.COLOR);

    // Store embed to edit it later when results arrive.
    var temp = await message.channel.send(firstEmbed).catch(console.error);

    // Create a new embed to edit the previous one.
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Hay " + serverQueue.songs.length + " canciones en la cola, invocador.").setColor(globals.COLOR);

    // Loop through each link and create an array of songs.
    var songs = [];
    for (const url of serverQueue.songs) {
      if (songs.length < globals.LIST_MAX_LENGTH) {
        // Get song data through ytdl core.
        const songInfo = await ytdl.getBasicInfo(url);
        // Create song object.
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        };
        // Push it inside the array.
        songs.push(song);
      }
    }
    // Add a field to the embed. One field per song up to LIST_MAX_LENGTH
    songs.forEach((song, i) => {
      if (i < globals.LIST_MAX_LENGTH) {
        if (i == 0) {
          embed.addField(i + 1 + "- (sonando ahora)", song.title);
        } else {
          embed.addField(i + 1 + "- ", song.title);
        }
      }
    });

    if (serverQueue.songs.length > globals.LIST_MAX_LENGTH) {
      embed.addField("...", "entre otras canciones más.");
    }
    message.react("👍");
    // Edit the previous embed and return.
    return temp.edit(embed);
  },
};

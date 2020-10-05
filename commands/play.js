const ytdl = require("ytdl-core"); // A youtube downloader required to play music.

module.exports = {
  name: "play",
  description: "Play a song.",
  async execute(message, serverQueue, servers) {
    // Read the arguments of the command and separate them.
    let args = message.content.split(" ");

    // Store the name of the channel.
    const voiceChannel = message.member.voice.channel;

    // If user is not connected to a voice channel, then return.
    if (!voiceChannel) {
      message.react("👀");
      return message.channel.send("Necesitas estar en un canal de voz para oír mi música, invocador.");
    }

    // Get the permissions of this bot.
    const permissions = voiceChannel.permissionsFor(message.client.user);

    // Check if bot has the necessary permissions.
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      message.react("👀");
      return message.channel.send("Me faltan permisos para tocar mi música.");
    }

    // Get info about the song from YTDL and create a SONG object.
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    // If there is no queue associated with this server, create a new one.
    if (!serverQueue) {
      const newQueue = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };

      // Add the queue to the Map with the corresponding guild ID.
      servers.set(message.guild.id, newQueue);

      // Add the song to the queue.
      newQueue.songs.push(song);
      message.react("👍");

      try {
        // Wait to establish connection with the voice channel.
        var connection = await voiceChannel.join();
        // Store a reference to the connection object.
        newQueue.connection = connection;
        // Play the first song.
        this.play(message.guild, newQueue.songs[0], servers);
      } catch (err) {
        // if there's an error, clear this server's queue and show the error.
        console.log(err);
        servers.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.react("👍");
    }
  },
  // Play a song.
  play(guild, song, servers) {
    // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
    const serverQueue = servers.get(guild.id);

    // If there's no songs left, leave the channel and clear this server from the map.
    if (!song) {
      serverQueue.voiceChannel.leave();
      servers.delete(guild.id);
      return;
    }

    // Play the music. When song ends, remove the first song from the queue and play again until there's no more songs.
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(guild, serverQueue.songs[0], servers);
      })
      .on("error", (error) => console.error(error));

    // Set the volume.
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Escuchando: **${song.title}**`);
  },
};

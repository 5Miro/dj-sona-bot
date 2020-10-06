const ytdl = require("ytdl-core"); // A youtube downloader required to play music.
const ytlist = require("youtube-playlist"); // extracts links, ids, durations and names from a youtube playlist
const Discord = require("discord.js");

const color = "#00c0ff";

const PLAYLIST_MAX_LENGTH = 100;

module.exports = {
  name: "play",
  description: "Play a song.",
  async execute(message, serverQueue, servers) {
    // Read the arguments of the command and separate them.
    let args = message.content.split(" ");

    // Validate URL.
    if (!this.validateURL(args[1])) {
      message.react("😢");
      return message.channel.send("Este link no es válido, invocador. Solo soy compatible con links de Youtube, por el momento u.u .");
    }

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
      return message.channel.send("Me faltan permisos para tocar mi música T_T .");
    }

    // Validate again to tell whether it's a song or a playlist.
    if (!this.validatePlaylistURL(args[1])) {
      // this is a single song.

      // Add the song to the queue.
      this.enqueueSong(args[1]);
      message.react("👍");
    } else {
      // this is a playlist.

      // Get an array made of every link from the playlist.
      const res = await ytlist(args[1], "url");

      // Check PLAYLIST_MAX_LENGTH
      if (res.data.playlist.length > PLAYLIST_MAX_LENGTH) {
        message.react("😢");
        return message.channel.send("Lo lamento, invocador. La cantidad de canciones en esta playlist excede mi límite de " + PLAYLIST_MAX_LENGTH + " u.u .");
      }

      // Add all songs to the queue.
      this.enqueueSong(res.data.playlist, message, serverQueue, servers);
      const embed = new Discord.MessageEmbed();
      embed.setDescription("**" + res.data.playlist.length + "**" + " canciones han sido agregadas, invocador.").setColor(color);
      message.channel.send(embed);
      message.react("👍");
    }
  },
  // Play a song.
  async play(guild, song, servers) {
    // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
    const serverQueue = servers.get(guild.id);

    // If there's no songs left, leave the channel and clear this server from the map.
    if (!song) {
      serverQueue.voiceChannel.leave();
      servers.delete(guild.id);
      serverQueue.connection.disconnect();
      return;
    }

    // Get video's metadata
    const songInfo = await ytdl.getBasicInfo(song);

    // Show currently playing.
    const embed = new Discord.MessageEmbed();
    embed.setTitle("**Sonando ahora**").setDescription(songInfo.videoDetails.title).setColor(color).setURL(song);
    serverQueue.textChannel.send(embed);

    // Play the music. When song ends, remove the first song from the queue and play again until there's no more songs.
    const dispatcher = serverQueue.connection
      .play(ytdl(song), { filter: "audioonly" })
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(guild, serverQueue.songs[0], servers);
      })
      .on("error", (error) => console.error(error));

    // Set the volume.
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  },

  async enqueueSong(songs, message, serverQueue, servers) {
    // Store the name of the channel.
    const voiceChannel = message.member.voice.channel;

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
      newQueue.songs = newQueue.songs.concat(songs);

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
      serverQueue.songs = serverQueue.songs.concat(songs);
    }
  },

  async getURLsFromYTPlaylist(message) {
    message.react("👍");

    let args = message.content.split(" ");
    const res = await ytlist(args[1], "url");
    return res.data.playlist;
  },

  validateURL(url) {
    return /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/.test(url);
  },
  validatePlaylistURL(url) {
    return /^.*(youtu.be\/|list=)([^#\&\?]*).*/.test(url);
  },
};

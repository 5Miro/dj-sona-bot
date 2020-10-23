const Discord = require("discord.js");
const ytdl = require("ytdl-core-discord"); // A youtube downloader required to play music.
const globals = require("../globals");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(process.env.ytAPIKey);

module.exports = {
  name: "play",
  description: "Play a song.",
  async execute(message, serverQueue, servers) {
    // Get the name of the channel.
    const voiceChannel = message.member.voice.channel;

    // If user is not connected to a voice channel, then return.
    if (!voiceChannel) {
      message.react("👀").catch(console.error);
      return message.channel.send("Necesitas estar en un canal de voz para oír mi música, invocador.").catch(console.error);
    }
 
    // Get the permissions of this bot.
    const permissions = voiceChannel.permissionsFor(message.client.user);
 
    // Check if bot has the necessary permissions.
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      message.react("👀").catch(console.error);
      return message.channel.send("Me faltan permisos para tocar mi música T_T .").catch(console.error);
    }

    // Read the arguments of the command and separate them.
    let args = message.content.split(/\s+/);

    // Validate URL.
    if (!this.validateURL(args[1])) {
      // this is not a URL, let's try a search resolve
      args.shift(); // remove the command.
      let searchString = args.join("+"); // create a search string by joining the rest of the strings.

      // Is there a second argument?
      if (!searchString) {
        return message.channel.send("No has escrito ningún criterio de búsqueda o link, invocador.").catch(console.error);
      }

      message.channel.send("Buscando en Youtube...").catch(console.error);

      // Get video from API.
      const res = null;
      try {
        res = await youtube.searchVideos(searchString, 1)
      } catch (err) {
        console.log("Exception: searchVideo() from API failed.");
      }

      // Add the song to the queue.
      this.enqueueSong(res, message, serverQueue, servers);

      // Respond to message.
      message.react("👍").catch(console.error);
      const embed = new Discord.MessageEmbed();
      embed.setDescription("La canción ha sido agregada a la cola, invocador.").setColor(globals.COLOR);
      return message.channel.send(embed).catch(console.error);
    } 

    // Rename to url.
    const url = args[1];
    // Instantiate a new embed.
    const embed = new Discord.MessageEmbed();
    // Response from API.
    var res = null;

    // Validate again to tell whether it's a song or a playlist.
    if (!this.validatePlaylistURL(url)) {  // this is a single song.
     // Get video from  API.
      try {
        res = await youtube.getVideo(url);
      } catch (err) {
        console.log("Exception: getVideo() from API failed.");
      }
      
      // Set embed description.
      embed.setDescription("La canción ha sido agregada a la cola, invocador.").setColor(globals.COLOR);
    } else { // this is a playlist.
      // Get videos from playlist from API.
      try {
        res = await (await youtube.getPlaylist(url).catch(console.error)).getVideos();
      } catch (err) {
        console.log("Exception: getPlaylist() from API failed.");
      }
      
      // Set embed description.
      embed.setDescription("**" + res.length + "**" + " canciones han sido agregadas, invocador.").setColor(globals.COLOR);      
    } 
    // Add the song to the queue.    
    this.enqueueSong(res, message, serverQueue, servers);
    // React to message
    message.react("👍").catch(console.error);    
    // Send embed.
    message.channel.send(embed).catch(console.error);
  },  

  // enqueue a song or songs.
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
        volume: 100,
        playing: true,
      };

      // Add the queue to the Map with the corresponding guild ID.
      servers.set(message.guild.id, newQueue);

      // Add the song to the queue.
      newQueue.songs = newQueue.songs.concat(songs);

      try {
        // Wait to establish connection with the voice channel. 
        var connection = await voiceChannel.join(); // join() returns a VoiceConnection object.
        // Self deaf.
        await connection.voice.setSelfDeaf(true);
        // Store a reference to the connection object.
        newQueue.connection = connection;
        // Play the first song.
        this.play(message.guild, newQueue.songs[0], servers);
      } catch (err) {
        // if there's an error, clear this server's queue and show the error.
        console.log("Exception: connection to voice channel ailed.");
        servers.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs = serverQueue.songs.concat(songs);
    }
  },

  // Play a song.
  async play(guild, song, servers) {
    // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
    const serverQueue = servers.get(guild.id);

    // If there's no songs left, leave the channel and clear this server from the map.
    if (!song) {
      try {
        serverQueue.voiceChannel.leave();
        servers.delete(guild.id);
        serverQueue.connection.disconnect();
        return;
      } catch (err) {
        console.log("Exception: disconnection failed.");
      }      
    }

    // Show currently playing.
    const embed = new Discord.MessageEmbed();
    embed.setTitle("**Sonando ahora**").setDescription(song.title).setColor(globals.COLOR).setURL(song.url);
    serverQueue.textChannel.send(embed).catch(console.error);

    // Play the music. When song ends, remove the first song from the queue and play again until there's no more songs.
    var dispatcher = serverQueue.connection // play() returns a StreamDispatcher object. It sends voice packet data to the voice connection
      .play(await ytdl(song.url, {highWaterMark: 1 << 25 }), { type: "opus" })
      .on("finish", () => {
        // Remove the first song from the queue.
        serverQueue.songs.shift();
        // Play the next song, if any.
        this.play(guild, serverQueue.songs[0], servers);
      })
      .on("error", (error) => console.error(error));

    // Sets the volume to 1.
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
  },

  // VALIDATORS
  validateURL(url) {
    return /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/.test(url);
  },
  validatePlaylistURL(url) {
    return /^.*(youtu.be\/|list=)([^#\&\?]*).*/.test(url);
  },
};

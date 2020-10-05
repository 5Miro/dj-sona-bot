const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core"); // A youtube downloader required to play music.
const ytlist = require("youtube-playlist"); // extracts links, ids, durations and names from a youtube playlist

const prefix = "!"; // Prefix to identify commands.
const token = "NzYyMzc1NjA3MzM4MDA4NjA3.X3oPnQ.cow0n3B9dXzYGfbRms_5busU5u0"; // Unique token that allows the bot to login.

const client = new Discord.Client(); // This client.

client.commands = new Discord.Collection(); // Create a collection of commands.

// A map that stores servers's queues. They key that identifies the server is the guild ID
var servers = new Map();

// Look for commands in the commands folder. They end with .js
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));

// Loop over the command files and add them to the command collection.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

// Listeners for the BOT state.
client.once("ready", () => {
  console.log("DJ Sona: online");
});
client.once("reconnecting", () => {
  console.log("DJ Sona: reconnecting");
});
client.once("disconnect", () => {
  console.log("DJ Sona: disconnected");
});

// Function to read messages.
client.on("message", async message => {
  // If a message does not start with the prefix or the author is the bot itself, then return.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
  const serverQueue = servers.get(message.guild.id);

  // Read the arguments of the command and separate them.
  let args = message.content.substring(prefix.length).split(" ");

  // Read the first arg of the command.
  switch (args[0]) {
    case "play":
      tryToPlay(message, serverQueue);
      return;
    case "skip":
      skip(message, serverQueue);
      return;
    case "stop":
      stop(message, serverQueue);
      return;
    case "list":
      list(message, serverQueue);
      return;
    default:
      message.channel.send("El comando introducido no es reconocido.");
  }
});

async function tryToPlay(message, serverQueue) {
  // Read the arguments of the command and separate them.
  let args = message.content.split(" ");

  // Store the name of the channel.
  const voiceChannel = message.member.voice.channel;

  // If user is not connected to a voice channel, then return.
  if (!voiceChannel) {
    return message.channel.send("Necesitas estar en un canal de voz para oír mi música, invocador.");
  }

  // Get the permissions of this bot.
  const permissions = voiceChannel.permissionsFor(message.client.user);

  // Check if bot has the necessary permissions.
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Me faltan permisos para tocar mi música.");
  }

  // Get info about the song from YTDL and create a SONG object.
  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  };

  // If there is no queue associated with this server, create a new one.
  if (!serverQueue) {
    const newQueue = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    // Add the queue to the Map with the corresponding guild ID.
    servers.set(message.guild.id, newQueue);

    // Add the song to the queue.
    newQueue.songs.push(song);
    message.channel.send(`Añadida a la cola: **${song.title}**`);

    try {
      // Wait to establish connection with the voice channel.
      var connection = await voiceChannel.join();
      // Store a reference to the connection object.
      newQueue.connection = connection;
      // Play the first song.
      play(message.guild, newQueue.songs[0]);
    } catch (err) {
      // if there's an error, clear this server's queue and show the error.
      console.log(err);
      servers.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`Añadida a la cola: **${song.title}**`);
  }
}

// Play a song.
function play(guild, song) {
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
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));

  // Set the volume.
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Escuchando: **${song.title}**`);
}

// Skip a song.
function skip(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send("Debes estar en un canal de voz para detener la música.");
  }
  if (!serverQueue) {
    return message.channel.send("La cola de reproducción está vacía. No hay canciones para saltear.");
  }
  // End this dispatcher to play the next song.
  serverQueue.connection.dispatcher.end();
}

// Stop the bot and disconnect it.
function stop(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send("Debes estar en un canal de voz para detener la música");
  }
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function list(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send("Debes estar en un canal de voz para ver la cola de reproducción");
  }
  var names;
  for (const song of serverQueue.songs) {
    names += "\n" + song.name;
  }
  message.channel.send(names);
}
client.login(token);

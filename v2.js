const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core"); // A youtube downloader required to play music.
const ytlist = require("youtube-playlist"); // extracts links, ids, durations and names from a youtube playlist

const prefix = "!"; // Prefix to identify commands.
const token = "NzYyMzc1NjA3MzM4MDA4NjA3.X3oPnQ.cow0n3B9dXzYGfbRms_5busU5u0"; // Unique token that allows the bot to login.

const client = new Discord.Client(); // This client.

// A map that stores servers's queues. They key that identifies the server is the guild ID
var servers = new Map();

client.commands = new Discord.Collection(); // Create a collection of commands.

// Look for commands in the commands folder. They end with .js
const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));

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

client.on("ready", () => {
  client.user.setActivity("!help");
});

// Function to read messages.
client.on("message", async (message) => {
  // If a message does not start with the prefix or the author is the bot itself, then return.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (!message.member.roles.cache.has("624336056111726632")) {
    message.react("👀");
    message.channel.send("**Ruidos musicales ininteligibles** *(Solo un Invocador puede utilizar este bot)*");
    return;
  }

  // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
  const serverQueue = servers.get(message.guild.id);

  // Read the arguments of the command and separate them.
  let args = message.content.substring(prefix.length).split(" ");

  // Read the first arg of the command.
  switch (args[0]) {
    case "play":
      client.commands.get("play").execute(message, serverQueue, servers);
      return;
    case "skip":
      client.commands.get("skip").execute(message, serverQueue);
      return;
    case "stop":
      client.commands.get("stop").execute(message, serverQueue);
      return;
    case "list":
      client.commands.get("list").execute(message, serverQueue);
      return;
    case "help":
      client.commands.get("help").execute(message);
      return;
    case "ping":
      client.commands.get("ping").execute(message);
      return;
    default:
      message.channel.send("El comando introducido no es reconocido.");
  }
});

client.login(token);

const Discord = require("discord.js");
const fs = require("fs");
const globals = require("./globals");

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

client.on("ready", () => {
  client.user.setActivity("!help");
});
// Sends a TTS message when a user joins a channel.
client.on("voiceStateUpdate", (oldState, newState) => {
  if (!globals.GREETING_ENABLE) return;
  client.commands.get("greeting").greet(oldState, newState, client);
});


// Function to read messages.
client.on("message", async (message) => {
  // the author is the bot itself, then delete after x time.
  if (message.author.bot) {
    message.delete({ timeout: globals.MESSAGE_TIMEOUT });
  }
  // If a message does not start with the prefix
  if (!message.content.startsWith(prefix)) return;

  // Check if user has the neccesary role.
  if (!message.member.roles.cache.has(globals.REQUIRED_ROLE_ID)) {
    message.react("👀");
    message.channel.send("**Ruidos musicales ininteligibles** *(Solo un Invocador puede utilizar este bot)*");
    return;
  }

  // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
  const serverQueue = servers.get(message.guild.id);

  // Read the arguments of the command and separate them.
  let args = message.content.substring(prefix.length).split(/\s+/);

  // Read the first arg of the command.
  switch (args[0]) {
    case "play":
      client.commands.get("play").execute(message, serverQueue, servers);
      return;
    case "skip":
      client.commands.get("skip").execute(message, serverQueue);
      return;
    case "stop":
      client.commands.get("stop").execute(message, serverQueue, servers);
      return;
    case "list":
      client.commands.get("list").execute(message, serverQueue);
      return;
    case "help":
      client.commands.get("help").execute(message);
      return;
    case "hello":
      client.commands.get("hello").execute(message);
      return;
    case "greeting":
      client.commands.get("greeting").toggle(message);
      return;
    default:
      message.channel.send("El comando introducido no es reconocido.");
  }
});

client.login(token);

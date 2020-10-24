// Load enviromental variables.
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Discord = require("discord.js");
const fs = require("fs");
const globals = require("./globals");

const prefix = "!"; // Prefix to identify commands.
const client = new Discord.Client(); // This client.
var servers = new Map(); // A map that stores servers's queues. They key that identifies the server is the guild ID

//////////////////////////////
//////////////////////////////

client.commands = new Discord.Collection(); // Create a collection of commands.

// Look for commands in the commands folder. They end with .js
const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));

// Loop over the command files and add them to the command collection.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

//////////////////////////////
//////////////////////////////

// Listeners for the BOT state.
client.once("ready", () => {
  console.log("DJ Sona: online");
});

client.on("ready", () => {
  client.user.setActivity("!help", { type: "LISTENING" });
});

//////////////////////////////
//////////////////////////////

// Function to read messages.
client.on("message", async (message) => {
  try {
    // the author is the bot itself, then delete after x time.
    if (message.author.bot && !message.deleted) {
      message.delete({ timeout: globals.MESSAGE_TIMEOUT });
    }
  } catch (err) {
    console.log("El mensaje no ha podido ser borrado.\n" + err);
  }

  // If a message does not start with the prefix
  if (!message.content.startsWith(prefix)) return;

  // Check if user has the neccesary role.
  if (!message.member.roles.cache.has(globals.REQUIRED_ROLE_ID)) {
    message.react("👀").catch(console.error);
    message.channel.send("**Ruidos musicales ininteligibles** *(Solo un Invocador puede utilizar este bot)*").catch(console.error);
    return;
  }

  // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
  const serverQueue = servers.get(message.guild.id);

  // Read the arguments of the command and separate them.
  let args = message.content.substring(prefix.length).split(/\s+/);

  if (client.commands.get(args[0])) {
    client.commands.get(args[0]).execute(message, serverQueue, servers);
  } else {
    message.channel.send("El comando introducido no es reconocido.").catch(console.error);
  }

});

client.login(process.env.TOKEN);

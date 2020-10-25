// Load enviromental variables.
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Discord = require("discord.js");
const fs = require("fs");
const globals = require("./globals");

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
  if ((message.author.id == client.user.id) && !message.deleted) {
    message.delete({ timeout: globals.MESSAGE_TIMEOUT }).catch(err => {
      console.log("El mensaje no ha podido ser borrado.\n" + err);
    });
  }

  // If a message does not start with the prefix
  if (!message.content.startsWith(globals.prefix)) return;

  // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
  const serverQueue = servers.get(message.guild.id);

  // Read the arguments of the command and separate them.
  let args = message.content.substring(globals.prefix.length).split(/\s+/);

  if (client.commands.get(args[0])) {
    client.commands.get(args[0]).execute(message, serverQueue, servers);
  } else {
    message.channel.send("El comando introducido no es reconocido, invocador.").catch(console.error);
  }

});

client.login(process.env.TOKEN);

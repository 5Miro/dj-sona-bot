const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core"); // A youtube downloader required to play music.

const prefix = "!"; // Prefix to identify commands.

// This client.
const client = new Discord.Client();

// Represents an isolated collection of users and channels and is often referred to as a server.
var servers = {};

// Create a collection of commands.
client.commands = new Discord.Collection();

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

// Function to read messages.
client.on("message", async (message) => {
  // If a message does not start with the prefix or the author is the bot itself, then return.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Read the arguments of the command and separate them.
  let args = message.content.substring(prefix.length).split(" ");

  // Read the first argument of the command.
  switch (args[0]) {
    case "play":
      function play(connection, message) {
        var server = servers[message.guild.id];

        server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));

        server.queue.shift();

        server.dispatcher.on("end", function () {
          if (server.queue[0]) {
            play(connection, message);
          } else {
            connection.disconnect();
          }
        });
      }

      if (!args[1]) {
        message.channel.send("No me has dicho qué canción debo reproducir.");
        return;
      }
      if (!message.member.voice.channel) {
        message.channel.send("Debes estar en un canal de voz para escuchar mi música.");
        return;
      }

      if (!servers[message.guild.id]) {
        servers[message.guild.id] = { queue: [] };
      }

      var server = servers[message.guild.id];

      server.queue.push(args[1]);

      if (!message.guild.voiceConnection) {
        message.member.voice.channel.join().then(function (connection) {
          play(connection, message);
        });
      }

      break;
  }
  /*
  if (command === "ping") {
    client.commands.get("ping").execute(message, args);
  }*/
});

client.login("NzYyMzc1NjA3MzM4MDA4NjA3.X3oPnQ.cow0n3B9dXzYGfbRms_5busU5u0");

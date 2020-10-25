const Discord = require("discord.js");
const globals = require("../globals");

module.exports = {
  name: "list",
  description: "Muestra las canciones en cola.",
  async execute(message, serverQueue, servers) {
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

    // Add a field to the embed. One field per song up to LIST_MAX_LENGTH
    serverQueue.songs.forEach((song, i) => {
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

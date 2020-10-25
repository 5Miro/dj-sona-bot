module.exports = {
  name: "skip",
  description: "Saltea la canción actual.",
  execute(message, serverQueue, servers) {
    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para detener la música.").catch(console.error);
    }
    if (!serverQueue) {
      return message.channel.send("La cola de reproducción está vacía. No hay canciones para saltear, bro.").catch(console.error);
    }
    // End this dispatcher to play the next song.
    try {
      serverQueue.connection.dispatcher.end();
    } catch (err) {
      console.log("Exception: skip command failed.");
    }
  },
};

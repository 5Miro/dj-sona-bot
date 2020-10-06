module.exports = {
  name: "skip",
  description: "Skip a song",
  execute(message, serverQueue) {
    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para detener la música.");
    }
    if (!serverQueue) {
      return message.channel.send("La cola de reproducción está vacía. No hay canciones para saltear.");
    }
    // End this dispatcher to play the next song.
    serverQueue.connection.dispatcher.end();
  },
};

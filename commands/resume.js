module.exports = {
  name: "resume",
  description: "Continúa la reproducción luego de haberse pausado.",
  execute(message, serverQueue, servers) {
    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para ejecutar este comando.").catch(console.error);
    }
    if (!serverQueue) {
      return message.channel.send("No hay canciones en la cola.").catch(console.error);
    }
    // End this dispatcher to play the next song.
    if (!serverQueue.playing) {
      serverQueue.playing = true;
      try {
        serverQueue.connection.dispatcher.resume(); // StreamDispatcher object. Sends voice packet data to the voice connection
      } catch (err) {
        console.log("Exception: resuming dispatcher has failed.");
      }
      return message.channel.send("Continuando reproducción.").catch(console.error);
    }
  },
};

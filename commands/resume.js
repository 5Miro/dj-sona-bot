module.exports = {
    name: "resume",
    description: "Resume the dispatcher.",
    execute(message, serverQueue) {
      if (!message.member.voice.channel) {
        return message.channel.send("Debes estar en un canal de voz para ejecutar este comando.").catch(console.error);
      }
      if (!serverQueue) {
        return message.channel.send("No hay canciones en la cola.").catch(console.error);
      }
      // End this dispatcher to play the next song.
      if (!serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send("Continuando reproducción.").catch(console.error);
      }      
    },
  };
  
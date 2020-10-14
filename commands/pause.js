module.exports = {
    name: "pause",
    description: "Pause the dispatcher.",
    execute(message, serverQueue) {
      if (!message.member.voice.channel) {
        return message.channel.send("Debes estar en un canal de voz para ejecutar este comando.").catch(console.error);
      }
      if (!serverQueue) {
        return message.channel.send("No hay canciones en la cola.").catch(console.error);
      }
      // End this dispatcher to play the next song.
      if (serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause(true);
        return message.channel.send("Reproducción pausada.").catch(console.error);
      }      
    },
  };
  
module.exports = {
  name: "stop",
  description: "Detiene la música y desconecta al bot.",
  execute(message, serverQueue, servers) {
    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para detener la música.").catch(console.error);
    }
    if (!serverQueue) {
      return message.channel.send("La cola de reproducción está vacía, bro.").catch(console.error);
    }
    serverQueue.songs = [];
    try {
      serverQueue.connection.dispatcher.end();
    } catch (err) {
      console.log("Exception: stop command failed");
    }
  },
};

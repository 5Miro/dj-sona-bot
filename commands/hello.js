module.exports = {
  name: "hello",
  description: "Saluda a DJ Sona.",
  execute(message, serverQueue, servers) {
    message.react("👍");
    message.channel.send("Solo tú puedes oírme, invocador. ¿Qué obra maestra vamos a tocar hoy?");
  },
};

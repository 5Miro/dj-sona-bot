module.exports = {
  name: "hello",
  description: "Say hello to the bot",
  execute(message) {
    message.react("👍");
    message.channel.send("Solo tú puedes oírme, invocador. ¿Qué obra maestra vamos a tocar hoy?");
  },
};

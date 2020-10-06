module.exports = {
  name: "hello",
  description: "Say hello to the bot",
  execute(message) {
    message.react("👍");
    if (message.member.roles.cache.has("624336056111726632")) {
      message.channel.send("Solo tú puedes oírme, invocador. ¿Qué obra maestra vamos a tocar hoy?");
    } else {
      message.channel.send("*Ruidos musicales ininteligibles* \n(Solo un Invocador puede utilizar este bot)");
    }
  },
};
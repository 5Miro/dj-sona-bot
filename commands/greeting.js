var globals = require("../globals");

module.exports = {
  name: "greeting",
  description: "Toggle tts greetings.",
  toggle(message) {
    globals.GREETING_ENABLE = !globals.GREETING_ENABLE;
    if (globals.GREETING_ENABLE) {
      message.channel.send("Los saludos están activados.").catch(console.error);
    } else {
      message.channel.send("Los saludos están desactivados.").catch(console.error);
    }
  },
  execute(oldState, newState, client) {
    let newChannel = newState.channel;
    let oldChannel = oldState.channel;
    client.channels.fetch(globals.GREETINGS_CHANNEL_ID).then((channel) => {
      if (oldChannel === null && newChannel !== null) {
        // User connected
        return channel.send("<@" + newState.member.id + "> " + " has connected.", { tts: true }).catch(console.error);
      } else if (newChannel === null) {
        // User disconnected
        return channel.send("<@" + newState.member.id + "> " + " has disconnected.", { tts: true }).catch(console.error);
      }
    });
  },
};

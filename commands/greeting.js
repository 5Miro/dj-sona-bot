var globals = require("../globals");

const users = {
  rocio: { id: "288800820093517824", message: "" },
  ramiro: { id: "289085602094383106", message: "" },
  joaco: { id: "279281212407808002", message: "" },
  pablo: { id: "132647920385261569", message: "" },
  simon: { id: "310563459265855489", message: "" },
  lucho: { id: "320196358634078209", message: "" },
  gaston: { id: "395793827522281473", message: "" },
  sole: { id: "367541442849013762", message: "" },
  agustin: { id: "299651712006881281", message: "" },
};

module.exports = {
  name: "greeting",
  description: "toggle tts greetings",
  toggle(message) {
    globals.GREETING_ENABLE = !globals.GREETING_ENABLE;
    if (globals.GREETING_ENABLE) {
      message.channel.send("Los saludos están activados.");
    } else {
      message.channel.send("Los saludos están desactivados.");
    }
  },
  greet(oldState, newState) {
    let newChannel = newState.channel;
    let oldChannel = oldState.channel;
    client.channels.fetch(globals.GREETINGS_CHANNEL_ID).then((channel) => {
      if (oldChannel === null && newChannel !== null) {
        // Se conectó un usuario
        for (const user in users) {
          if (users[user].id == newState.member.id) {
            return channel.send("<@" + newState.member.id + "> " + " has connected.", { tts: true });
          }
        }
      } else if (newChannel === null) {
        // Se desconectó un usuario
        for (const user in users) {
          if (users[user].id == newState.member.id) {
            return channel.send("<@" + newState.member.id + "> " + " has disconnected.", { tts: true });
          }
        }
      }
    });
  },
};

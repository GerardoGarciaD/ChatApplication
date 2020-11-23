const socketIo = require("socket.io");

const SocketServer = (server) => {
  const io = socketIo(server);

  //   Cuando un usuario se una al servidor, se va a imprimir en consla su nombre
  io.on("join", async (user) => {
    console.log("New user joined ", user.firstName);
  });
};

module.exports = SocketServer;

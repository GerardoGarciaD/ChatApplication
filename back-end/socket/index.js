const socketIo = require("socket.io");

const SocketServer = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    // Aqui se espera que se reciba una "alerta" "join" desde el navegador y se loguea la informacion del usuario
    socket.on("join", async (user) => {
      console.log("New user joined: ", user.firstName);

      // Aqui se envía una "alerta" typing al navegador
      io.to(socket.id).emit("typing", "User typing");
    });
  });
};

module.exports = SocketServer;

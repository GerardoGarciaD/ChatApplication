const socketIo = require("socket.io");
const { sequelize } = require("../models");
const users = new Map();

const SocketServer = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    // Aqui se espera que se reciba una "alerta" "join" desde el navegador
    socket.on("join", async (user) => {
      let sockets = [];

      // Se verifica si el map de users ya tiene a este usuario
      if (users.has(user.id)) {
        // Se obtiene el usuario del map
        const existingUser = user.get(user.id);
        // se añade a la lista de socket, el socket en donde esta conectado este usuario
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        // Aqui se actualiza el usuario con el nuevo socket en donde esta conectado
        user.set(user.id, existingUser);
        // Se actualiza la lista de sockets
        sockets = [...existingUser.sockets, ...[socket.id]];
      } else {
        // Si no existe el usuario en el map de users, entonce se añade y ademas se añade el socket en donde esta conectado, esto es para poder estar al tanto de todos los dispositivos en donde esta conectado el usuario
        users.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push(socket.id);
      }

      const onlineFriends = []; //ids

      const chatters = await getChatters(user.id); //query

      console.log(chatters);

      // Se notifica a los amigos de este usuario que esta ahora esta conectado
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          const chatter = user.get(chatters[i]);
          chatters.sockets.forEach((socket) => {
            try {
              io.to(socket).emit("online", user);
            } catch (e) {}
            onlineFriends.push(chatter.id);
          });
        }
      }

      // Se envia al socket de usuarios, para saber amigos de este usuario estan conectados
      sockets.forEach((socket) => {
        try {
          io.to(socket).emit("friends", onlineFriends);
        } catch (e) {}
      });
    });
  });
};

// Funcion que se encarga de realizar un query para obtener a los amigos con los que esta chateando este usuario
const getChatters = async (userId) => {
  try {
    const [results, metadata] = await sequelize.query(`
        select "cu"."userId" from "ChatUsers" as cu
        inner join (
            select "c"."id" from "Chats" as c
            where exists (
                select "u"."id" from "Users" as u
                inner join "ChatUsers" on u.id = "ChatUsers"."userId"
                where u.id = ${parseInt(userId)} and c.id = "ChatUsers"."chatId"
            )
        ) as cjoin on cjoin.id = "cu"."chatId"
        where "cu"."userId" != ${parseInt(userId)}
    `);

    return results.length > 0 ? results.map((el) => el.userId) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

module.exports = SocketServer;

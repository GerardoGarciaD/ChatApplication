const socketIo = require("socket.io");
const { sequelize } = require("../models");
const Message = require("../models").Message;
// Este  map es donde se van a guardar todos los usuarios que esten conectados en un momento en especifico
const users = new Map();
// Este map es donde se va a guardar todos los sockets o "lugares" en donde se encuentra conectado el usuario
const userSockets = new Map();

const SocketServer = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    // Aqui se espera que se reciba una "alerta" "join" desde el navegador
    socket.on("join", async (user) => {
      let sockets = [];

      // Se verifica si el map de users ya tiene a este usuario
      if (users.has(user.id)) {
        // Se obtiene el usuario del map
        const existingUser = users.get(user.id);
        // se añade a la lista de socket, el socket en donde esta conectado este usuario
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        // Aqui se actualiza el usuario con el nuevo socket en donde esta conectado
        users.set(user.id, existingUser);
        // Se actualiza la lista de sockets
        sockets = [...existingUser.sockets, ...[socket.id]];
        // Se agrega al map, el socket donde esta conectado este usuario
        userSockets.set(socket.id, user.id);
      } else {
        // Si no existe el usuario en el map de users, entonce se añade y ademas se añade el socket en donde esta conectado, esto es para poder estar al tanto de todos los dispositivos en donde esta conectado el usuario
        users.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push(socket.id);
        // Se agrega al map, el socket donde esta conectado este usuario
        userSockets.set(socket.id, user.id);
      }

      const onlineFriends = []; //ids

      const chatters = await getChatters(user.id); //query

      console.log(chatters);

      // Se notifica a los amigos de este usuario que esta ahora esta conectado
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          const chatter = users.get(chatters[i]);
          chatter.sockets.forEach((socket) => {
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

    socket.on("message", async (message) => {
      let sockets = [];

      // Se verifica si en el map de users, se encuentra el usuario que  va a mandar el mensaje
      if (users.has(message.fromUser.id)) {
        // Se añaden los sockets en los que esta conectado el usuario
        sockets = users.get(message.fromUser.id).sockets;
      }

      message.toUserId.forEach((id) => {
        if (users.has(id)) {
          // Se añaden los sockets de cada uno de los receptores del mensaje
          sockets = [...sockets, ...users.get(id).sockets];
        }
      });

      // se crea el objeto mensaje
      try {
        const msg = {
          type: message.type,
          fromUserId: message.fromUser.id,
          chatId: message.chatId,
          message: message.message,
        };

        // Se crea el mensaje con el modelo Messsage
        const savedMessage = await Message.create(msg);

        // Se añade información al objeto message que se recibe como parametro, para que de esta forma tenga la misma estructura de como lo obtenemos mediante el query y asi poder usarlo sin problemas en el front end con react
        message.User = message.fromUser;
        message.fromUserId = message.fromUser.id;
        message.id = savedMessage.id;
        // Se manda a llamar message.message para asi poder utilizar el getter que se desarrolló en el Modelo Message
        message.message = savedMessage.message;

        // se elimina el "atributo" fromUser ya que se añadió message.User y ya no es necesario
        delete message.fromUser;

        // Se envia un mensaje de recibido por cada socket
        sockets.forEach((socket) => {
          io.to(socket).emit("received", message);
        });
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("disconnect", async () => {
      if (userSockets.has(socket.id)) {
        const user = users.get(userSockets.get(socket.id));
        // Si el usuario tiene multimple sesiones activas, se elimina solo en esta en especifico
        if (user.sockets.length > 1) {
          user.sockets = user.sockets.filter((sock) => {
            if (sock !== socket.id) return true;

            userSockets.delete(sock);
            return false;
          });
        } else {
          const chatters = await getChatters(user.id);

          // Se "notifica" a los amigos de este usuario ya no esta conectado
          for (let i = 0; i < chatters.length; i++) {
            if (users.has(chatters[i])) {
              users.get(chatters[i]).sockets.forEach((socket) => {
                try {
                  io.to(socket).emit("offline", user);
                } catch (e) {}
              });
            }
          }
          userSockets.delete(socket.id);
          users.delete(user.id);
        }
      }
    });

    socket.on("typing", (message) => {
      message.toUserId.forEach((id) => {
        if (users.has(id)) {
          users.get(id).sockets.forEach((socket) => {
            io.to(socket).emit("typing", message);
          });
        }
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

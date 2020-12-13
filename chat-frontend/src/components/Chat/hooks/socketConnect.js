import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import {
  fetchChats,
  onlineFriends,
  onlineFriend,
  offlineFriend,
  setSocket,
  receivedMessage,
  senderTyping,
  createChat,
} from "../../../store/actions/chat";

function useSocket(user, dispatch) {
  useEffect(() => {
    dispatch(fetchChats())
      .then((res) => {
        console.log(res);
        // Se conecta al servidor para poder usar socket
        const socket = socketIOClient.connect("http://127.0.0.1:3000");

        dispatch(setSocket(socket));

        // Aqui se envía una "alerta" join y se manda el usuario
        socket.emit("join", user);

        // Aqui se recibe una alerta de nombre "typing" desde el servidor y es la que les indica a los demas participantes del chat, que alguien esta escribiendo en el chat
        socket.on("typing", (sender) => {
          dispatch(senderTyping(sender));
        });

        socket.on("friends", (friends) => {
          console.log("Friends", friends);
          dispatch(onlineFriends(friends));
        });

        socket.on("online", (user) => {
          console.log("Online", user);
          dispatch(onlineFriend(user));
        });

        socket.on("offline", (user) => {
          console.log("Offline", user);
          dispatch(offlineFriend(user));
        });

        socket.on("received", (message) => {
          dispatch(receivedMessage(message, user.id));
        });

        socket.on("new-chat", (chat) => {
          dispatch(createChat(chat));
        });
      })
      .catch((err) => console.log(err));
  }, [dispatch]);
}

export default useSocket;

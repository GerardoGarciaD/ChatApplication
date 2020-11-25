import { useEffect } from "react";
import socketIOClient from "socket.io-client";

function useSocket(user, dispatch) {
  useEffect(() => {
    // Se conecta al servidor para poder usar socket
    const socket = socketIOClient.connect("http://127.0.0.1:3000");

    // Aqui se envía una "alerta" join y se manda el usuario
    socket.emit("join", user);

    // Aqui se recibe una alerte de nombre "typing" desde el servidor y esta se imprime en el navegador
    socket.on("typing", (user) => {
      console.log("Event", user);
    });
  }, [dispatch]);
}

export default useSocket;

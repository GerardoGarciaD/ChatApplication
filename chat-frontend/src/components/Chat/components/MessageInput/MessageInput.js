import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MessageInput.scss";

const MessageInput = ({ chat }) => {
  const user = useSelector((state) => state.authReducer.user);

  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

  const handleMessage = (e) => {
    const value = e.target.value;
    setMessage(value);

    // TO DO Notfy other users that this user is typing something
  };

  const handleKeyDown = (e, imageUpload) => {
    if (e.key === "Enter") sendMessage(imageUpload);
  };

  const sendMessage = (imageUpload) => {
    // If para verificar si es que el mensaje no tiene contenido ni imagen, entonces no se hace ninguna accion
    if (message.length < 1 && !imageUpload) return;

    // Se crea el objeto msg que es el que se va a enviar al servidor para asi poder crear un nuevo mensaje
    const msg = {
      // Se verifica si es que el valor de imageUpload es true, entonces se cambia el tipo de mensaje a image, si no, es texto plano
      type: imageUpload ? "image" : "text",
      fromUserId: user.id,
      // Aqui es donde se indica a que usuarios se les va a enviar este mensaje
      toUserId: chat.Users.map((user) => user.id),
      chatId: chat.id,
      // Aqui, de igual forma se verifica si el valor de imageUpload es true, para así enviar la image, si no, enviar el texto plano del mensaje
      message: imageUpload ? image : message,
    };

    setMessage("");
    setImage("");

    // TODO: Send message with socket
  };
  return (
    <div id="input-container">
      <div id="message-input">
        <input
          type="text"
          placeholder="Message..."
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />

        <FontAwesomeIcon
          icon={["far", "smile"]}
          className="fa-icon"
        ></FontAwesomeIcon>
      </div>
    </div>
  );
};

export default MessageInput;

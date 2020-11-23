import React from "react";
import "./Message.scss";

const Message = ({ user, chat, index, message }) => {
  // Funcion que se encarga de añadir un margin mayor si es que los mensajes vienen de usuarios diferentes
  const determineMargin = () => {
    if (index + 1 === chat.Messages.length) return;

    return message.fromUserId === chat.Messages[index + 1].fromUserId
      ? "mb-5"
      : "mb-10";
  };
  return (
    // La clase "creator"  es para alinear los elementos (mensajes) a la derecha
    <div
      className={`message ${determineMargin()} ${
        message.fromUserId === user.id ? "creator" : ""
      }`}
    >
      {/* This class is to change the color of the message  */}
      <div
        className={`${
          message.fromUserId === user.id ? "owner" : "other-person"
        }`}
      >
        {/* Aqui se verifica si el mensaje es de otro usuario, para poder añadir el nombre del usuario que lo envió arriba del mensaje  */}
        {message.fromUserId !== user.id ? (
          <h6 className="m-0">
            {message.User.firstName} {message.User.lastName}{" "}
          </h6>
        ) : null}

        {message.type === "text" ? (
          <p className="m-0">{message.message}</p>
        ) : (
          <img src={message.message} alt="User upload" />
        )}
      </div>
    </div>
  );
};

export default Message;

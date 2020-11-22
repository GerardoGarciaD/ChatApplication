import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { userStatus } from "../../../../utils/helpers";
import "./Friend.scss";

const Friend = ({ chat, click }) => {
  // Aqui se obtiene el chat activo desde esl state
  const currentChat = useSelector((state) => state.chatReducer.currentChat);

  // Funcion para añadir estilos condicionales, dependiendo de en cual chat se este activo
  const isChatOpened = () => {
    return currentChat.id === chat.id ? "opened" : "";
  };

  // Funcion que se encarga de obtener el ultiimo mensaje de ese chat o si no hay mensaje devuelve un string vacio
  const lastMessage = () => {
    if (chat.Messages.length === 0) return "";
    const message = chat.Messages[chat.Messages.length - 1];
    return message.type === "image" ? "image uploaded" : message.message;
  };
  return (
    // La función click se obtiene desde las props y es para mostrar la información del chat
    <div onClick={click} className={`friend-list ${isChatOpened()}`}>
      <div>
        <img
          width="40"
          height="40"
          src={chat.Users[0].avatar}
          alt="User avatar"
        />
        <div className="friend-info">
          <h4 className="m-0">
            {chat.Users[0].firstName} {chat.Users[0].lastName}
          </h4>
          <h5 className="m-0">{lastMessage()}</h5>
        </div>
      </div>
      <div className="friend-status">
        {/* User status, regresa el status del usuario  */}
        <span className={`online-status ${userStatus(chat.Users[0])}`}></span>
      </div>
    </div>
  );
};

export default Friend;

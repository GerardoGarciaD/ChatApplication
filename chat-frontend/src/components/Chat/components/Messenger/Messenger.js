import React from "react";
import { useSelector } from "react-redux";
import ChatHeader from "../ChatHeader/ChatHeader";
import MessageBox from "../MessageBox/MessageBox";
import MessageInput from "../MessageInput/MessageInput";
import "./Messenger.scss";

const Messenger = () => {
  const chat = useSelector((state) => state.chatReducer.currentChat);

  // Funcion que verifica si hay un chat activo, regresa un boolean
  const activeChat = () => {
    return Object.keys(chat).length > 0;
  };
  return (
    <div id="messenger" className="shadow-ligth">
      {activeChat() ? (
        <div id="messenger-wrap">
          <ChatHeader chat={chat}></ChatHeader>
          <hr />
          <MessageBox chat={chat}></MessageBox>
          <MessageInput chat={chat}></MessageInput>
        </div>
      ) : (
        <p>No active chat</p>
      )}
    </div>
  );
};

export default Messenger;

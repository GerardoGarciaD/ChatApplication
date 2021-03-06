import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatService from "../../../../services/chatService";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import "./MessageInput.scss";
import { incrementScroll } from "../../../../store/actions/chat";

const MessageInput = ({ chat }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const socket = useSelector((state) => state.chatReducer.socket);
  const newMessage = useSelector((state) => state.chatReducer.newMessage);

  const fileUpload = useRef();
  const msgInput = useRef();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewMessageNotification, setShowNewMessageNotification] = useState(
    false
  );

  const handleMessage = (e) => {
    const value = e.target.value;
    setMessage(value);

    // se crea objeto receiver que contiene información sobre que chat, usuario y hacia que usuarios se envia el mensaje
    const receiver = {
      chatId: chat.id,
      fromUser: user,
      toUserId: chat.Users.map((user) => user.id),
    };

    if (value.length === 1) {
      receiver.typing = true;
      socket.emit("typing", receiver);
    }

    if (value.length === 0) {
      receiver.typing = false;
      socket.emit("typing", receiver);
    }

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
      fromUser: user,
      // Aqui es donde se indica a que usuarios se les va a enviar este mensaje
      toUserId: chat.Users.map((user) => user.id),
      chatId: chat.id,
      // Aqui, de igual forma se verifica si el valor de imageUpload es true, para así enviar la image, si no, enviar el texto plano del mensaje
      message: imageUpload ? imageUpload : message,
    };

    setMessage("");
    setImage("");
    setShowEmojiPicker(false);

    // TODO: Send message with socket
    socket.emit("message", msg);
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append("id", chat.id);
    formData.append("image", image);

    // Chat service
    ChatService.uploadImage(formData)
      .then((image) => {
        sendMessage(image);
      })
      .catch((err) => console.log(err));
  };

  const selectEmoji = (emoji) => {
    const startPosition = msgInput.current.selectionStart;
    const endPosition = msgInput.current.selectionEnd;
    const emojiLength = emoji.native.length;
    const value = msgInput.current.value;
    setMessage(
      value.substring(0, startPosition) +
        emoji.native +
        value.substring(endPosition, value.length)
    );
    msgInput.current.focus();
    msgInput.current.selectionEnd = endPosition + emojiLength;
  };

  useEffect(() => {
    const msgBox = document.getElementById("msg-box");
    if (
      !newMessage.seen &&
      newMessage.chatId === chat.id &&
      msgBox.scrollHeight !== msgBox.clientHeight
    ) {
      if (msgBox.scrollTop > msgBox.scrollHeight * 0.3) {
        dispatch(incrementScroll());
      } else {
        setShowNewMessageNotification(true);
      }
    } else {
      setShowNewMessageNotification(false);
    }
  }, [newMessage, dispatch]);

  const showNewMessage = () => {
    dispatch(incrementScroll());
    setShowNewMessageNotification(false);
  };

  return (
    <div id="input-container">
      <div id="image-upload-container">
        <div>
          {showNewMessageNotification ? (
            <div id="message-notification" onClick={showNewMessage}>
              <FontAwesomeIcon
                icon="bell"
                className="fa-icon"
              ></FontAwesomeIcon>
              <p className="m-0">New Message</p>
            </div>
          ) : null}
        </div>

        <div id="image-upload">
          {image.name ? (
            <div id="image-details">
              <p className="m-0">{image.name}</p>
              <FontAwesomeIcon
                onClick={handleImageUpload}
                icon="upload"
                className="fa-icon"
              ></FontAwesomeIcon>

              <FontAwesomeIcon
                onClick={() => setImage("")}
                icon="times"
                className="fa-icon"
              ></FontAwesomeIcon>
            </div>
          ) : null}

          <FontAwesomeIcon
            onClick={() => fileUpload.current.click()}
            icon={["far", "image"]}
            className="fa-icon"
          ></FontAwesomeIcon>
        </div>
      </div>

      <div id="message-input">
        <input
          ref={msgInput}
          value={message}
          type="text"
          placeholder="Message..."
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />

        <FontAwesomeIcon
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          icon={["far", "smile"]}
          className="fa-icon"
        ></FontAwesomeIcon>
      </div>

      <input
        id="chat-image"
        ref={fileUpload}
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      ></input>

      {showEmojiPicker ? (
        <Picker
          title="Pick your emoji"
          emoji="point_up"
          style={{ position: "absolute", bottom: "20px", right: "20px" }}
          onSelect={selectEmoji}
        ></Picker>
      ) : null}
    </div>
  );
};

export default MessageInput;

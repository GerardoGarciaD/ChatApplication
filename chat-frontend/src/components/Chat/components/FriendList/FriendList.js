import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat } from "../../../../store/actions/chat";
import Friend from "../Friend/Friend";
import Modal from "../../../Modal/Modal";

import "./FriendList.scss";
import ChatService from "../../../../services/chatService";

const FriendList = () => {
  const dispatch = useDispatch();
  // Se obtienen los chats del state
  const chats = useSelector((state) => state.chatReducer.chats);

  const [showFriendModal, setShowFriendModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Funcion para seleccionar este chat como el actual y mostrar su informacion
  const openChat = (chat) => {
    dispatch(setCurrentChat(chat));
  };

  const searchFriends = (e) => {
    ChatService.searchUsers(e.target.value).then((res) => setSuggestions(res));
  };

  const addFriend = (id) => {};

  return (
    <div id="friends" className="shadow-ligth">
      <div id="title">
        <h3 className="m-0">Friends</h3>
        <button onClick={() => setShowFriendModal(true)}>ADD</button>
      </div>
      <hr />

      <div id="friends-box">
        {chats.length > 0 ? (
          chats.map((chat) => {
            return (
              <Friend
                click={() => openChat(chat)}
                chat={chat}
                key={chat.id}
              ></Friend>
            );
          })
        ) : (
          <p id="no-chat">No friends added</p>
        )}
      </div>

      {showFriendModal && (
        <Modal click={() => setShowFriendModal(false)}>
          <Fragment key="header">
            <h3 className="m-0">Create new chat</h3>
          </Fragment>
          <Fragment key="body">
            <p>Find frineds by typing their name bellow</p>

            <input
              type="text"
              onInput={(e) => searchFriends(e)}
              placeholder="Search..."
            />

            <div id="suggestions">
              {suggestions.map((user) => {
                return (
                  <div key="user.id" className="suggestion">
                    <p className="m-0">
                      {user.firstName} {user.lastName}
                    </p>
                    <button onClick={() => addFriend(user.id)}>ADD</button>
                  </div>
                );
              })}
            </div>
          </Fragment>
        </Modal>
      )}
    </div>
  );
};

export default FriendList;

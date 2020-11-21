import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./components/Navbar/Navbar";
import "./Chat.scss";
import { fetchChats } from "../../store/actions/chat";
import FriendList from "./components/FriendList/FriendList";
import Messenger from "./components/Messenger/Messenger";

const Chat = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);

  useEffect(() => {
    dispatch(fetchChats())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, [dispatch]);

  // const chats = useSelector((state) => state.chatReducer.chats);
  return (
    <div id="chat-container">
      <Navbar></Navbar>
      <div id="chat-wrap">
        <FriendList></FriendList>
        <Messenger></Messenger>
      </div>
    </div>
  );
};

export default Chat;

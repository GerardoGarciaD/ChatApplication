import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChats } from "../../store/actions/chat";
import Navbar from "./components/Navbar/Navbar";
import FriendList from "./components/FriendList/FriendList";
import Messenger from "./components/Messenger/Messenger";
import useSocket from "./hooks/socketConnect";
import "./Chat.scss";

const Chat = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  useSocket(user, dispatch);

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

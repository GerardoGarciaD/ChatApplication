const { FETCH_CHATS, SET_CURRENT_CHAT } = require("../actions/chat");

const initalState = {
  chats: [],
  currentChat: {},
};

const chatReducer = (state = initalState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_CHATS:
      return {
        ...state,
        chats: payload,
      };

    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: payload,
      };

    default:
      return state;
  }
};

export default chatReducer;

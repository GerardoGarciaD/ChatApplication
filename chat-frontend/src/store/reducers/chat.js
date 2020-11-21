const { FETCH_CHATS } = require("../actions/chat");

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

    default:
      return {
        state,
      };
  }
};

export default chatReducer;

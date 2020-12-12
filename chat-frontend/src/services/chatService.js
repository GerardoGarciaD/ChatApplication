import API from "./api";

const ChatService = {
  fetchChats: () => {
    return API.get("/chats")
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },

  uploadImage: (data) => {
    // Se añaden los headers que se deben añadir para poder realizar el request com archivos media

    const headers = {
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    };
    return API.post("/chats/upload-image", data, headers)
      .then(({ data }) => {
        return data.url;
      })
      .catch((err) => {
        throw err;
      });
  },

  paginateMessages: (id, page) => {
    return API.get("/chats/messages", {
      params: {
        id,
        page,
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },
};

export default ChatService;

const models = require("../models");
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;
const { Op } = require("sequelize");

exports.index = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
    // Aqui es donde se hace la relación al modelo de Chat para obtener todos los que ha tenido este usuario
    include: [
      {
        model: Chat,
        // Aqui es donde se hace la relación al modelo de User para obtener todos los usuarios que participan en un chat
        include: [
          {
            model: User,
            where: {
              [Op.not]: {
                id: req.user.id,
              },
            },
          },
          {
            //   Aqui se obtienen los ultimos 20 mensajes
            model: Message,
            limit: 20,
            order: [["id", "DESC"]],
          },
        ],
      },
    ],
  });

  return res.send(user.Chats);
};

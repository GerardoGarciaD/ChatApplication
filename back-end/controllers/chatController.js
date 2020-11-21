const models = require("../models");
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;
const { Op } = require("sequelize");
const { sequelize } = require("../models");

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

exports.create = async (req, res) => {
  const { partnerId } = req.body;

  // Esta transaction se usa para poder revertir los cambios en paso de que algun error suceda
  const t = await sequelize.transaction();
  console.log(partnerId);

  try {
    // Este es un 'query' en donde se va a verificar si es que ya existe un usuario dual entre dos usuarios
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Chat,
          where: {
            type: "dual",
          },
          include: [
            {
              model: ChatUser,
              where: {
                userId: partnerId,
              },
            },
          ],
        },
      ],
    });

    // Se regresa un error si ya existe un chat dual con el usuario con el que se desea crear un nuevo chat dual
    if (user && user.Chats.length > 0)
      return res.status(403).json({
        status: "Error",
        message: "Chat with this user already exists!",
      });

    const chat = await Chat.create({ type: "dual" }, { transaction: t });

    // Se crean los registro con los id de los usuarios para el chat dual
    await ChatUser.bulkCreate(
      [
        {
          chatId: chat.id,
          userId: req.user.id,
        },
        {
          chatId: chat.id,
          userId: partnerId,
        },
      ],
      { transaction: t }
    );

    // Si no hubo ningun error con los queries, entonces se hace commit a la transaction para guardar la info en la BD
    await t.commit();

    const chatNew = await Chat.findOne({
      where: {
        id: chat.id,
      },
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
          model: Message,
        },
      ],
    });

    return res.send(chatNew);
  } catch (e) {
    await t.commit();
    return res.status(500).json({ status: "Error", message: e.message });
  }
};

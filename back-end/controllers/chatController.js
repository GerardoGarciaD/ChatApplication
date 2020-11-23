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
            // Se añade el modelo User para asi poder obtener la información del usuario que envió este mensaje y asi poder usarla en el front-end
            include: [
              {
                model: User,
              },
            ],
            limit: 20,
            order: [["id", "DESC"]],
          },
        ],
      },
    ],
  });

  return res.json(user.Chats);
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

    return res.json(chatNew);
  } catch (e) {
    await t.commit();
    return res.status(500).json({ status: "Error", message: e.message });
  }
};

exports.messages = async (req, res) => {
  // Este es el numero máximo de mensajes por paginna
  const limit = 10;
  // Aqui se indica que si existe un param query entonces se tome, la pagina por default va a ser 1
  const page = req.query.page || 1;
  // El offset va a ser el numero de mensajes que se van a saltar, si la pagina es mayor a 1, entonces se empezarian a mostrar los primeros 20 mensajes (EJEMPLO -> page=2* limiy= 10 -> 20)
  const offset = page > 1 ? page * limit : 0;

  // Este query nos permite utilizar los metodos count y rows
  const messages = await Message.findAndCountAll({
    where: {
      chatId: req.query.id,
    },
    // Se añade el modelo User para asi poder obtener la información del usuario que envió este mensaje y asi poder usarla en el front-end
    include: [
      {
        model: User,
      },
    ],
    limit,
    offset,
  });

  // Se obtiene la cantidad de paginas dependiendo de cuantos mensajes existan
  const totalPages = Math.ceil(messages.count / limit);

  // Se regresa un array vacio si la pagina mandanda en el param query es mayor al numero total de paginas
  if (page > totalPages) return res.json({ data: { messages: [] } });

  const result = {
    // Este metodo es el que se obtiene con findAndCountAll y básicamente son todos los mensajes
    messages: messages.rows,
    pagination: {
      page,
      totalPages,
    },
  };

  return res.json(result);
};

exports.deleteChat = async (req, res) => {
  try {
    await Chat.destroy({
      where: {
        // Aqui se obtiene el id pero del path del url
        id: req.params.id,
      },
    });

    return res.json({
      status: "Success",
      message: "Chat deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({ status: "Error", message: e.message });
  }
};

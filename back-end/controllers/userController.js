const User = require("../models").User;
const sequelize = require("sequelize");

exports.update = async (req, res) => {
  // Aqui se verifica si es que existe file en el request, que es generado desde fileUpload
  if (req.file) {
    //   si es asi, entonces al body del request se le pone el nombre generado en el archivo fileUpload
    req.body.avatar = req.file.filename;
  }

  //   Se verifica si el contenido de avatar del request esta undefined o vacio, esto es para no eliminar de la BD si no hay data en el request
  if (typeof req.body.avatar !== "undefined" && req.body.avatar.length === 0)
    delete req.body.avatar;

  try {
    //   Se manda a llamar el metodo que Update que se proporciona desde el modelo
    const [rows, result] = await User.update(req.body, {
      where: {
        //   req.user es el que se obtiene cuando pasa por el middleware de atuh
        id: req.user.id,
      },
      //   Esto es para que regrese la lista de los elementos que modificó
      returning: true,
      //   Y esto es para que se puedan ejecutar las funciones individuales de cada atributo del modelo User
      individualHooks: true,
    });

    // Se obtiene el primer resultado y se convierte en formato plano de texto
    const user = result[0].get({ raw: true });
    // Y por ultimo se manda a llamar la funcion avatar del modelo para poder obtener el avatar del usuario
    user.avatar = result[0].avatar;
    delete user.password;

    return res.send(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

exports.search = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        [sequelize.Op.or]: {
          namesConcated: sequelize.where(
            sequelize.fn(
              "concat",
              sequelize.col("firstName"),
              " ",
              sequelize.col("lastName")
            ),
            {
              [sequelize.Op.iLike]: `%${req.query.term}%`,
            }
          ),
          email: {
            [sequelize.Op.iLike]: `%${req.query.term}%`,
          },
        },
        [sequelize.Op.not]: {
          id: req.user.id,
        },
      },
      limit: 10,
    });

    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const User = require("../models").User;
const sequelize = require("sequelize");

exports.update = async (req, res) => {
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

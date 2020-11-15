// Se obtiene el modelo de usuario para hacer busqueda en la BD
const User = require("../models").User;
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Buscar el usuario
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // Verificar si existe el usuario
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verificar si el password es correcto}
    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: "Incorrect credentials" });

    return res.send(user);
  } catch (e) {
    console.log(e);
  }

  return res.send([email, password]);
};

exports.register = async (req, res) => {};

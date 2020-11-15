// Se obtiene el modelo de usuario para hacer busqueda en la BD
const User = require("../models").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    //   Generar auth token, se añade la opcion de user.get y raw, para mandar un formato simplificado de la respuesta que se obtiene con el modelo de sequelize que pueda leer
    const userWithToken = generateToken(user.get({ raw: true }));
    return res.send(userWithToken);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  return res.send([email, password]);
};

exports.register = async (req, res) => {};

const generateToken = (user) => {
  console.log(user);

  // se quita el campo password de la respuesta
  delete user.password;

  const token = jwt.sign(user, "secret", { expiresIn: 86400 });

  return { ...user, token };
};

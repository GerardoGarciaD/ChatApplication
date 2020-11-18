const { request } = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config/app");

exports.auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  //   el doble && se utiliza para indicar que,si existe authHeader entonces que se haga el split en donde se elimina la primer parte del token "Bearer (token)"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token!" });
  }

  //   Se verifica el token con el id guardado en env
  jwt.verify(token, config.appKey, (err, user) => {
    if (err) {
      return res.status(401).json({ err });
    }

    // Aqui es donde se añade la informacion obtenida del usuario al REQUEST, para que asi se pueda saber que usuario es el que esta haciendo la peticio
    req.user = user;
  });

  next();
};

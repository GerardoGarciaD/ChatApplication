const { body } = require("express-validator");

// Se utiliza la tecnica Immediately-Invoked Function en donde se ejecuta la funcion justo despues de haber sido declaradas
exports.rules = (() => {
  return [body("email").isEmail()];
})();

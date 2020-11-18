const { body } = require("express-validator");
// Se utiliza la tecnica Immediately-Invoked Function en donde se ejecuta la funcion justo despues de haber sido declaradas
exports.rules = (() => {
  return [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").optional().isLength({ min: 5 }),
    body("gender").notEmpty(),
  ];
})();

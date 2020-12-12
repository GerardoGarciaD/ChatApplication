const router = require("express").Router();
const { update, search } = require("../controllers/userController");
const { auth } = require("../middleware/auth");
const { rules: updateRules } = require("../validators/user/user");
const { validate } = require("../validators");
const { userFile } = require("../middleware/fileUpload");

// Primero se manda a llamar al middleware de userFile para poder manejar las imagenes de los avatar, despues auth para verificar el token, despues se añaden la reglas que se desean verificar y por ultimo se valida si es que existe algún error al momemento que se hicieron las validaciones
router.post("/update", [auth, userFile, updateRules, validate], update);
router.get("/search-users", [auth], search);

module.exports = router;

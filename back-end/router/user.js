const router = require("express").Router();
const { update } = require("../controllers/userController");
const { auth } = require("../middleware/auth");
const { rules: updateRules } = require("../validators/auth/register");
const { validate } = require("../validators");

// Primero se manda a llamar al middleware de auth para verificar el token, despues se añaden la reglas que se desean verificar y por ultimo se valida si es que existe algún error al momemento que se hicieron las validaciones
router.post("/update", [auth, updateRules, validate], update);

module.exports = router;

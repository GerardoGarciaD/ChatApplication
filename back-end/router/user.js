const router = require("express").Router();
const { update } = require("../controllers/userController");
const { auth } = require("../middleware/auth");
const { validate } = require("../validators");

router.post("/update", [auth], update);

module.exports = router;

const router = require("express").Router();

router.post("/login", (req, res) => {
  return res.send("Login Screen");
});

router.post("/register", (req, res) => {
  return res.send("Register Screen");
});
module.exports = router;

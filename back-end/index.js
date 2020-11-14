const express = require("express");

const config = require("./config/app");

const app = express();

app.get("/home", (req, res) => {
  return res.send("Home Screen sdfsdf");
});

port = config.appPort;

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});

console.log("Hello World");

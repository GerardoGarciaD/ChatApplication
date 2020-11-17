const express = require("express");

const config = require("./config/app");

const router = require("./router");

const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(router);

// Aqui se indica que imagenes son las que se van a utilizar, para que se puedan acceder a ellas
app.use(express.static(__dirname + "/public"));

port = config.appPort;

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});

console.log("Hello World");

const express = require("express");

const config = require("./config/app");

const router = require("./router");

const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();
// Este parser se utiliza para que el servidor pueda procesar imagenes al momento de hacer requests
app.use(bodyParser.urlencoded({ extended: true }));
// Este parser se utiliza para que el servidor pueda procesar Json al momento de hacer requests
app.use(bodyParser.json());
// Se añade la función para que se puedan realizar peticiones desde otros puertos, etc.
app.use(cors());
app.use(router);

// Aqui se indica que imagenes son las que se van a utilizar, para que se puedan acceder a ellas
app.use(express.static(__dirname + "/public"));

port = config.appPort;

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});

console.log("Hello World");

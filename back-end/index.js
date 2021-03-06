const express = require("express");
const config = require("./config/app");
const router = require("./router");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http");

// Este parser se utiliza para que el servidor pueda procesar imagenes al momento de hacer requests
app.use(bodyParser.urlencoded({ extended: true }));
// Este parser se utiliza para que el servidor pueda procesar Json al momento de hacer requests
app.use(bodyParser.json());
// Se añade la función para que se puedan realizar peticiones desde otros puertos, etc.
app.use(cors());
app.use(router);

// Aqui se indica que imagenes son las que se van a utilizar dentro del servidor , para que se puedan acceder a ellas
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));

port = config.appPort;

const server = http.createServer(app);
const SocketServer = require("./socket");

SocketServer(server);
server.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});

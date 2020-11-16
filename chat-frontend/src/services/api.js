import axios from "axios";

// Se crea una nueva instancia de axios para evitar escribir el baseURL en todos los llamados
export default axios.create({
  baseURL: "http://127.0.0.1:3000",
  headers: {
    Accept: "application/json",
  },
});

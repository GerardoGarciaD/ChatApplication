import axios from "axios";
import store from "../store";
import { logout } from "../store/actions/auth";

// Se crea una nueva instancia de axios para evitar escribir el baseURL en todos los llamados
const API = axios.create({
  baseURL: "http://127.0.0.1:3000",
  headers: {
    Accept: "application/json",
    // Se intentará buscar el token en local storage, si no hay nada simplemente se queda vacío
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

// Se utiliza este interceptor para verificar si el token aun es valido
API.interceptors.response.use(
  // Si no hay error, entonces se regresa la respuesta
  (res) => {
    return res;
  },

  (err) => {
    if (err.response.status !== 401) {
      throw err;
    }

    // err.name es el mensaje que ya esta definido por JWT para cuando el token esta expirado
    if (typeof err.response.data.err.name !== "undefined") {
      store.dispatch(logout());
      throw err;
    }
  }
);

export default API;

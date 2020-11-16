import API from "./api";

const AuthService = {
  login: (data) => {
    return (
      API.post("/login", data)
        // Se hace destructuring para obtener solo el objeto data de la respuesta al llamado
        .then(({ data }) => {
          //   Se añade el header de autorization al llamado
          API.defaults.headers["Authorization"] = `Bearer ${data.token}`;
          return data;
        })
        .catch((err) => {
          console.log("Auth service error", err);
          throw err;
        })
    );
  },
};

export default AuthService;

import AuthService from "../../services/authService";
export const LOGIN = "LOGIN";
export const REGISTER = "REGISTER";
export const LOGOUT = "LOGOUT";
export const UPDATEPROFILE = "UPDATEPROFILE";

export const login = (params, history) => (dispatch) => {
  return AuthService.login(params)
    .then((data) => {
      // console.log(data);
      dispatch({ type: LOGIN, payload: data });
      history.push("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const register = (params, history) => (dispatch) => {
  return AuthService.register(params)
    .then((data) => {
      // console.log(data);
      dispatch({ type: REGISTER, payload: data });
      history.push("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateProfile = (params) => (dispatch) => {
  return AuthService.updateProfile(params)
    .then((data) => {
      dispatch({ type: UPDATEPROFILE, payload: data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const logout = () => (dispatch) => {
  AuthService.logout();
  dispatch({ type: LOGOUT });
};

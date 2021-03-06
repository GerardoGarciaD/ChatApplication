import { LOGIN, LOGOUT, REGISTER, UPDATEPROFILE } from "../types";

const initialState = {
  /* user: JSON.parse(localStorage.getItem("user")) || {},
  token: localStorage.getItem("token") || "",
  // La doble exlamación (!!) se utiliza, ya que si en local storage no se encuentra el user, entonces va devolver false
  // isLoggedIn: localStorage.getItem("user") ? true: false
  isLoggedIn: !!localStorage.getItem("user"), */

  user: {},
  token: "",
  isLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true,
      };

    case LOGOUT:
      return {
        ...state,
        user: {},
        token: "",
        isLoggedIn: false,
      };

    case UPDATEPROFILE: {
      return {
        ...state,
        user: payload,
      };
    }
    default:
      return state;
  }
};

export default authReducer;

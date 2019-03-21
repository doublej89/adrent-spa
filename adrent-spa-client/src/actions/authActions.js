import axios from "axios";
import { AUTH_USER, AUTH_ERROR, CLEAR_ERROR, LOGOUT } from "./types";

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/signup", userData)
    .then(res => {
      dispatch({ type: AUTH_USER, payload: res.data });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("roomId", res.data.id);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("username", res.data.username);
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: AUTH_ERROR,
        payload: err.response.data.errorMessage
      });
    });
};

export const signinUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/signin", userData)
    .then(res => {
      dispatch({ type: AUTH_USER, payload: res.data });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("roomId", res.data.id);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("username", res.data.username);
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: AUTH_ERROR,
        payload: err.response.data.errorMessage
      });
    });
};

export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: ""
});

export const signout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("username");
  return {
    type: LOGOUT
  };
};

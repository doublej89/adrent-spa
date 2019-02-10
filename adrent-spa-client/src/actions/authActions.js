import axios from "axios";
import { AUTH_USER, AUTH_ERROR } from "./types";

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/signup", userData)
    .then(res => {
      dispatch({ type: AUTH_USER, payload: res.data });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("roomId", res.data.id);
      history.push("/");
    })
    .catch(err => {
      console.log(err.response.data);

      dispatch({
        type: AUTH_ERROR,
        payload: err.response.data
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
      history.push("/");
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: AUTH_ERROR,
        payload: err.response.data
      });
    });
};

export const signout = () => {
  localStorage.removeItem("token");

  return {
    type: AUTH_USER,
    payload: ""
  };
};

import { GET_ALL, GET_ALL_BY_CATEGORY, GET_PRODUCT } from "./types";
import isEmpty from "../utils/isEmpty";
import axios from "axios";

export const getAll = (...args) => dispatch => {
  let url = "/api/product";
  if (args[0] && args[1]) {
    url = `${url}?page=${args[0]}&search=${args[1]}`;
  } else if (args[0] && !args[1]) {
    url = `${url}?page=${args[0]}`;
  } else if (!args[0] && args[1]) {
    url = `${url}?search=${args[1]}`;
  }
  axios
    .get(url)
    .then(response =>
      dispatch({
        type: GET_ALL,
        payload: response.data
      })
    )
    .catch(err => console.log(err));
};

export const getProduct = id => dispatch => {
  axios
    .get(`/api/product/${id}`)
    .then(response => {
      console.log(response);

      dispatch({
        type: GET_PRODUCT,
        payload: response.data
      });
    })
    .then(err => console.log(err));
};

export const getProductByLocation = coords => dispatch => {
  axios
    .get(`/api/product/location/${coords}`)
    .then(response => {
      console.log(response);
      dispatch({
        type: GET_PRODUCT,
        payload: response.data
      });
    })
    .then(err => console.log(err));
};

export const getProductsByCat = categoryId => dispatch => {
  axios
    .get(`/api/category/${categoryId}`)
    .then(response =>
      dispatch({
        type: GET_ALL_BY_CATEGORY,
        payload: response.data
      })
    )
    .catch(err => console.log(err));
};

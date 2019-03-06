import { GET_ALL, GET_ALL_BY_CATEGORY, GET_PRODUCT } from "./types";
import isEmpty from "../utils/isEmpty";
import axios from "axios";

export const getAll = (page, search) => dispatch => {
  let url = "/api/product";
  if (page && search) {
    url = `/api/product?page=${page}&search=${search}`;
  } else if (page && !search) {
    url = `/api/product?page=${page}`;
  } else if (!page && search) {
    url = `/api/product?search=${search}`;
  }
  axios
    .get(url)
    .then(response => {
      console.log(response);
      console.log(dispatch);

      dispatch({
        type: GET_ALL,
        payload: response.data
      });
    })
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

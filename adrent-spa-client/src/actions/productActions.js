import {
  GET_ALL,
  GET_ALL_BY_CATEGORY,
  GET_PRODUCT,
  GET_PRODUCT_BY_LOCATION
} from "./types";
import axios from "axios";

export const getAll = (searchProduct, searchCategory) => dispatch => {
  let url = "/api/product";
  if (searchProduct && searchCategory && searchCategory !== "Select Media") {
    url = `/api/product?searchproduct=${searchProduct}&searchcategory=${searchCategory}`;
  } else if (
    searchProduct &&
    (!searchCategory || searchCategory === "Select Media")
  ) {
    url = `/api/product?searchproduct=${searchProduct}`;
  } else if (
    !searchProduct &&
    searchCategory &&
    searchCategory !== "Select Media"
  ) {
    url = `/api/product?searchcategory=${searchCategory}`;
  }
  console.log(`${searchProduct}, ${searchCategory}`);
  console.log(url);

  axios
    .get(url)
    .then(response => {
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
        type: GET_PRODUCT_BY_LOCATION,
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

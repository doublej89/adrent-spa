import { GET_ALL, GET_ALL_BY_CATEGORY, GET_PRODUCT } from "./types";
import isEmpty from "../utils/isEmpty";
import axios from "axios";

export const getAll = () => dispatch => {
  axios
    .get("/api/product")
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

export const getProductsByCat = categoryId => dispatch => {
  axios
    .get(`/api/category/${categoryId}`)
    .then(response =>
      dispatch({
        type: GET_ALL,
        payload: response.data.products
      })
    )
    .catch(err => console.log(err));
};

// export const getSearchedItems = searchData => {
//   const { category, productName } = searchData;
//   if (!isEmpty(category) && !isEmpty(productName)) {
//     let categoryId = media.indexOf(category);
//     return getAllByNameOrCategory(productName, categoryId);
//   } else if (!isEmpty(category)) {
//     let categoryId = media.indexOf(category);
//     return getProductsByCat(categoryId);
//   } else if (!isEmpty(productName)) {
//     return getAllByNameOrCategory(productName);
//   }
// };

// function getAllByNameOrCategory(name, ...args) {
//   let selectedProduct;
//   if (args.length > 0) {
//     selectedProduct = {
//       ...products.find(
//         prod => prod.name === name && prod.categories.includes(args[0])
//       )
//     };
//   } else {
//     selectedProduct = { ...products.find(prod => prod.name === name) };
//   }
//   selectedProduct.categories = [...selectedProduct.categories].map(id => ({
//     id: id,
//     name: media[id]
//   }));
//   return {
//     type: GET_ALL,
//     payload: [selectedProduct]
//   };
// }

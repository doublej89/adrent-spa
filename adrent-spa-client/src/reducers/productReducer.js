import {
  GET_ALL,
  GET_ALL_BY_CATEGORY,
  GET_PRODUCT,
  GET_PRODUCT_BY_LOCATION
} from "../actions/types";
const initialState = {
  products: [],
  product: {},
  loading: false,
  categoryName: "",
  noMatch: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        noMatch: action.payload.noMatch,
        search: action.payload.search
      };
    case GET_PRODUCT:
      return { ...state, loading: false, product: action.payload };
    case GET_ALL_BY_CATEGORY:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        categoryName: action.payload.name
      };
    case GET_PRODUCT_BY_LOCATION:
      return { ...state, products: [action.payload] };
    default:
      return state;
  }
}

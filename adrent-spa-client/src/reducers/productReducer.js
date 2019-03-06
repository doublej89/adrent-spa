import { GET_ALL, GET_ALL_BY_CATEGORY, GET_PRODUCT } from "../actions/types";
const initialState = {
  products: [],
  product: {},
  loading: false,
  categoryName: "",
  // current: null,
  // pages: null,
  noMatch: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        // current: action.payload.current,
        // pages: action.payload.pages,
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
    default:
      return state;
  }
}

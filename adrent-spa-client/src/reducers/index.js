import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import productReducer from "./productReducer";
import authReducer from "./authReducer";

export default combineReducers({
  productStore: productReducer,
  form: formReducer,
  auth: authReducer
});

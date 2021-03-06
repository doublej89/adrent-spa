import { AUTH_USER, AUTH_ERROR, CLEAR_ERROR, LOGOUT } from "../actions/types";

const INITIAL_STATE = {
  authenticated: "",
  errorMessage: null,
  isAdmin: false,
  id: "",
  username: ""
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload.token,
        isAdmin: action.payload.isAdmin,
        id: action.payload.id,
        username: action.payload.username
      };
    case AUTH_ERROR:
      return { ...state, errorMessage: action.payload };
    case CLEAR_ERROR:
      return { ...state, errorMessage: null };
    case LOGOUT:
      return {
        ...state,
        authenticated: "",
        isAdmin: false,
        id: "",
        username: ""
      };
    default:
      return state;
  }
}

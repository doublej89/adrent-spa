import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import rootReducer from "./reducers";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  { auth: { authenticated: localStorage.getItem("token") } },
  composeEnhancer(applyMiddleware(reduxThunk))
);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#e1422c"
    }
  },
  typography: {
    useNextVariants: true
  }
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);

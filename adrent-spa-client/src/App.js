import React, { Component } from "react";
import Header from "./components/Header";
import Search from "./components/search/Search";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/ProductDetails";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Switch>
            <Route path="/" exact component={Search} />
            <Route path="/search/:catagoryId" exact component={Search} />
            <Route path="/search/origin/:coords" exact component={Search} />
            <Route path="/product/:id" exact component={ProductDetails} />
            <Route path="/signin" exact component={Signin} />
            <Route path="/signup" exact component={Signup} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

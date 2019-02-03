import React, { Component } from "react";
import Header from "./components/Header";
import Search from "./components/search/Search";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/ProductDetails";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Chat from "./components/Chat";
import { connect } from "react-redux";
import io from "socket.io-client";
const socketUrl = "http://localhost:5000";
const socket = io(socketUrl);

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { authenticated, id } = this.props;
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
          {authenticated && id ? (
            <Chat roomId={id} authenticated={authenticated} socket={socket} />
          ) : null}
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  isAdmin: state.auth.isAdmin,
  id: state.auth.id
});

export default connect(mapStateToProps)(App);

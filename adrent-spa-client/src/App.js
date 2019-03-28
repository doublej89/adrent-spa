import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/ProductDetails";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Chat from "./components/chat/Chat";
import AdminChat from "./components/chat/AdminChat";
import Category from "./components/Category";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { connect } from "react-redux";
import io from "socket.io-client";

const socketUrl = "http://localhost:5000";
const socket = io(socketUrl);

function App(props) {
  const { authenticated, id, isAdmin } = props;

  return (
    <BrowserRouter>
      <div className="App">
        <Header socket={socket} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/search/:catagoryId" exact component={Home} />
          <Route path="/search/origin/:coords" exact component={Home} />
          <Route path="/product/:id" exact component={ProductDetails} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
          <Route
            path="/adminchat"
            exact
            render={props => <AdminChat {...props} socket={socket} />}
          />
          <Route path="/category/:id" exact component={Category} />
        </Switch>
        <Footer />
        {authenticated && id && !isAdmin ? (
          <Chat roomId={id} authenticated={authenticated} socket={socket} />
        ) : null}
      </div>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  isAdmin: state.auth.isAdmin,
  id: state.auth.id,
  username: state.auth.username
});

export default connect(mapStateToProps)(App);

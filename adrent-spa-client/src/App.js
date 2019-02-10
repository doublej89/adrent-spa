import React, { Component } from "react";
import Header from "./components/Header";
import Search from "./components/search/Search";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/ProductDetails";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Chat from "./components/Chat";
import AdminChat from "./components/AdminChat";
import { connect } from "react-redux";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { authenticated, id, isAdmin } = this.props;
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
            <Route path="/adminchat" exact component={AdminChat} />
          </Switch>
          {authenticated && id && !isAdmin ? (
            <Chat roomId={id} authenticated={authenticated} />
          ) : null}
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  isAdmin: state.auth.isAdmin,
  id: state.auth.id,
  username: state.auth.username
});

export default connect(mapStateToProps)(App);

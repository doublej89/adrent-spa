import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signout } from "../actions/authActions";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  loginButton: {
    marginRight: 30
  }
};

class Header extends Component {
  render() {
    const { classes, auth, signout, isAdmin, username } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              align="left"
              variant="h6"
              color="inherit"
              className={classes.grow}
            >
              <Link style={{ color: "inherit", textDecoration: "none" }} to="/">
                Adrent
              </Link>
            </Typography>
            {auth && isAdmin && username ? (
              <Button
                component={Link}
                to="/adminchat"
                color="inherit"
                className={classes.loginButton}
              >
                Messages
              </Button>
            ) : null}
            {auth ? (
              <Button
                onClick={() => signout()}
                color="inherit"
                className={classes.loginButton}
              >
                Logout
              </Button>
            ) : (
              <div>
                <Button
                  component={Link}
                  to="/signin"
                  color="inherit"
                  className={classes.loginButton}
                >
                  Login
                </Button>
                <Button component={Link} to="/signup" color="inherit">
                  Signup
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth.authenticated,
    isAdmin: state.auth.isAdmin,
    username: state.auth.username
  };
};

export default connect(
  mapStateToProps,
  { signout }
)(withStyles(styles)(Header));

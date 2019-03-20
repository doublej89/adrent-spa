import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { compose } from "redux";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { registerUser, clearError } from "../../actions/authActions";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  alertDanger: {
    color: "#721c24",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    position: "relative",
    padding: ".75rem 1.25rem",
    marginBottom: "1rem",
    marginTop: "2rem",
    border: "1px solid transparent",
    borderRadius: ".25rem"
  }
});

class Signup extends Component {
  constructor(props) {
    super(props);
    this.renderError = this.renderError.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  componentDidMount() {
    if (this.props.authenticated) {
      this.props.history.push("/");
    }
  }

  onSubmit = formProps => {
    console.log(formProps);
    this.props.registerUser(formProps, this.props.history);
  };

  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <Typography style={{ color: "red" }} variant="body2" gutterBottom>
          {error}
        </Typography>
      );
    }
  }

  renderInput = ({ input, label, meta, type }) => {
    return (
      <div style={{ marginTop: 16 }}>
        <Input {...input} type={type} style={{ width: "100%" }} />
        {this.renderError(meta)}
      </div>
    );
  };

  render() {
    const { handleSubmit, classes, errorMessage } = this.props;

    let errorAlert;

    if (errorMessage && typeof errorMessage === "string") {
      errorAlert = <div className={classes.alertDanger}>{errorMessage}</div>;
    } else if (errorMessage && typeof errorMessage === "object") {
      errorAlert = (
        <ul className={classes.alertDanger}>
          The following errors occured:
          {errorMessage.map(msg => (
            <li>{msg}</li>
          ))}
        </ul>
      );
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        {errorAlert}
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Username</InputLabel>
              <Field
                name="username"
                type="text"
                id="username"
                autoComplete="none"
                component={this.renderInput}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Field
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                component={this.renderInput}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Field
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                component={this.renderInput}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Confirm Password</InputLabel>
              <Field
                name="password2"
                type="password"
                id="password2"
                autoComplete="current-password"
                component={this.renderInput}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign up
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length > 15) {
    errors.username = "Must be 15 characters or less";
  }
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (Number(values.password) < 6) {
    errors.password = "Password must be atleast 6 characters long";
  }
  if (!values.password2) {
    errors.password2 = "Please re-enter your password";
  } else if (values.password2 && values.password2 !== values.password) {
    errors.password2 = "Your passwords don't match!";
  }
  return errors;
};

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    authenticated: state.auth.authenticated
  };
}

export default compose(
  connect(
    mapStateToProps,
    { registerUser, clearError }
  ),
  reduxForm({ form: "signup", validate }),
  withStyles(styles)
)(Signup);

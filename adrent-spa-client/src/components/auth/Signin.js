import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { compose } from "redux";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { signinUser } from "../../actions/authActions";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block",
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

  componentDidUpdate() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      console.log(errorMessage);
    }
  }

  onSubmit = formProps => {
    console.log(formProps);
    this.props.signinUser(formProps, this.props.history);
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
    //const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div style={{ marginTop: 16 }}>
        <Input {...input} type={type} />
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
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(this.onSubmit)}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
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
    { signinUser }
  ),
  reduxForm({ form: "signin", validate }),
  withStyles(styles)
)(Signup);

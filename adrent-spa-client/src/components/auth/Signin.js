import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { compose } from "redux";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { registerUser } from "../../actions/authActions";
import Validator from "validator";

class Signin extends Component {
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
    //const className = `field ${meta.error && meta.touched ? "error" : ""}`;

    return (
      <div>
        <TextField label={label} type={type} {...input} variant="outlined" />
        {/* {this.renderError(meta)} */}
      </div>
    );
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          name="email"
          component={this.renderInput}
          autoComplete="none"
          label="Email"
        />
        <Field
          name="password"
          type="password"
          component={this.renderInput}
          autoComplete="none"
        />
        {/* <div>{this.props.errorMessage}</div> */}
        <button type="submit">Signin</button>
      </form>
    );
  }
}

const validate = formValues => {
  let errors = {};

  if (!Validator.isEmail(formValues.email)) {
    errors.email = "Email is invalid!";
  }
  if (Validator.isEmpty(formValues.email)) {
    errors.email = "Email field must not be empty";
  }
  if (!Validator.isLength(formValues.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (Validator.isEmpty(formValues.password)) {
    errors.password = "Password field must not be empty";
  }
  if (Validator.isEmpty(formValues.password2)) {
    errors.password2 = "Confirm password field must not be empty";
  }
  if (!Validator.equals(formValues.password, formValues.password2)) {
    errors.password2 = "Confirm password did not match password";
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
    { registerUser }
  ),
  reduxForm({ form: "signin", validate: validate })
)(Signin);

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = [];
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.push("Name must be between 2 to 30 characters long");
  }
  if (Validator.isEmpty(data.username)) {
    errors.push("Name field must not be empty");
  }
  if (!Validator.isEmail(data.email)) {
    errors.push("Email is invalid!");
  }
  if (Validator.isEmpty(data.email)) {
    errors.push("Email field must not be empty");
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.push("Password must be at least 6 characters long");
  }
  if (Validator.isEmpty(data.password)) {
    errors.push("Password field must not be empty");
  }
  if (Validator.isEmpty(data.password2)) {
    errors.push("Confirm password field must not be empty");
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.push("Confirm password did not match password");
  }
  return { errors, isValid: isEmpty(errors) };
};

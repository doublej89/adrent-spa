const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const validateRegisterInput = require("../validation/signup");
const validateLoginInput = require("../validation/signin");

exports.signup = function(req, res, next) {
  let isAdmin = false;
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errorMessage: errors });
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const emailDomain = req.body.email.split("@")[1].split(".")[0];
  if (emailDomain === "admin") {
    isAdmin = true;
  }

  User.findOne({ username: username })
    .then(foundUser => {
      if (foundUser) {
        return res
          .status(422)
          .send({ errorMessage: "The username is already taken!" });
      }
      User.findOne({ email: email }).then(existingUser => {
        if (existingUser) {
          return res
            .status(422)
            .send({ errorMessage: "This email address is already in use!" });
        }
        const user = new User({
          username: username,
          email: email,
          password: password
        });
        user
          .save()
          .then(newUser => {
            const payload = { sub: newUser.id, iat: new Date().getTime() };
            jwt.sign(
              payload,
              config.secret,
              { expiresIn: 7200 },
              (err, token) => {
                if (err)
                  return res.status(422).send({
                    errorMessage: "Something went wrong while creating token!"
                  });
                res.json({
                  success: true,
                  token: token,
                  isAdmin: isAdmin,
                  id: newUser.id,
                  username: isAdmin ? newUser.username : null
                });
              }
            );
          })
          .catch(err => next(err));
      });
    })
    .catch(err => next(err));
};

exports.signin = function(req, res, next) {
  let isAdmin = false;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errorMessage: errors });
  }
  const emailDomain = req.body.email.split("@")[1].split(".")[0];
  if (emailDomain === "admin") {
    isAdmin = true;
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ errorMessage: "Email address not recognized!" });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          console.log(err);
          return res.status(404).json(err);
        }
        if (!isMatch) {
          return res.status(404).json({ errorMessage: "Incorrect password." });
        }
        const payload = { sub: user._id, iat: new Date().getTime() };
        jwt.sign(payload, config.secret, { expiresIn: 7200 }, (err, token) => {
          if (err) {
            return res.status(422).send({
              errorMessage: "Something went wrong while creating token!"
            });
          }
          res.json({
            success: "successfully signed in",
            token: token,
            id: user._id,
            isAdmin: isAdmin,
            username: isAdmin ? user.username : null
          });
        });
      });
    })
    .catch(err => res.status(400).json(err));
};

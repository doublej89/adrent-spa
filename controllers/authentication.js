const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.signup = function(req, res, next) {
  console.log(req.body);
  let isAdmin = false;
  const email = req.body.email;
  const password = req.body.password;
  const emailDomain = req.body.email.split("@")[1].split(".")[0];
  if (emailDomain === "admin") {
    isAdmin = true;
  }

  console.log(`email: ${email}, password: ${password}`);

  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(422).send({ error: "Email is in use!" });
      }
      const user = new User({
        username: req.body.username,
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
                  error: "Something went wrong while creating token!"
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
    })
    .catch(err => next(err));
};

exports.signin = function(req, res, next) {
  let isAdmin = false;
  const emailDomain = req.body.email.split("@")[1].split(".")[0];
  if (emailDomain === "admin") {
    isAdmin = true;
  }
  const payload = { sub: req.user.id, iat: new Date().getTime() };
  jwt.sign(payload, config.secret, { expiresIn: 7200 }, (err, token) => {
    if (err)
      return res
        .status(422)
        .send({ error: "Something went wrong while creating token!" });
    res.json({
      success: "successfully signed in",
      token: token,
      id: req.user.id,
      isAdmin: isAdmin,
      username: isAdmin ? req.user.username : null
    });
  });
};

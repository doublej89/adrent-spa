const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.signup = function(req, res, next) {
  console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;

  console.log(`email: ${email}, password: ${password}`);

  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(422).send({ error: "Email is in use!" });
      }
      const user = new User({
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
              res.json({ success: true, token: token });
            }
          );
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

exports.signin = function(req, res, next) {
  const payload = { sub: req.user.id, iat: new Date().getTime() };
  jwt.sign(payload, config.secret, { expiresIn: 7200 }, (err, token) => {
    if (err)
      return res
        .status(422)
        .send({ error: "Something went wrong while creating token!" });
    res.json({ success: "successfully signed in", token: token });
  });
};

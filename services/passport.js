const User = require("../models/User");
const config = require("../config");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// const localLogin = new LocalStrategy({ usernameField: "email" }, function(
//   email,
//   password,
//   done
// ) {
//   User.findOne({ email: email })
//     .then(user => {
//       if (!user) {
//         return done(null, false, { message: "Incorrect username." });
//       }
//       user.comparePassword(password, function(err, isMatch) {
//         if (err) {
//           console.log(err);
//           return done(err);
//         }
//         if (!isMatch) {
//           return done(null, false, { message: "Incorrect password." });
//         }
//         return done(null, user);
//       });
//     })
//     .catch(err => done(err));
// });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub)
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(err => done(err, false));
});

passport.use(jwtLogin);
//passport.use(localLogin);

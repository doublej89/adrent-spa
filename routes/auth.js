const Authentication = require("../controllers/authentication");
const passportServices = require("../services/passport");
const passport = require("passport");
//const requireAuth = passport.authenticate("jwt", { session: false });
//const requireSignin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  app.post("/api/users/signup", Authentication.signup);
  app.post("/api/users/signin", Authentication.signin);
};

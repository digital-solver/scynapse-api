// IMPORTS
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const Models = require('./models');

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// PASSPORT STRATEGIES

/**
 * A local passport strategy for authenticating users.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @param {function} callback - The callback function to be called upon completion of the strategy.
 */
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password',
}, (username, password, callback) => {
  console.log(`${username} ${password}`);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }
    if (!user) {
      console.group('incorrect username');
      return callback(null, false, { message: 'Incorrect username or password' });
    }
    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, { message: 'Incorrect password.' });
    }
    console.log('finished');
    return callback(null, user);
  });
}));

/**
 * A JWT passport strategy for authenticating users.
 * @param {string} jwtFromRequest - The JWT from the request.
 * @param {string} secretOrKey - The secret key for validating the JWT.
 * @param {function} callback - The callback function to be called upon completion of the strategy.
 */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret',
}, (jwtPayload, callback) => Users.findById(jwtPayload._id)
  .then((user) => callback(null, user))
  .catch((error) => callback(error))));

// IMPORTS
const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
require('./passport');

// Configure JWT Token
const generateJWTToken = (user) => jwt.sign(user, jwtSecret, {
  subject: user.Username,
  expiresIn: '7d',
  algorithm: 'HS256',
});

// User login: POST request
module.exports = (router) => {
  router.post(
    '/login',
    [
      check('Username', 'Username is required').isLength({ min: 5 }),
      check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
            user,
          });
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            res.send(err);
          }
          const token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        });
      })(req, res);
    },
  );
};

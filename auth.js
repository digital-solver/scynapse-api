// IMPORTS
const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
require('./passport');

/**
 * Generates a JSON web token for the given user.
 * @param {Object} user - The user object (property: 'username' {string}), to generate the JWT for.
 * @return {string} The JWT.
 * @example
 * const token = generateJWTToken({ Username: 'user1' });
 */
const generateJWTToken = (user) => jwt.sign(user, jwtSecret, {
  subject: user.Username,
  expiresIn: '7d',
  algorithm: 'HS256',
});

/**
 * Handles user login by authenticating the user and generating a JWT.
 * @param {Object} router - The router object.
 * @return {function} The route handler function.
 * @example
 * app.use('/api/auth', authRoutes);
 */
module.exports = (router) => {
  /**
   * @typedef ValidationError
   * @type {Object}
   * @property {string} msg - The error message.
   * @property {string} param - The name of the parameter that caused the error.
   * @property {string} value - The value of the parameter that caused the error.
   */

  /**
   * @typedef ValidationResult
   * @type {Object}
   * @property {boolean} isEmpty - True if there are no errors, false otherwise.
   * @property {ValidationError[]} array - An array of validation errors.
   */
  router.post(
    '/login',
    [
      check('Username', 'Username is required').isLength({ min: 5 }),
      check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
    ],

    /**
     * The route handler function.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @return {Object} The response object.
     */
    (req, res) => {
      /** @type {ValidationResult} */
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

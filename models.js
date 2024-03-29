// IMPORTS
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// SCHEMAS

/**
 * @typedef {Object} Movie
 * @property {string} Title - The title of the movie.
 * @property {string} Description - A brief description of the movie.
 * @property {Object} Genre - An object containing the genre of the movie.
 * @property {string} Genre.Name - The name of the genre.
 * @property {string} Genre.Description - A description of the genre.
 * @property {Object} Director - An object containing information about the movie's director.
 * @property {string} Director.Name - The name of the director.
 * @property {string} Director.Bio - A brief bio of the director.
 * @property {string[]} Actors - An array of strings containing the names of the actors.
 * @property {string} ImagePath - The path to an image of the movie.
 * @property {boolean} Featured - A boolean indicating whether the movie is featured or not.
 */
const movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, requred: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * @typedef {Object} User
 * @property {string} Username - The username of the user.
 * @property {string} Password - The hashed password of the user.
 * @property {string} Email - The email address of the user.
 * @property {Date} Birthday - The birthday of the user.
 * @property {ObjectId[]} FavoriteMovies - An array of ObjectIds referencing the user's favorites.
 */
const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 * Hashes a given password.
 * @param {string} password - The password to be hashed.
 * @return {string} The hashed password.
 * @example
 * const hashedPassword = User.hashPassword('password123');
 */
userSchema.statics.hashPassword = (password) => bcrypt.hashSync(password, 10);

/**
 * Validates a given password for a user.
 * @param {string} password - The password to be validated.
 * @return {boolean} True if the password is valid, false otherwise.
 * @example
 * const isValidPassword = user.validatePassword('password123');
 */
userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.Password);
};

// MODELS
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// EXPORTS
module.exports.Movie = Movie;
module.exports.User = User;

// IMPORTS
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// SCHEMAS
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

const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

userSchema.statistics.hashPassword = (password) => bcrypt.hashSync(password, 10);

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.Password);
};

// MODELS
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// EXPORTS
module.exports.Movie = Movie;
module.exports.User = User;

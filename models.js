// IMPORTS
const mongoose = require('mongoose');

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

// MODELS
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// EXPORTS
module.exports.Movie = Movie;
module.exports.User = User;

/* eslint-disable no-console */
// IMPORTS
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Models = require('./models');

// Configure Express Module
const app = express();

// Configure Mongoose Module
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/movie-api', { useNewUrlParser: true, useUnifiedTopology: true });

// Configure logging file access
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

// MIDDLEWARE
const requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(morgan('combined', { stream: accessLogStream }));
app.use(requestTime);
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

// AUTHENTICATION
const auth = require('./auth')(app);
// eslint-disable-next-line import/order
const passport = require('passport');
require('./passport');
// ROUTING

app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname });
});

// Get a list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((moviesList) => {
      res.status(201).json(moviesList);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((foundMovie) => {
      res.status(201).json(foundMovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get info about a genre
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Genre })
    .then((foundMovie) => {
      res.status(201).json(foundMovie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get info about a director
app.get('/directors/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Director })
    .then((foundMovie) => {
      res.status(201).json(foundMovie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get the list of users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get data on a single user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Create a new user
app.post('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        res.status(400).send(`${req.body.Username} already exists`);
      }
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
        .then((createdUser) => { res.status(201).json(createdUser); })
        .catch((error) => {
          console.error(error);
          res.status(500).send(`Error: ${error}`);
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    });
});

// Update one user by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.json(updatedUser);
      }
    },
  );
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(`${req.params.Username} was not found`);
      } else {
        res.status(200).send(`${req.params.Username} was deleted`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Add a movie to a user's list of favourites by movie ID
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $addToSet: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.json(updatedUser);
      }
    },
  );
});

// Remove a movie from favourites
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.json(updatedUser);
      }
    },
  );
});

// SERVER
app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});

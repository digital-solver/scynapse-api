/* eslint-disable no-console */
// IMPORTS
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const Models = require('./models');

// Configure Express Module
const app = express();

// Configure Mongoose Module
const Movies = Models.Movie;
const Users = Models.User;
// const URI = 'mongodb://localhost:27017/movie-api'; // Database Option 1: Local DB
const URI = process.env.CONNECTION_URI; // Database Option 2: Hosted DB

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Configure logging file access
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

// Configure Allowed Domains for Cross-Origin Resource Sharing (CORS)
const allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// Configure Date-Time Middleware
const requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

// Use Middleware
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

app.use(cors()); // CORS Option 1: Allow all domains
// app.use(cors({ // CORS Option 2: Only allow specific domains (see the variable: allowedOrigins)
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const message = `The CORS policy for this application doesnt allow access from this origin: ${origin}`;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   },
// }));

// AUTHENTICATION
const auth = require('./auth')(app);
require('./passport');

// ROUTING
// Home
app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname });
});

// Get a list of all movies
app.get('/movies', (req, res) => {
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
app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          res.status(400).send(`${req.body.Username} already exists`);
        }
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
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
  },
);

// Update one user by username
app.put(
  '/users/:Username',

  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],

  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
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
  },
);

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
app.post(
  '/users/:Username/favorites/:MovieID',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('MovieID', 'MovieID is required').not().isEmpty(),
    check('MovieID', 'MovieID does not appear to be valid').isMongoId(),
  ],
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  },
);

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

// SERVER & HEROKU
const PORT = process.env.PORT || 8090;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port: ${PORT}`);
});

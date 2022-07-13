/* eslint-disable no-console */
// IMPORTS

const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

// DATA

const topTenMovies = [
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    leadRole: 'Harry Potter',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    leadRole: 'Frodo Baggins',
  },
  {
    title: 'Blade Runner',
    leadRole: 'Rick Deckard',
  },
  {
    title: 'The Lion King',
    leadRole: 'Simba',
  },
  {
    title: 'Inception',
    leadRole: 'Dominick Cobb',
  },
  {
    title: 'Shutter Island',
    leadRole: 'Teddy Daniels',
  },
  {
    title: 'The Edge of Tomorrow',
    leadRole: 'Lt. Col. Bill Cage',
  },
  {
    title: 'Thor: Ragnarock',
    leadRole: 'Thor',
  },
  {
    title: 'Iron Man',
    leadRole: 'Iron Man',
  },
  {
    title: 'Avatar',
    leadRole: 'Jake Sully',
  },
];

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
app.use(express.static(path.join(__dirname, 'public')));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

// ROUTING

app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname });
});

app.get('/documentation', (req, res) => {
  res.sendFile('/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});

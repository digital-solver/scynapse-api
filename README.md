# Scynapse

A server and API back end for a web application for movie enthusiasts to access information about different movies, directors, and genres, and to update their personal information and create a list of their favorite movies.

## Table of Contents

* [Features](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Features)
* [Technologies](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Technologies)
* [Installation](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Installation)
* [Usage](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Usage)
* [Configuration](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Configuration)
* [Contribution Guideilnes](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Contribution)
* [License](https://github.com/Digital-Solver/movie-api/edit/main/README.md#License)
* [Contact](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Contact)
* [Resources](https://github.com/Digital-Solver/movie-api/edit/main/README.md#Resources)

## Features

Scynapse provides the following features:

* Return a list of all movies to the user
* Return data about a single movie by title to the user
* Return data about a genre (description) by name/title (e.g., “Thriller”)
* Return data about a director (bio, birth year, death year) by name
* Allow new users to register
* Allow users to update their user info (username, password, email, date of birth)
* Allow users to add a movie to their list of favorites
* Allow users to remove a movie from their list of favorites
* Allow existing users to deregister

## Technologies

Scynapse is a Node.js and Express with Mongoose application that uses REST architecture with URL endpoints corresponding to the data operations listed above. It is built using the MERN/MEAN stack (MongoDB, Express, React & Angular, and Node.js) and uses JSON Web Tokens (JWTs) for user authentication. This repository is for the Scynapse API, which is hosted on a Heroku server and communicates with a MongoDB database to store and retrieve data. Documentation is done with JSDoc, encryption with bcrypt, and validation with Passport.js.

### Web Server and MiddleWare
* Node.js - A back end runtime enviornment for JavaScript
* Express - Web server framework for Node.js
* Morgan - Middleware for logging HTTP requests
* Body-parser - Middleware for parsing HTTP request bodies
* Method-override - Middleware for overriding HTTP methods
* CORS - Middleware for enabling CORS in an Express app

### Database
* MongoDB - A NoSQL database that uses JSON-like documents
* Mongoose - A MongoDB object modelling tool

### Authentication, Authorisation, and Validation
* Passport - Middleware for authentication in express applications
* jsonWebToken - A library for generating and verifying JWTs (JSON Web Tokens)
* Bcrypt - A library for hashing and comparing passwords
* Express-validator - Middleware for validating HTTP requests in express applications

### Deployment
* Heroku - A cloud platform for hosting web apps

### Misc
* JSDoc - A documentation generator for JavaScript

## Installation

// TODO: Verify this section

1. Install Node.js and MongoDB on your local machine.
2. Clone this repository.
3. In the project root directory, run npm install to install required dependencies.
4. Set up a local MongoDB instance and update the URI value in the .env file with the connection string for your local database.
5. Run `npm start` to start the server.

## Usage

The Scynapse API can be accessed via a web browser or an API tool like Postman at the URL where the server is running (default: http://localhost:8090), on this page the user will find a link to the Endpoint documentation in HTML form. 

Through the API, users can do things like sign up, update their personal information, create a list of their favorite movies, and retrieve data about any movie in the database.

## Contribution Guidelines

If you would like to contribute to Scynapse, please follow these guidelines:

1. Fork this repository.
2. Create a new branch for your changes.
3. Make your changes and commit them to your branch.
4. Submit a pull request from your branch to this repository.

## License

Scynapse is released under the MIT License.

## Contact

If you have any questions or feedback about Scynapse, please contact me at kerr(dot)digitalsolver@gmail.com

## Resources

[Node.js](https://nodejs.org/)
[MongoDB](https://www.mongodb.com/)
[Express](https://expressjs.com/)

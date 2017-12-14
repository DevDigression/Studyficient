'use strict';
require('dotenv').config();
const {PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const {Note} = require('./notes/models');
const {Video} = require('./videos/models');
const {Subject} = require('./subjects/models');

mongoose.Promise = global.Promise;

const {router: usersRouter} = require('./users');
const {router: subjectsRouter} = require('./subjects');
const {router: notesRouter} = require('./notes');
const {router: videosRouter} = require('./videos');

const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

app.use(morgan('common'));
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/subjects/', subjectsRouter);
app.use('/api/notes/', notesRouter);
app.use('/api/videos/', videosRouter);
const jwtAuth = passport.authenticate('jwt', { session: false });

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    console.log(`connecting to ${databaseUrl}`);
    mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

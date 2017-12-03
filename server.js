'use strict';
require('dotenv').config();
const {PORT, DATABASE_URL} = require('./config');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

const {Note} = require('./notes/models');

mongoose.Promise = global.Promise;

// const { router: usersRouter } = require('./users');
const { router: notesRouter } = require('./notes');

// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


// Logging
app.use(morgan('common'));
app.use(express.static('public'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// passport.use(localStrategy);
// passport.use(jwtStrategy);

// app.use('/api/users/', usersRouter);
// app.use('/api/auth/', authRouter);
app.use('/api/notes/', notesRouter);
app.use('/api/notes/:title', notesRouter);

// const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
// app.get('/api/protected', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'rosebud'
//   });
// });

// app.get('/api/notes/:title', (req, res) => {
//   Note
//   .findOne({title: req.params.title})
//   .then(note => {
//     res.json(note.apiRepresentation())
//   })
//   .catch(
//     err => {
//       console.log(err);
//       res.status(500).json({message: 'Error in request'});
//     });
// });

app.get('/', (req, res) => {
  Note
    .find()
    .then(notes => {
      res.json({
          notes: notes.map(
          (note) => note.apiRepresentation())
        });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Error in request'});
    });
});

app.post('/api/notes', (req, res) => {
  const requiredParams = ['title', 'content', 'author'];
  for (let i = 0; i < requiredParams.length; i++) {
    const param = requiredParams[i];
    if (!(param in req.body)) {
      const message = `Must include \`${param}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Note
    .create({
      subject: req.body.subject,
      title: req.body.title,
      content: req.body.content
    })
    .then(Note => res.status(201).json(Note.apiRepresentation()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Error in request'});
    });
});


// app.put('/posts/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     const message = (
//       `Request path id (${req.params.id}) and request body id ` +
//       `(${req.body.id}) must match`);
//     console.error(message);
//     return res.status(400).json({message: message});
//   }

//   const postUpdate = {};
//   const updateableParams = ['title', 'content', 'author'];

//   updateableParams.forEach(param => {
//     if (param in req.body) {
//       postUpdate[param] = req.body[param];
//     }
//   });

//   Post
//     .findByIdAndUpdate(req.params.id, {$set: postUpdate})
//     .then(post => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Error in request'}));
// });

// app.delete('/posts/:id', (req, res) => {
//   Post
//     .findByIdAndRemove(req.params.id)
//     .then(post => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Error in request'}));
// });









app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
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

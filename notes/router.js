'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Note} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new note
router.post('/', jsonParser, (req, res) => {
  //Note.create.....
});


// router.get('/', (req, res) => {
//   return Note.find()
//     .then(notes => res.json(notes.map(note => note.apiRepr())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

module.exports = {router};

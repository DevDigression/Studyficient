const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

const {Note} = require('./models');
const {Subject} = require('../subjects/models');

const router = express.Router();

router.get('/', jwtAuth, (req, res) => {

  Note
    .find({
      user: req.user.id
    })
    .then(notes => {
      res.json({
          notes: notes.map( note => note.apiRepresentation())
        });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Error in request'});
    });
});

router.post('/', jsonParser, jwtAuth, (req, res) => {
	const requiredParams = ['subject', 'title', 'content'];


	for (let i = 0; i < requiredParams.length; i++) {
		const param = requiredParams[i];
		if (!(param in req.body)) {
			const errorMessage = `Missing ${param} in request body`;
			console.error(errorMessage);
			return res.status(400).send(errorMessage);
		}
	}
  let note;
  Note
    .create({
      subject: req.body.subject,
      title: req.body.title,
      content: req.body.content,
      user: req.user.id
    })
    .then(_note => {
      note = _note;
      return Subject.findById(note.subject);
    })
    .then(subject => {
      subject.notes.push(note._id);
      return subject.save();
    })
    .then(subject => res.status(201).json(note.apiRepresentation()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Error in request'});
    });
});

router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  const noteUpdate = {};
  const updateableParams = ['subject', 'title', 'content'];

  updateableParams.forEach(param => {
    if (param in req.body) {
      noteUpdate[param] = req.body[param];
    }
  });

  Note
    .findByIdAndUpdate(req.params.id, {$set: noteUpdate})
    .then(note => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Error in request'}));
});

router.delete('/:id', jwtAuth, (req, res) => {
  Note
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Error in request'}));
});

router.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

module.exports = {router};

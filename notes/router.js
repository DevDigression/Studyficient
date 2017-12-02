const express = require('express');
const bodyParser = require('body-parser');

const {Note} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/api/notes/:title', (req, res) => {
  Note
  .findOne({title: req.params.title})
  .then(note => {
    res.json(note.apiRepresentation())
  })
  .catch(
    err => {
      console.log(err);
      res.status(500).json({message: 'Error in request'});
    });
});

router.get('/', (req, res) => {
	// res.json({note:"hello"});
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

router.post('/', jsonParser, (req, res) => {
	const requiredParams = ['subject', 'title', 'content'];


	for (let i = 0; i < requiredParams.length; i++) {
		const param = requiredParams[i];
		if (!(param in req.body)) {
			const errorMessage = `Missing ${param} in request body`;
			console.error(errorMessage);
			return res.status(400).send(errorMessage);
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




module.exports = {router};

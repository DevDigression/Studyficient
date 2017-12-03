const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Note} = require('./models');

const router = express.Router();


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

router.put('/:id', jsonParser, (req, res) => {
  // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
  //   const message = (
  //     `Request path id (${req.params.id}) and request body id ` +
  //     `(${req.body.id}) must match`);
  //   console.error(message);
  //   return res.status(400).json({message: message});
  // }

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


module.exports = {router};

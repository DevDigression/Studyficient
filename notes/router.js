const express = require('express');
const bodyParser = require('body-parser');

const {notes} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

notes.create(
    'Subject',
	'Starter Title',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	);


router.get('/', (req, res) => {
	res.json(notes.get());
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

	const newNote = notes.create(req.body.subject, req.body.title, req.body.content);
	res.status(201).json(newNote);
});




module.exports = router;

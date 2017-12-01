const express = require('express');
const bodyParser = require('body-parser');

const {notes} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();



router.get('/', (req, res) => {
	res.json({note:"hello"});
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

//const newNote = notes.create(req.body.subject, req.body.title, req.body.content);
	res.status(201).json(newNote);
});




module.exports = {router};

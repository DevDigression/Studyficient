'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Note} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();


Note.create(
	'Web Development',
	'Starter Note',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	);

router.get('/', (req, res) => {
	res.json(Note.get());
});

// router.get('/', (req, res) => {
//   return Note.find()
//     .then(notes => res.json(notes.map(note => note.apiRepr())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

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

	const newNote = Note.create(req.body.subject, req.body.title, req.body.content);
	res.status(201).json(newNote);
});



module.exports = {router};




// router.delete('/:id', (req, res) => {
// 	BlogPosts.delete(req.params.id);
// 	console.log(`Deleted Post ID ${req.params.ID}`);
// 	res.status(204).end();
// });

// router.put('/:id', jsonParser, (req, res) => {
// 	const requiredParams = ['id', 'author', 'title', 'content'];
// 	for (let i = 0; i < requiredParams.length; i++) {
// 		const param = requiredParams[i];
// 		if (!(param in req.body)) {
// 			const errorMessage = `Missing ${param} in request body`;
// 			console.error(errorMessage);
// 			return res.status(400).send(errorMessage);
// 		}
// 	}
// 	if (req.params.id !== req.body.id) {
// 		const errorMessage = (`Request path id ${req.params.id} does not match request body id ${req.body.id}`);
// 	    console.error(errorMessage);
// 	    return res.status(400).send(errorMessage);
// 	}
// 	console.log(`Updating post ${req.params.id}`);
// 	const updatedPost = BlogPosts.update({
// 		id: req.params.id,
// 		author: req.body.author,
// 		title: req.body.title,
// 		content: req.body.content
// 	});
// 	res.status(204).end();
// });

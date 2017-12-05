const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Video} = require('./models');

const router = express.Router();


router.get('/', (req, res) => {
  Video
    .find()
    .then(videos => {
      res.json({
          videos: videos.map(
          (video) => video.videoApiRepresentation())
        });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Error in request'});
    });
});

router.post('/', jsonParser, (req, res) => {
	const requiredParams = ['subject', 'link'];


	for (let i = 0; i < requiredParams.length; i++) {
		const param = requiredParams[i];
		if (!(param in req.body)) {
			const errorMessage = `Missing ${param} in request body`;
			console.error(errorMessage);
			return res.status(400).send(errorMessage);
		}
	}

  Video
    .create({
      subject: req.body.subject,
      link: req.body.link
    })
    .then(Video => res.status(201).json(Video.videoApiRepresentation()))
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

  const videoUpdate = {};
  const updateableParams = ['subject', 'link'];

  updateableParams.forEach(param => {
    if (param in req.body) {
      videoUpdate[param] = req.body[param];
    }
  });

  Video
    .findByIdAndUpdate(req.params.id, {$set: videoUpdate})
    .then(video => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Error in request'}));
});

router.delete('/:id', (req, res) => {
  Video
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Error in request'}));
});

router.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

module.exports = {router};

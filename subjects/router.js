const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

const {Subject} = require('./models');

const router = express.Router();


router.get('/', jwtAuth, (req, res) => {
  Subject
    .find({
      user: req.user.id
    })
    .then(subjects => {
      res.json({
          subjects: subjects.map(
          (subject) => subject.subjectApiRepresentation())
        });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Error in request'});
    });
});

router.get('/:id', jwtAuth, (req, res) => {
  Subject
    .findOne({
      _id: req.params.id,
      user: req.user.id
    })
    .populate('notes')
    .populate('videos')
    .then(subject => {
      res.json({
          subject: subject.subjectApiRepresentation()
        });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Error in request'});
    });
});

router.post('/', jsonParser, jwtAuth, (req, res) => {
  const requiredParams = ['name'];


  for (let i = 0; i < requiredParams.length; i++) {
    const param = requiredParams[i];
    if (!(param in req.body)) {
      const errorMessage = `Missing ${param} in request body`;
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }

  Subject
    .create({
      user: req.user.id,
      name: req.body.name
    })
    .then(Subject => res.status(201).json(Subject.subjectApiRepresentation()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Error in request'});
    });
});

router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
  //   const message = (
  //     `Request path id (${req.params.id}) and request body id ` +
  //     `(${req.body.id}) must match`);
  //   console.error(message);
  //   return res.status(400).json({message: message});
  // }

  const subjectUpdate = {};
  const updateableParams = ['name'];

  updateableParams.forEach(param => {
    if (param in req.body) {
      subjectUpdate[param] = req.body[param];
    }
  });

  Subject
    .findByIdAndUpdate(req.params.id, {$set: subjectUpdate})
    .then(subject => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Error in request'}));
});

router.delete('/:id', jwtAuth, (req, res) => {
  Subject
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Error in request'}));
});

router.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

module.exports = {router};

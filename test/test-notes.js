'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {Note} = require('../notes');

const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);


function seedNoteData() {
  console.info('seeding note data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateNoteData());
  }
  return Note.insertMany(seedData);
}

function generateNoteSubject() {
  const subjects = [
    'English', 'History', 'Math', 'Science'];
  return subjects[Math.floor(Math.random() * subjects.length)];
}

function generateNoteTitle() {
  const titles = ['ENG 101', 'HIS 200', 'CAL 321', 'PHY 400'];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateNoteContent() {
  const contents = ['The finest works in British Literature...', 'The year was 1776...', 'Derivatives measure instantaneous rates of change...', 'A vector has both magnitude and direction...'];
  return contents[Math.floor(Math.random() * contents.length)];
}

function generateNoteData() {
  return {
    subject: generateNoteSubject(),
    title: generateNoteTitle(),
    content: generateNoteContent(),
    user: '5a2c382af504340014e01db4'
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('Protected endpoint', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const token = jwt.sign(
    {
      user: {
        username,
      }
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: username,
      expiresIn: '7d'
    }
  );

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });

// TODO: DO all normal tests like restaurants -> for notes
// https://github.com/Thinkful-Ed/node-restaurants-app-mongoose/blob/feature/with-tests/test/test-restaurants-integration.js


  describe('GET endpoint', function() {

    it('should return all existing notes', function() {
      let res;
      return chai.request(app)
        .get('/api/notes')
        .set('authorization', `Bearer ${token}`)
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.notes.should.have.length.of.at.least(1);
          return Note.count();
        })
        // .then(function(count) {
        //   res.body.notes.should.have.length.of(count);
        // });
    });


    it('should return notes with right fields', function() {
      let resNote;
      return chai.request(app)
        .get('/api/notes')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.notes.should.be.a('array');
          res.body.notes.should.have.length.of.at.least(1);

          res.body.notes.forEach(function(note) {
            note.should.be.a('object');
            note.should.include.keys(
              'subject', 'title', 'content', 'user');
          });
          resNote = res.body.notes[0];
          return Note.findById(resNote.id);
        })
        .then(function(note) {
          // resNote.subject.should.equal(note.subject);
          resNote.title.should.equal(note.title);
          resNote.content.should.equal(note.content);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new note', function() {

          const newNote = {
            content: '1776',
            subject: '5a2c38e721859d24ec94ab3e',
            title: 'American Revolution',
            user: '5a2c382af504340014e01db4'
          };

         return chai.request(app)
           .post('/api/notes')
           .send(newNote)
           .set('authorization', `Bearer ${token}`)
           .then(function(res) {
             res.should.have.status(201);
             // res.should.be.json;
             // res.body.should.be.a('object');
             // res.body.should.include.keys(
             //   'subject', 'title', 'content');
             // res.body.id.should.not.be.null;
             // res.body.subject.should.equal(newNote.subject);
             // res.body.title.should.equal(newNote.title);
             // res.body.content.should.equal(newNote.content);
             // return Note.findById(res.body.id);
           })
           // .then(function(note) {
           //   note.subject.should.equal(newNote.subject);
           //   note.title.should.equal(newNote.title);
           //   note.content.should.equal(newNote.content);
           // });
       });
       
  });

 describe('PUT endpoint', function() {

    it('should update note fields', function() {
      const updateData = {
        title: 'New Title',
        content: 'New Content'
      };

      return Note
        .findOne()
        .then(function(note) {
          updateData.id = note.id;

          return chai.request(app)
            .put(`/api/notes/${note.id}`)
            .send(updateData)
            .set('authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Note.findById(updateData.id);
        })
        .then(function(note) {
          note.title.should.equal(updateData.title);
          note.content.should.equal(updateData.content);
        });
    });
  });

  describe('DELETE endpoint', function() {

    it('delete a note by id', function() {

      let note;

      return Note
        .findOne()
        .then(function(_note) {
          note = _note;
          return chai.request(app).delete(`/api/notes/${note.id}`)
        .set('authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Note.findById(note.id);
        })
        .then(function(_note) {
          should.not.exist(_note);
        });
    });
  });
});
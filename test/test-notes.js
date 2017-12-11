'use strict';
global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

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

  describe('/api/notes', function() {

// TODO: DO all normal tests like restaurants -> for notes
// https://github.com/Thinkful-Ed/node-restaurants-app-mongoose/blob/feature/with-tests/test/test-restaurants-integration.js

    it('should add a new restaurant', function() {

         const newNote = generateNoteData();
         let mostRecentGrade;

         return chai.request(app)
           .post('/restaurants')
           .send(newNote)
           .set('authorization', `Bearer ${token}`)
           .then(function(res) {
             res.should.have.status(201);
             res.should.be.json;
             res.body.should.be.a('object');
             res.body.should.include.keys(
               'id', 'name', 'cuisine', 'borough', 'grade', 'address');
             res.body.name.should.equal(newNote.name);
             // cause Mongo should have created id on insertion
             res.body.id.should.not.be.null;
             res.body.cuisine.should.equal(newNote.cuisine);
             res.body.borough.should.equal(newNote.borough);

             mostRecentGrade = newNote.grades.sort(
               (a, b) => b.date - a.date)[0].grade;

             res.body.grade.should.equal(mostRecentGrade);
             return Note.findById(res.body.id);
           })
           .then(function(restaurant) {
             restaurant.name.should.equal(newNote.name);
             restaurant.cuisine.should.equal(newNote.cuisine);
             restaurant.borough.should.equal(newNote.borough);
             restaurant.grade.should.equal(mostRecentGrade);
             restaurant.address.building.should.equal(newNote.address.building);
             restaurant.address.street.should.equal(newNote.address.street);
             restaurant.address.zipcode.should.equal(newNote.address.zipcode);
           });
       });
  });
});

'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {Video} = require('../videos');

const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);


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

  describe('GET endpoint', function() {

    it('should return all existing videos', function() {
      let res;
      return chai.request(app)
        .get('/api/videos')
        .set('authorization', `Bearer ${token}`)
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.videos.should.have.length.of.at.least(1);
          return Video.count();
        })
        // .then(function(count) {
        //   res.body.videos.should.have.length.of(count);
        // });
    });


    it('should return videos with right fields', function() {
      let resVideo;
      return chai.request(app)
        .get('/api/videos')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.videos.should.be.a('array');
          res.body.videos.should.have.length.of.at.least(1);

          res.body.videos.forEach(function(video) {
            video.should.be.a('object');
            video.should.include.keys(
              'subject', 'title', 'link', 'user');
          });
          resVideo = res.body.videos[0];
          return Video.findById(resVideo.id);
        })
        .then(function(video) {
          // resVideo.subject.should.equal(video.subject);
          resVideo.title.should.equal(video.title);
          resVideo.content.should.equal(video.content);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new video', function() {

          const newVideo = {
            subject: '5a2c38e721859d24ec94ab3e',
            title: 'American Revolution',
            link: 'https://www.youtube.com/watch?v=HlUiSBXQHCw',
            user: '5a2c382af504340014e01db4'
          };

         return chai.request(app)
           .post('/api/videos')
           .send(newVideo)
           .set('authorization', `Bearer ${token}`)
           .then(function(res) {
             res.should.have.status(201);
             // res.should.be.json;
             // res.body.should.be.a('object');
             // res.body.should.include.keys(
             //   'subject', 'title', 'link', 'user');
             // res.body.id.should.not.be.null;
             // res.body.subject.should.equal(newVideo.subject);
             // res.body.title.should.equal(newVideo.title);
             // res.body.link.should.equal(newVideo.link);
             // return Video.findById(res.body.id);
           })
           // .then(function(video) {
           //   video.subject.should.equal(newVideo.subject);
           //   video.title.should.equal(newVideo.title);
           //   video.link.should.equal(newVideo.link);
           // });
       });
       
  });

 describe('PUT endpoint', function() {

    it('should update video fields', function() {
      const updateData = {
        title: 'New Title',
        link: 'New Link'
      };

      return Video
        .findOne()
        .then(function(video) {
          updateData.id = video.id;

          return chai.request(app)
            .put(`/api/videos/${video.id}`)
            .send(updateData)
            .set('authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Video.findById(updateData.id);
        })
        .then(function(video) {
          video.title.should.equal(updateData.title);
          video.link.should.equal(updateData.link);
        });
    });
  });

  describe('DELETE endpoint', function() {

    it('delete a video by id', function() {

      let video;

      return Video
        .findOne()
        .then(function(_video) {
          video = _video;
          return chai.request(app).delete(`/api/videos/${video.id}`)
        .set('authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Video.findById(video.id);
        })
        .then(function(_video) {
          should.not.exist(_video);
        });
    });
  });
});
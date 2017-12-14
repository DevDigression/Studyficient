'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users');
const {Video} = require('../videos');
const {Subject} = require('../subjects');

const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

const username = 'exampleUser';
const password = 'examplePass';
let user;
let subject;


function seedVideoData() {
  console.info('seeding video data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateVideoData());
  }
  return Video.insertMany(seedData);
}

function generateVideoTitle() {
  const titles = ['ENG 101', 'HIS 200', 'CAL 321', 'PHY 400'];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateVideoLink() {
  const links = ['https://www.youtube.com/watch?v=MSYw502dJNY', 'https://www.youtube.com/watch?v=bO7FQsCcbD8', 'https://www.youtube.com/watch?v=rAof9Ld5sOg', 'https://www.youtube.com/watch?v=w3BhzYI6zXU'];
  return links[Math.floor(Math.random() * links.length)];
}

function generateVideoData() {
  return {
    subject: subject._id,
    title: generateVideoTitle(),
    link: generateVideoLink(),
    user: user._id
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

function createToken(){
  return jwt.sign(
    {
      user: {
        username,
        id:user._id
      }
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: username,
      expiresIn: '7d'
    }
  )
}

describe('Protected endpoint', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  afterEach(function() {
    return tearDownDb();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      }).then(_user => user = _user)
    );
  });

  beforeEach(function() {
    return Subject
    .create({
      user: user._id,
      name: "A test subject"
    })
    .then(_subject => subject = _subject)

  });

  beforeEach(function() {
    return seedVideoData();
  });

  afterEach(function() {
    return User.remove({})
    .then(()=> Video.remove({}))
    .then(()=> Subject.remove({})) ;
  });


  describe('GET endpoint', function() {

    it('should return all existing videos', function() {
      let res;
      return chai.request(app)
        .get('/api/videos')
        .set('authorization', `Bearer ${createToken()}`)
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.videos.should.have.lengthOf.at.least(1);
          return Video.count();
        })
        .then(function(count) {
          // TODO: fixed.
          // Video.count() doesnt work here because it gives you the whole notes
          // collection. We only want the notes for the user we created. 10 is fine
          res.body.videos.should.have.lengthOf(10);
        });
    });


    it('should return videos with right fields', function() {
      let resVideo;
      return chai.request(app)
        .get('/api/videos')
        .set('authorization', `Bearer ${createToken()}`)
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
          resVideo.link.should.equal(video.link);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new video', function() {

          const newVideo = {
            subject: subject._id,
            title: 'American Revolution',
            link: 'https://www.youtube.com/watch?v=HlUiSBXQHCw',
            user: user._id
          };

         return chai.request(app)
           .post('/api/videos')
           .send(newVideo)
           .set('authorization', `Bearer ${createToken()}`)
           .then(function(res) {
             res.should.have.status(201);
             res.should.be.json;
             res.body.should.be.a('object');
             res.body.should.include.keys(
               'subject', 'title', 'link', 'user');
             res.body.id.should.not.be.null;
             // res.body.subject.should.equal(newVideo.subject);
             res.body.title.should.equal(newVideo.title);
             res.body.link.should.equal(newVideo.link);
             return Video.findById(res.body.id);
           })
           .then(function(video) {
             // video.subject.should.equal(newVideo.subject);
             video.title.should.equal(newVideo.title);
             video.link.should.equal(newVideo.link);
           });
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
            .set('authorization', `Bearer ${createToken()}`);
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
        .set('authorization', `Bearer ${createToken()}`);
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

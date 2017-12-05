'use strict';
// const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const VideoSchema = mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject'
  },
  title: {
  	type: String,
  	required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

VideoSchema.methods.videoApiRepresentation = function() {
  return {
  	subject: this.subject,
    title: this.title,
    link: this.link,
    description: this.description,
    id: this._id
  };
};


const Video = mongoose.model('Video', VideoSchema);

module.exports = {Video: Video};

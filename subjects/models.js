'use strict';

const mongoose = require('mongoose');
const passport = require('passport');

mongoose.Promise = global.Promise;

const SubjectSchema = mongoose.Schema({
  name: {
  	type: String,
  	required: true
  },
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
  videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}]
});

SubjectSchema.methods.subjectApiRepresentation = function() {
  return {
  	name: this.name,
    id: this._id,
    notes: this.notes,
    videos: this.videos,
    user: this.user
  };
};


const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = {Subject: Subject};

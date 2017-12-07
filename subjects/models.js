'use strict';
// const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SubjectSchema = mongoose.Schema({
  name: {
  	type: String,
  	required: true
  },
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
  videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}]
});

SubjectSchema.methods.subjectApiRepresentation = function() {
  return {
  	name: this.name,
    id: this._id,
    notes: this.notes,
    videos: this.videos
  };
};


const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = {Subject: Subject};

'use strict';
// const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const NoteSchema = mongoose.Schema({
  subject: {
  	type: String,
  	required: true
  },
  title: {
  	type: String,
  	required: true
  },
  content: {
    type: String,
    required: true
  }
});

NoteSchema.methods.apiRepresentation = function() {
  return {
  	subject: this.subject,
    title: this.title,
    content: this.content
  };
};


const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note: Note};

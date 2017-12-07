'use strict';
// const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const NoteSchema = mongoose.Schema({
  subject: {
    required: true,
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject'
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
    content: this.content,
    id: this._id
  };
};


const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note: Note};

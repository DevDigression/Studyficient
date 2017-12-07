'use strict';

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
  },
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
});

NoteSchema.methods.apiRepresentation = function() {
  return {
  	subject: this.subject,
    title: this.title,
    content: this.content,
    user: this.user,
    id: this._id
  };
};


const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note: Note};

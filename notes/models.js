'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const NoteSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    unique: true
  }
});

NoteSchema.methods.apiRepr = function() {
  return {
    //username: this.username || '',
  };
};


const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note};

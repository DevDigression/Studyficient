'use strict';
const bcrypt = require('bcryptjs');
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

NoteSchema.methods.userFormat = function() {
  return {
  	subject: this.subject,
    title: this.title,
    content: this.content
  };
};


const notes = {
  
  notes:{}, 
  
  create: function(subject, title, content) {
    const note = {
      subject: subject ,
      title: title,
      content: content
    };
    return note;
  },
  get: function() {
    const allNotes = this.notes;
    const returnNotes = [];
     Object.keys(allNotes).forEach(note =>{
      returnNotes.push(note);
    });   
    return returnNotes;
  }
}

const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note};

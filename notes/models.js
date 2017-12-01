'use strict';
// const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const uuid = require('uuid');
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
      id: uuid.v4(),
      subject: subject ,
      title: title,
      content: content
    };
    this.notes[note.id] = note;
    return note;
  },
  get: function(id=null) {
     if (id !== null) {
      return this.notes[id]
     }
    const allNotes = this.notes;
    const returnNotes = [];
     Object.keys(allNotes).forEach(noteId =>{
      returnNotes.push(allNotes[noteId]);
    });   
    return returnNotes;
  }
}

const Note = mongoose.model('Note', NoteSchema);

module.exports = {notes: notes};

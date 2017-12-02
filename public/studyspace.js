// const {Note} = require('./models');

const NOTES_PATH = '/api/notes';

$(() => {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  	displayNotes();

	$('#note-form').submit(() => {
		event.preventDefault();
		let note = {};
		note.subject = $('#subject').val();
		note.title = $('#title').val();
		note.content = $('#note-content').val();
		$('input').val("")
    console.log(note);
		addNote(note);
	});

	$('.notes-display').on('click', 'button', (event) => {
		event.preventDefault();
		const thisNote = $(event.currentTarget).parent().attr('data-title');
		console.log(thisNote);
		displayModal(thisNote);
	});

});

function displayModal(noteTitle) {
console.log("displayModal: " + noteTitle);
  $.ajax({
		method: 'GET',
		url: '/api/notes/' + noteTitle,
		success: (note) => {
					return `<div class="modal fade note-modal" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog" role="document">
						    <div class="modal-content">
						      <div class="modal-header">
						        <h5 class="modal-title" id="exampleModal">${note.title}</h5>
						        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						          <span aria-hidden="true">&times;</span>
						        </button>
						      </div>
						      <div class="modal-body">
						      	${note.content}
						      </div>
						      <div class="modal-footer">
						        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						        <button type="submit" class="btn btn-primary">Submit</button>
						      </div>
						    </div>
						</div>
					</div>`
		},
		dataType: 'json',
		contentType: 'application/json'
	});
	}

function displayNotes() {
console.log("displayNotes");
  $.ajax({
		method: 'GET',
		url: '/api/notes',
		success: (data) => {
		console.log(data);
		const notesList = data.notes.map((item, index) => renderNotes(item));
		$('.notes-display').html(notesList);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function renderNotes(note) {
	return `<div data-title="${note.title}">
			<button type="button" class="note-button btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  			${note.title}
			</button>
			</div>`

	// return `<div class="note">
	// <h2>${currentNote.subject}</h2>
	// <h3>${currentNote.title}</h3>
	// <p>${currentNote.content}</p>
	// <button class="delete">Delete Note</button>
	// </div>`;
}

function displayNoteModal(currentNote) {
	console.log("displayNote: " + currentNote);
			return `<div class="modal fade note-modal" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
						<div class="modal-dialog" role="document">
						    <div class="modal-content">
						      <div class="modal-header">
						        <h5 class="modal-title" id="exampleModal">${currentNote.title}</h5>
						        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						          <span aria-hidden="true">&times;</span>
						        </button>
						      </div>
						      <div class="modal-body">
						      	${currentNote.content}
						      </div>
						      <div class="modal-footer">
						        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						        <button type="submit" class="btn btn-primary">Submit</button>
						      </div>
						    </div>
						</div>
					</div>`
}

function addNote(note) {
  console.log("addNote: ");
  console.log(note);
	$.ajax({
		method: 'POST',
		url: '/api/notes',
		data: JSON.stringify(note),
		success: (data) => {
			displayNotes();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

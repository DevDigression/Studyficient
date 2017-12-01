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

});




function displayNotes() {
	console.log("displayNotes");
	$.getJSON(NOTES_PATH, (notes) => {
		console.log(notes);
		const notesList = notes.map((item, index) => renderNotes(item));
		$('.notes-display').html(notesList);
		});
	}


function renderNotes(currentNote) {
	return `<div class="note">
	<h2>${currentNote.subject}</h2>
	<h3>By ${currentNote.title}</h3>
	<p>${currentNote.content}</p>
	<button class="delete">Delete Note</button>
	</div>`;
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
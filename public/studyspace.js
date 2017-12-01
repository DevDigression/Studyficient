// const DATABASE_URL = 'mongodb://notes:notes@ds155820.mlab.com:55820/mongo-projects';


$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  displayNotes();
});




function displayNotes() {
	console.log("displayNotes");
	$.getJSON(DATABASE_URL, (notes) => {
		console.log(notes);
		const notesList = notes.map((item, index) => {renderNotes(item)});
		$('.notes-display').html(notesList);
		});
	}


function renderNote(currentNote) {
	return `<div class="note">
	<h2>${currentNote.subject}</h2>
	<h3>By ${currentNote.title}</h3>
	<p>${currentNote.content}</p>
	<button class="delete">Delete Note</button>
	</div>`;
}

function addNote(note) {
	$.ajax({
		method: 'POST',
		url: DATABASE_URL,
		data: JSON.stringify(note),
		success: (data) => {
			displayNotes();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}
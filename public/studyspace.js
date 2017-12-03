const NOTES_PATH = '/api/notes';
let state = {
  notes:[]
}

$(() => {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  displayNotes();

  $('.new-note-button').click(() => {
    $('#exampleModal').modal('show')
  });
  $('#modal-save').click((event) => {
    event.preventDefault();
    var note = {};
    note.subject = "Subject"; // For now
    note.title = $('#modal-title').val();
    note.content = $('#modal-text').val();
    console.log("note to update: " + note);
    // TODO: THIS SAME FORM SAVES NEW NOTES AND EDITS OLD ONES.
    // CHECK FOR ID ON THE FORM TO KNOW
    let id = $('#modal-id').text();
    console.log(id);

    if (id) {
      // SAVE EDITED NOTE
      updateNote(note, id);
      console.log("modifying an old note");
    } else {
      //  NEW NOTE!
      console.log("saving a new note:");
      addNote(note);
    }
  });

  $('.note-modal').on('hidden.bs.modal', function (event) {
      event.preventDefault();
      console.log("close");
      clearModal();
  });

  $('.notes-display').on('click', 'button', (event) => {
    event.preventDefault();
    const thisNoteId = $(event.currentTarget).parents('.note-display').attr('data-id');
    let thisNote = state.notes.find(note => note.id === thisNoteId);
    $('#exampleModal').modal('show');
    $('#modal-text').text(thisNote.content);
    $('#modal-title').text(thisNote.title);
    $('#modal-id').text(thisNote.id);
    // TODO CLEAR FORM WHEN IT IS CLOSED
	$('#exampleModal').on('hidden.bs.modal', function(event) {
  		event.preventDefault();
  		clearModal();
  		console.log("modal closed and content cleared");
	});
  });
});

function clearModal(){
  $('#modal-text').text("");
  $('#modal-title').text("");
  $('#modal-id').text("");
}

function displayNotes() {
  $.ajax({
    method: 'GET',
    url: '/api/notes',
    success: (data) => {
      state.notes=data.notes;
      const notesList = data.notes.map((item, index) => renderNotes(item));
      $('.notes-display').html(notesList);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function renderNotes(note) {
  return `
  <div class="col-md-3">
  <div class="note-display" data-id=${note.id}>
  <h3>${note.title}</h3>
  <p>${note.content}</p>
  <button class="edit-button btn btn-primary">Edit</button>
  </div>
  </div>
  `
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

function updateNote(note, id) {
  console.log("updateNote: ");
  console.log(note);
  console.log("note ID: " + id);
	$.ajax({
		method: 'PUT',
		url: '/api/notes/' + id,
		data: JSON.stringify(note),
		success: (data) => {
			displayNotes();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}
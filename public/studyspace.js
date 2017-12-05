const NOTES_PATH = '/api/notes';
const VIDEOS_PATH = '/api/videos';

let state = {
  notes: [],
  videos: []
}

$(() => {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

/******************************** NOTES ********************************/

  displayNotes();
  displayVideos();

  $('.new-note-button').click(() => {
    $('#exampleModal').modal('show')
  });
  $('#modal-save').click((event) => {
    event.preventDefault();
    var note = {};
    note.subject = "Subject"; // For now
    note.title = $('#modal-title').val();
    note.content = $('#modal-text').val();
    let id = $('#modal-id').text();

    if (id) {
      updateNote(note, id);
      console.log("modifying an old note");
    } else {
      console.log("saving a new note:");
      addNote(note);
    }
    $('#exampleModal').modal('hide');
  });

  $('.note-modal').on('hidden.bs.modal', function (event) {
      event.preventDefault();
      console.log("close");
      clearModal();
  });

  $('.notes-display').on('click', '.edit-button', (event) => {
    event.preventDefault();
    const thisNoteId = $(event.currentTarget).parent().attr('data-id');
    let thisNote = state.notes.find(note => note.id === thisNoteId);
    $('#exampleModal').modal('show');
    $('#modal-text').val(thisNote.content);
    $('#modal-title').val(thisNote.title);
    $('#modal-id').text(thisNote.id);
  });
    $('.notes-display').on('click', '.delete-button', (event) => {
    event.preventDefault();
    const thisNoteId = $(event.currentTarget).parent().attr('data-id');
    deleteNote(thisNoteId);
  });
  	$('#exampleModal').on('hidden.bs.modal', function(event) {
  		event.preventDefault();
  		clearModal();
  		console.log("modal closed and content cleared");
	});
});

function clearModal(){
  $('#modal-text').val("");
  $('#modal-title').val("");
  $('#modal-id').text("");
}

function displayNotes() {
  $.ajax({
    method: 'GET',
    url: '/api/notes',
    success: (data) => {
    	console.log("Notes data: " + data.notes);
      state.notes = data.notes;
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
  <button class="delete-button btn btn-primary">Delete</button>
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

function deleteNote(id) {
	$.ajax({
		method: 'DELETE',
		url: '/api/notes/' + id,
		success: (data) => {
			displayNotes();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}


/******************************** VIDEOS ********************************/

function displayVideos() {
  $.ajax({
    method: 'GET',
    url: '/api/videos',
    success: (data) => {
    	console.log("Videos data: " + data.videos);
      state.videos = data.videos;
      const videosList = data.videos.map((item, index) => renderVideos(item));
      $('.videos-display').html(videosList);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function renderVideos(video) {
  return `
  <div class="col-md-3">
  <div class="video-display" data-id=${video.id}>
  <h3>${video.title}</h3>
  <p>${video.description}</p>
  <button class="edit-button btn btn-primary">Edit</button>
  <button class="delete-button btn btn-primary">Delete</button>
  </div>
  </div>
  `
}
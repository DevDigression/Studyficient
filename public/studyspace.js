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
    } else {
      addNote(note);
    }
    $('#exampleModal').modal('hide');
  });

  $('.note-modal').on('hidden.bs.modal', function (event) {
      event.preventDefault();
      clearNoteModal();
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
  		clearNoteModal();
	});

/******************************** VIDEOS ********************************/
  
  displayVideos();

  $('.new-video-button').click(() => {
    $('#video-modal').modal('show')
  });
  $('#video-save').click((event) => {
    event.preventDefault();
    var video = {};
    video.subject = $('#video-title').val();
    video.link = $('#video-text').val();
    let id = $('#video-id').text();

    if (id) {
      updateVideo(video, id);
    } else {
      addVideo(video);
    }
    $('#video-modal').modal('hide');
  });

  $('.video-modal').on('hidden.bs.modal', function (event) {
      event.preventDefault();
      clearVideoModal();
  });

  $('.videos-display').on('click', '.edit-button', (event) => {
    event.preventDefault();
    const thisVideoId = $(event.currentTarget).parent().attr('data-id');
    let thisVideo = state.videos.find(video => video.id === thisVideoId);
    $('#video-modal').modal('show');
    $('#video-text').val(thisVideo.link);
    $('#video-title').val(thisVideo.subject);
    $('#video-id').text(thisVideo.id);
  });
  $('.videos-display').on('click', '.delete-button', (event) => {
    event.preventDefault();
    const thisVideoId = $(event.currentTarget).parent().attr('data-id');
    deleteVideo(thisVideoId);
  });
  $('#video-modal').on('hidden.bs.modal', function(event) {
  		event.preventDefault();
  		clearVideoModal();
	});

/*************** END DOC READY *******************/
});

function clearNoteModal(){
  $('#modal-text').val("");
  $('#modal-title').val("");
  $('#modal-id').text("");
}

function clearVideoModal(){
  $('#video-text').val("");
  $('#video-title').val("");
  $('#video-id').text("");
}

/******************************** NOTES ********************************/

function displayNotes() {
  $.ajax({
    method: 'GET',
    url: '/api/notes',
    success: (data) => {
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
  <iframe width="100%" src="https://www.youtube.com/embed/${video.link}" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
  <button class="edit-button btn btn-primary">Edit</button>
  <button class="delete-button btn btn-primary">Delete</button>
  </div>
  </div>
  `
}

function addVideo(video) {
  console.log("addVideo: ");
  console.log(video);
  $.ajax({
    method: 'POST',
    url: '/api/videos',
    data: JSON.stringify(video),
    success: (data) => {
      displayVideos();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function updateVideo(video, id) {
  console.log("updateVideo: ");
  console.log(video);
  console.log("video ID: " + id);
	$.ajax({
		method: 'PUT',
		url: '/api/videos/' + id,
		data: JSON.stringify(video),
		success: (data) => {
			displayVideos();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function deleteVideo(id) {
	$.ajax({
		method: 'DELETE',
		url: '/api/videos/' + id,
		success: (data) => {
			displayVideos();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}
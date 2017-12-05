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


  $('add-subject').click(function() {
    // TODO #1: POST request to /subjects to create a note. JUst with name
  });

  $('.sidebar-subject').click(function() {
    // TODO #3: get the data-id of the subject that was clicked.
    // save the id in state.subjectId
    //  displayNotes();
  });


   displaySubjects();




  $('.new-note-button').click(() => {
    $('#note-modal').modal('show')
  });
  $('#note-save').click((event) => {
    event.preventDefault();
    var note = {};
    note.subject = "Subject"; // For now
    note.title = $('#note-title').val();
    note.content = $('#note-text').val();
    let id = $('#note-id').text();

    if (id) {
      updateNote(note, id);
    } else {
      // TODO #7 make sure notes are created with a subjectID.
      note.subjectId = this.state.subjectId
      addNote(note);
    }
    $('#note-modal').modal('hide');
  });

  $('.note-modal').on('hidden.bs.modal', function (event) {
      event.preventDefault();
      clearNoteModal();
  });

  $('.notes-display').on('click', '.edit-button', (event) => {
    event.preventDefault();
    const thisNoteId = $(event.currentTarget).parent().attr('data-id');
    let thisNote = state.notes.find(note => note.id === thisNoteId);
    $('#note-modal').modal('show');
    $('#note-text').val(thisNote.content);
    $('#note-title').val(thisNote.title);
    $('#note-id').text(thisNote.id);
  });
    $('.notes-display').on('click', '.delete-button', (event) => {
    event.preventDefault();
    const thisNoteId = $(event.currentTarget).parent().attr('data-id');
    deleteNote(thisNoteId);
  });
  	$('#note-modal').on('hidden.bs.modal', function(event) {
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

/**** END DOC READY ****/
});


/******************************** NOTES ********************************/

function clearNoteModal() {
  $('#note-text').val("");
  $('#note-title').val("");
  $('#note-id').text("");
}

function displayNotes() {
  let subjectId = state.subjectId
 // TODO #4: check this out. We now get notes belonging to a specific subject,
 // by getting that subject
 // GO to the subject routes now. Do all the api routes for subjects

 // TODO #5 when doing /api/subject/${subjectId} on the server
 // make sure you do Subject.findByID(subjectId).pupulate('notes').then...
 // adding ppopulate loads all the notes from db that belong to a subject
  $.ajax({
    method: 'GET',
    url: `/api/subject/${subjectId}`,
    success: (subject) => {
      state.notes = subject.notes;
      const notesList = data.notes.map((item, index) => renderNotes(item));
      $('.notes-display').html(notesList);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}
function displaySubjects(){
  $.ajax({
    method: 'GET',
    url: '/api/subjects',
    success: (data) => {
        // TODO #2: Show all subjects on sidebar
        // on each subject show the LIs with a data-id attribute;
        // <li class="sidebar-subject" data-id=${subjectId}>${subjectName}</li>
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

function clearVideoModal() {
  $('#video-text').val("");
  $('#video-title').val("");
  $('#video-id').text("");
}

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

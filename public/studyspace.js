const NOTES_PATH = '/api/notes';
const VIDEOS_PATH = '/api/videos';
const SUBJECTS_PATH = '/api/subjects';

let state = {
	subjectId: "",
	subjects: [],
	notes: [],
	videos: []
}

$(() => {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  /******************************** NOTES ********************************/


  $('#add-subject').click(function() {
    $('#new-subject-form').removeClass('no-display');
});
  $('#new-subject-form').submit(function(event) {
  	event.preventDefault();
  	let newSubject = $('#subject-input').val();
  	console.log("New Subject: " + newSubject);
  	addSubject(newSubject);
    $('#subject-input').val("");
    $('#new-subject-form').addClass('no-display');
});

  $('.subjects-display').on('click', '.sidebar-subject', function(event) {
    state.subjectId = $(event.currentTarget).attr('data-id');

    displayNotes();
  });


   displaySubjects();

  $('.new-note-button').click(() => {
    $('#note-modal').modal('show')
  });
  $('#note-save').click((event) => {
    event.preventDefault();
    var note = {};
    note.subject = state.subjectId;
    note.title = $('#note-title').val();
    note.content = $('#note-text').val();
    let id = $('#note-id').text();

    if (id) {
      updateNote(note, id);
    } else {
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
    console.log(thisNoteId);
    let thisNote = state.notes.find(note => note._id === thisNoteId);
    $('#note-modal').modal('show');
    $('#note-text').val(thisNote.content);
    $('#note-title').val(thisNote.title);
    $('#note-id').text(thisNote._id);
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
  let subjectId = state.subjectId;
  $.ajax({
    method: 'GET',
    url: `/api/subjects/${subjectId}`,
    success: (data) => {
      state.notes = data.subject.notes;
      const notesList = data.subject.notes.map((item, index) => renderNotes(item));
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
      state.subjects = data.subjects;
      const subjectsList = data.subjects.map((item, index) => renderSubjects(item));
      $('.subjects-display').html(subjectsList);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function renderSubjects(subject) {
  return `
  <li class="sidebar-subject" data-id=${subject.id}>${subject.name}</li>
  `
}

function addSubject(subject) {
  console.log("addSubject: ");
  console.log(subject);
  $.ajax({
    method: 'POST',
    url: '/api/subjects/',
    data: JSON.stringify({
    	name: subject 
    }),
    success: (data) => {
    	console.log("addSubject data: ");
    	console.log(data);
      displaySubjects();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function renderNotes(note) {
	console.log(note);
  return `
  <div class="col-md-3">
  <div class="note-display" data-id=${note._id}>
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

// function parseVideoLink (link) {
// var video_id = window.location.search.split('v=')[1];
// var ampersandPosition = video_id.indexOf('&');
// if(ampersandPosition != -1) {
//   video_id = video_id.substring(0, ampersandPosition);
// }
// console.log(video_id);
// return video_id;
// }

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

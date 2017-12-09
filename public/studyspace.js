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
	state.token = localStorage.getItem("token");
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  $('#logout').click((event) => {
    event.preventDefault();
    state.token = localStorage.clear();
    window.location = "/login.html";
  });

  /******************************** NOTES ********************************/


  $('#add-subject').click(function() {
    $('#new-subject-form').removeClass('no-display');
    $('#get-started').addClass('no-display');
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
    event.preventDefault();
    $('#get-started').addClass('no-display');
  	$('.sidebar-subject').removeClass('active-subject');
    $('.delete-subject').addClass('invisible');
  	$(event.currentTarget).addClass('active-subject');
    $(event.currentTarget).find('.delete-subject').removeClass('invisible');
    state.subjectId = $(event.currentTarget).attr('data-id');

    $('#notes').removeClass('no-display');
    $('#videos').removeClass('no-display');

    displayNotes();
    displayVideos();

    $('.subjects-display').on('click', '.delete-subject', (event) => {
    event.preventDefault();
    const thisSubjectName = $(event.currentTarget).parent().attr('name');
    const thisSubjectId = $(event.currentTarget).parent().attr('data-id');
    
    let confirmDelete = confirm(`Are you sure that you want to delete ${thisSubjectName}, along with all of the notes and videos for this subject?`);
    if (confirmDelete) {
    $('#notes').addClass('no-display');
    $('#videos').addClass('no-display');
    $('#get-started').removeClass('no-display');
    deleteSubject(thisSubjectId);
    displaySubjects();
    }
    // TODO Fix confirm alert - currently, asks multiple times
    // TODO Reload after subject deleted
  });

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

  $('.new-video-button').click(() => {
    $('#video-modal').modal('show')
  });
  $('#video-save').click((event) => {
    event.preventDefault();
    var video = {};
    video.subject = state.subjectId;
    video.title = $('#video-title').val();
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
    console.log("This Video ID: " + thisVideoId);
    let thisVideo = state.videos.find(video => video._id === thisVideoId);
    $('#video-modal').modal('show');
    $('#video-text').val(thisVideo.link);
    $('#video-title').val(thisVideo.title);
    $('#video-id').text(thisVideo._id);
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
    headers: {
    	Authorization: "Bearer " + state.token 
    },
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
    headers: {
    	Authorization: "Bearer " + state.token 
    },
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
  <li class="sidebar-subject" name="${subject.name}" data-id=${subject.id}>${subject.name}<i class="fa fa-times delete-subject invisible" aria-hidden="true"></i></li>
  `
}

function addSubject(subject) {
  console.log("addSubject: ");
  console.log(subject);
  $.ajax({
    method: 'POST',
    url: '/api/subjects/',
    headers: {
    	Authorization: "Bearer " + state.token
    },
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

function updateSubject(subject, id) {
  console.log("updateSubject: ");
  console.log(subject);
  console.log("subject ID: " + id);
  $.ajax({
    method: 'PUT',
    url: '/api/subjects/' + id,
    headers: {
      Authorization: "Bearer " + state.token 
    },
    data: JSON.stringify({
      name: subject 
    }),
    success: (data) => {
      displaySubjects();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function deleteSubject(id) {
  $.ajax({
    method: 'DELETE',
    url: '/api/subjects/' + id,
    headers: {
      Authorization: "Bearer " + state.token 
    },
    success: (data) => {
      displaySubjects();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function renderNotes(note) {
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
    headers: {
    	Authorization: "Bearer " + state.token
    },
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
    headers: {
      Authorization: "Bearer " + state.token 
    },
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
    headers: {
      Authorization: "Bearer " + state.token 
    },
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
  let subjectId = state.subjectId;
  $.ajax({
    method: 'GET',
    url: `/api/subjects/${subjectId}`,
    headers: {
    	Authorization: "Bearer " + state.token 
    },
    success: (data) => {
    	console.log(data);
      state.videos = data.subject.videos;
      const videosList = data.subject.videos.map((item, index) => renderVideos(item));
      $('.videos-display').html(videosList);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function renderVideos(video) {
  let embedVideo;
  let link = video.link;

  if ((link.indexOf('vimeo')) != -1) {
    embedVideo = link.split('.com/')[1];
      return `
      <div class="col-md-3">
      <div class="video-display" data-id=${video._id}>
      <iframe width="100%" height="100%" src="https://player.vimeo.com/video/${embedVideo}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
      <h4>${video.title}</h4>
      <button class="edit-button btn btn-primary">Edit</button>
      <button class="delete-button btn btn-primary">Delete</button>
      </div>
      </div>
      `
  } else {
    embedVideo = link.split('v=')[1];
      return `
      <div class="col-md-3">
      <div class="video-display" data-id=${video._id}>
      <iframe width="100%" src="https://www.youtube.com/embed/${embedVideo}" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
      <h4>${video.title}</h4>
      <button class="edit-button btn btn-primary">Edit</button>
      <button class="delete-button btn btn-primary">Delete</button>
      </div>
      </div>
      `
  }
}

function addVideo(video) {
  console.log("addVideo: ");
  console.log(video);
  $.ajax({
    method: 'POST',
    url: '/api/videos',
    headers: {
    	Authorization: "Bearer " + state.token
    },
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
    headers: {
      Authorization: "Bearer " + state.token 
    },
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
    headers: {
      Authorization: "Bearer " + state.token 
    },
		success: (data) => {
			displayVideos();
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

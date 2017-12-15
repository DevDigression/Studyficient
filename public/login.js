$(() => {
	// const token =localStorage.getItem('token');
	// if (token) {
	// 	window.location = "/studyspace.html";
	// }
	$('#login-form').submit((event) =>{
		event.preventDefault();
		let userData = {
			username: $('#login-username').val(),
			password: $('#login-password').val()
		};
		login(userData);
	});

	$('#demo-btn').click((event) =>{
		let userData = {
			username: "studydemo",
			password: "study123"
		};
		login(userData);
	});
});


function login(userData) {
	$.ajax({
		url: '/api/auth/login',
		type: 'POST',
		data: JSON.stringify(userData),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data){
			console.log(data.authToken);
			console.log("Success!");
			localStorage.setItem('token', data.authToken);
			window.location = '/studyspace.html';
		},
		error: function(errorData){
			$("#error-message").html(`***** Invalid username or password *****`)
		},
	});
}

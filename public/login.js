$(() => {
	$('#login-form').submit((event) =>{
		event.preventDefault();
		let userData = {
			username: $('#login-username').val(),
			password: $('#login-password').val()
		};
		login (userData)
	});

	$('#demo-btn').click((event) =>{
		let userData = {
			username: "test",
			password: "test12345"
		};
		login (userData)
	});

});


function login (userData){


	$.ajax({
		url: `/api/auth/login`,
		type: "POST",
		data: JSON.stringify(userData),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			// data.authToken;
			console.log("Success!");
			localStorage.setItem("token", data.authToken);
			window.location = "/studyspace.html";
		},
		error: function(errorData){
			 $("#error-message").text("Invalid username or password")
			// $("#error-message").text("Error: " + errorData.responseText)
		},
	});
}

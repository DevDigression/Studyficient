$(() => {
	$('#login-form').submit((event) =>{
		event.preventDefault();

		let userData = {
			username: $('#login-username').val(),
			password: $('#login-password').val()
		};

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
	        // do error stuff
	        },
	    });

	});
});
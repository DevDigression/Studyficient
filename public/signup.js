$(() => {
	$('#signup-form').submit((event) =>{
		event.preventDefault();

		let userData = {
			username: $('#signup-username').val(),
			password: $('#signup-password').val()
		};
		signup(userData);
	});
});

function signup(userData) {
	    $.ajax({
	        url: '/api/users',
	        type: 'POST',
	        data: JSON.stringify(userData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        success: function(data){
	            // data.authToken;
	            console.log("Success!");
	            localStorage.setItem('token', data.authToken);
	            window.location = '/login.html';
	        },
	        error: function(errorData){
	       		$('#error-message').html(`${errorData.responseJSON.reason}: ${errorData.responseJSON.message}`);
	        console.log(errorData);
	        },
	    });
}
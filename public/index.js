$(() => {
	$('#navbar').on('click', '#logout', (event) => {
    event.preventDefault();
    localStorage.clear();
    window.location = "/index.html";
  });


	const token = localStorage.getItem('token');

	if (token) {
		$('#navbar').html(
		`<li><a href="/studyspace.html">Studyspace</a></li>
		<li><a href="" id="logout">Logout</a></li>
		`
		);
	} else {
		$('#navbar').html(
		`<li><a href="/login.html">Login</a></li>
		<li><a href="/signup.html">Signup</a></li>`
		);
	}
});
var authenticationPath = "faces/jsp/login.jsp"

function doLogin() {
	// Set authentication information
	server = $("#server").val()
	if (server.charAt(server.length-1) != '/') {
		server = server + "/"
	}
	
	username = $("#username").val()
	password = $("#password").val()
			
	// Save the server URL
	var serverBytes = new air.ByteArray()
	serverBytes.writeUTFBytes(server)
	air.EncryptedLocalStore.setItem("server", serverBytes)
	
	// If the "Remember Me" checkbox is checked, save the authentication information
	if ($("#rememberPassword").val() == "on") {
		var usernameBytes = new air.ByteArray()
		usernameBytes.writeUTFBytes(username)
		air.EncryptedLocalStore.setItem("username", usernameBytes)
	
		var passwordBytes = new air.ByteArray()
		passwordBytes.writeUTFBytes(password)
		air.EncryptedLocalStore.setItem("password", passwordBytes)
		
		var rememberMeBytes = new air.ByteArray()
		rememberMeBytes.writeUTFBytes("yes")
		air.EncryptedLocalStore.setItem("rememberPassword", rememberMeBytes)
	} else { // Otherwise wipe them
		air.EncryptedLocalStore.removeItem("username")
		air.EncryptedLocalStore.removeItem("password")
		air.EncryptedLocalStore.removeItem("rememberPassword")
	}
	
	if (username == "" || password == "") {
		return
	} else {
		$.get(server + authenticationPath, didGetLoginPage)
	}

	return false
}

function didGetLoginPage(data) {
	// Parse page
	var state = data.split('id="javax.faces.ViewState" value="')[1].split('"')[0]
	var fields = {"javax.faces.ViewState": state,
				  "loginForm_SUBMIT": "1",
				  "loginForm:_idcl": "",
				  "loginForm:_link_hidden_": "",
				  "loginForm:user-name": username,
				  "loginForm:user-password": password,
				  "loginForm:language": "en_US",
				  "loginForm:submit": "Login"}
	$.post(server + authenticationPath, fields, didPostLoginForm)
}

function didPostLoginForm(data) {
	$("#docasu-frame").attr("src", server + "wcs/docasu/ui")
	$("#background").fadeOut(500);
}
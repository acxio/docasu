var server = ""
var username = ""
var password = ""

$(function() {
	var serverStoredValue = air.EncryptedLocalStore.getItem("server")
	if (serverStoredValue != null) {
		server = serverStoredValue.toString()
		$("#server").val(server)
	}
	
	var usernameStoredValue = air.EncryptedLocalStore.getItem("username") 
	if (usernameStoredValue != null) {
		username = usernameStoredValue.toString()
		$("#username").val(username)
	}
	
	var passwordStoredValue = air.EncryptedLocalStore.getItem("password")
	if (passwordStoredValue != null) {
		password = passwordStoredValue.toString()
		$("#password").val(password)
	}
	
	var rememberMeStoredValue = air.EncryptedLocalStore.getItem("rememberPassword")
	if (rememberMeStoredValue != null) {
		$("#rememberPassword").attr("checked",true)
	}

	$("#login-form").submit(doLogin)
	
	// Register the drop event on the htmlLoader.
	// We must add the event listener in the application sandbox because
	// that's the only way we can get the file's data.
	// Adding the event listener in the docasu sandbox wouldn't allow us
	// to access the data of the dropped files (because of security reasons). 
	window.htmlLoader.addEventListener("nativeDragDrop", filesDropped); 
})
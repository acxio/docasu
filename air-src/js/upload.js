// The url of the webscript for uploading the file
var uploadUrlPath =  "wcs/docasu/ui/node/content/upload/";

// The url of the webscript for replacing the content of a file
var replaceUrlPath = "wcs/docasu/ui/node/content/update/";

// The url of the webscript to check the permissions of a given folder
var permissionsUrlPath = "wcs/docasu/ui/folder/permissions/";

// The url of the webscript to check if some given files already
// exist in the given folder id
var filesexistUrlPath = "wcs/docasu/ui/node/content/filesexist/";

// The array that holds the results of the upload.
// The structure of an entry is the following:
// {
//		fileName: nameOfTheFile
//		success: true | false
// }
var uploadReport;

// The array that holds the files to upload.
// The structure of an entry is the following:
// {
//		file: adobeAirFile
//		fileName: nameOfTheFile (unescaped)
//		nodeID: null | nodeID
//		action: value
// }
// "value" can either be:
//		- null (The file will be uploaded normally)
//		- "replace" (The content of the file will be replaced)
//		- "skip" (The file won't be uploaded)
// The nodeID is used when replacing the content of a file; in the normal upload process
// we don't need it.
var filesToUpload = [];

// The array that holds the duplicates' file names
var existingFileNames = [];

// Function called when the user drops something in the docasu frame
function filesDropped(event){
	// Check if the files were dropped on the folder view
	if (filesDroppedOnFolderView) {
		// Reset the variable
		filesDroppedOnFolderView = false;
		
		// Get the array containing the file URLs of the dropped files
       	filesToUpload = event.clipboard.getData(air.ClipboardFormats.FILE_LIST_FORMAT);
       	
       	// If the list isn't empty (i.e. the user dropped files)
       	if (filesToUpload) {
       		air.trace("");
       		// Convert the filesToUpload array to the right structure
       		filesToUpload = $.map(filesToUpload, function(fileToUpload) {
       			return {
       				file: fileToUpload,
       				fileName: unescape(extractFileName(fileToUpload.url)),
       				nodeID: null, // can be null | nodeID
       				action: null // can be null | "replace" | "skip"
       			};
       		});
       		
       		// Check if we have the permission to upload files in the current folder
       		checkPermissions();
		} else {
			// The user dropped something that's not a file.
		}
	}
}

// Check if we have the permission to upload files in the current folder
function checkPermissions() {
	// AJAX call
	$.get(server + permissionsUrlPath + childBridge.getCurrentFolder(), checkPermissionsCallback);
}

function checkPermissionsCallback(data) {
	// Evaluate the result
	var json = eval("(" + data + ")");

	var rows = json.rows;
	var canUpload = false;
	for (var i = 0; i < rows.length && !canUpload; i++) {
		if (rows[i].code == "uploadFile") {
			canUpload = true;
		}
	}
	
	// If we're allowed to upload files
	if (canUpload) {
		// Check if, in the current folder, there are files with the same name
		// as the ones that we're going to upload
		checkDuplicates();
	} else {
		// Abort the upload process and show the error dialog
		childBridge.showError("You don't have permission to upload files in this folder.");
	}
}

// Check if ,in the current folder, there are files with the same name
// as the ones that we're going to upload
function checkDuplicates() {
	// Extract the file names from the filesToUpload array
	var fileNames = $.map(filesToUpload, function(fileToUpload) {
		return fileToUpload.fileName;
	});
	
	// We are gonna ask the server if there are duplicates.
	// Prepare the arguments for the AJAX call
	var args = {
		"fileNames": $.toJSON({"fileNames": fileNames})
	};
	
	// AJAX call
	$.post(server + filesexistUrlPath + childBridge.getCurrentFolder(), args, checkDuplicatesCallback);
}

// Function called when the server answers with the list of already-existing files
// in the current folder
function checkDuplicatesCallback(data) {
	// Evaluate the result
	var json = eval("(" + data + ")");
	
	if (!json.success) {
		childBridge.showError(json.msg);
	}

	// Unescape the file names
	existingFileNames = $.map(json.existingFileNames, function(existingFileName) {
		return {
			fileName: unescape(existingFileName.fileName),
			nodeID: existingFileName.nodeID
		};
	});
	
	// Process the next already-existing file name
	processNextExistingFileName();
}

function processNextExistingFileName() {
	if (existingFileNames.length != 0) { // If there are duplicates
		// Ask the user what he'd like to do with the duplicate
		childBridge.showDuplicateDialog(existingFileNames.pop());
	} else { // If there aren't duplicates
		// Initialize the upload report
		uploadReport = [];
		
		childBridge.showLoadingMask("Uploading files...");
		
		// Start the upload
		uploadNextFile();
	}
}

function showDuplicateDialogCallback(file, answer, applyToAll) {
	// file = the file
	// answer = "cancel" | "replace" | "skip"
	// applyToAll = true | false
	
	if (answer == "cancel") {
		// Abort the upload session
		return;
	}
	
	// Look for the file in the filesToUpload array
	// and update the nodeID and the action that will be performed on the file.
	for (var i = 0; i < filesToUpload.length; i++) {
		if (filesToUpload[i].fileName == file.fileName) {
			filesToUpload[i].nodeID = file.nodeID;
			filesToUpload[i].action = answer;
		}
	}
	
	if (applyToAll) {
		// Apply the same action to any other duplicate.
		for (var i = 0; i < existingFileNames.length; i++) {
			for (var j = 0; j < filesToUpload.length; j++) {
				if (filesToUpload[j].fileName == existingFileNames[i].fileName) {
					filesToUpload[j].nodeID = existingFileNames[i].nodeID;
					filesToUpload[j].action = answer;
				}
			}
		}
		// We now know what to do with every file.
		// No need to ask the user again.
		// Let's start the upload process
		uploadNextFile();
	} else {
		// Let's see if there are other duplicates and, in that case,
		// ask the user again
		processNextExistingFileName();
	}
}

function uploadNextFile() {
	if (filesToUpload.length == 0) {
		childBridge.hideLoadingMask();

	
		childBridge.fireAfterUpdateEvent();
		
		childBridge.showUploadDialog(uploadReport);
		
		return;
	}
	
	var action = filesToUpload[filesToUpload.length - 1].action;
	
	if (action == null) { // If there are no duplicates
		uploadFile();
	} else if (action == "replace") { // If the user wants the file to be replaced
		replaceFile();
	} else if (action == "skip") { // If the user doesn't want to replace the file
		// Remove the file from the array and go on with the upload
		filesToUpload.pop();
		uploadNextFile();
	} else {
		air.trace("Error: function uploadNextFile() in upload.js: unkown action.");
	}
}

function uploadFile() {
	var fileToUploadEntry = filesToUpload.pop();
	
	air.trace("Uploading file " + fileToUploadEntry.fileName);
	
	var fileToUpload = fileToUploadEntry.file;
	
/* JAVASCRIPT VERSION TO UPLOAD FILES (NOT WORKING WITH BINARY FILES)
	
//	var uploadUrl = server + uploadUrlPath + childBridge.getCurrentFolder();
	var uploadUrl = "http://localhost:8081/alfresco/" + uploadUrlPath + childBridge.getCurrentFolder();
	var boundary = "----------ae0cH2ei4Ef1LDKgL6ei4ae0GI3ei4";

	var client = new XMLHttpRequest();
	client.onreadystatechange = function() {
		if (client.readyState == 4) {
			air.trace(client.responseText);
		}
	}
	client.open("POST", uploadUrl);
	client.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
	
	
	var fileStream = new air.FileStream();
	fileStream.open(fileToUpload, air.FileMode.READ);
	var fileContents = new air.ByteArray();
	fileStream.readBytes(fileContents, 0, fileToUpload.size);
	fileStream.close();
	
	var buffer = ""
	buffer += ("--" + boundary + "\r\n");
	buffer += ("Content-Disposition: form-data; name=\"Filename\"\r\n");
	buffer += ("\r\n");
	
	buffer += (fileToUpload.name + "\r\n");
	buffer += ("--" + boundary + "\r\n");
	buffer += ("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileToUpload.name + "\"\r\n");
	buffer += ("Content-Type: application/octet-stream\r\n");
	buffer += ("\r\n");
	
	buffer += fileContents.toString();
	
	buffer += ("\r\n--" + boundary + "\r\n");
	buffer += ("Content-Disposition: form-data; name=\"Upload\"\r\n");
	buffer += ("\r\n");
	buffer += ("Submit Query\r\n");
	buffer += ("--" + boundary + "--");

	client.send(buffer.toString());
	
*/
		
/* MANUAL VERSION FOR UPLOADING FILES
	var uploadUrl = server + uploadUrlPath + childBridge.getCurrentFolder();
//	var uploadUrl = "http://localhost:8081/alfresco/" + uploadUrlPath + childBridge.getCurrentFolder();
	var boundary = "----------ae0cH2ei4Ef1LDKgL6ei4ae0GI3ei4";
	
	var urlRequest = new air.URLRequest(uploadUrl);
	urlRequest.useCache = false;
	urlRequest.cacheResponse = false;
	urlRequest.contentType = "multipart/form-data; boundary=" + boundary;
	urlRequest.method = "POST";
	
	var fileStream = new air.FileStream();
	fileStream.open(fileToUpload, air.FileMode.READ);
	var fileContents = new air.ByteArray();
	fileStream.readBytes(fileContents, 0, fileToUpload.size);
	fileStream.close();
	
	var buffer = new air.ByteArray();
	buffer.writeUTFBytes("--" + boundary + "\r\n");
	buffer.writeUTFBytes("Content-Disposition: form-data; name=\"Filename\"\r\n");
	buffer.writeUTFBytes("\r\n");
	
	buffer.writeUTFBytes(fileToUpload.name + "\r\n");
	buffer.writeUTFBytes("--" + boundary + "\r\n");
	buffer.writeUTFBytes("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileToUpload.name + "\"\r\n");
	buffer.writeUTFBytes("Content-Type: application/octet-stream\r\n");
	buffer.writeUTFBytes("\r\n");
	
	buffer.writeBytes(fileContents, 0, fileContents.length);
	
	buffer.writeUTFBytes("\r\n--" + boundary + "\r\n");
	buffer.writeUTFBytes("Content-Disposition: form-data; name=\"Upload\"\r\n");
	buffer.writeUTFBytes("\r\n");
	buffer.writeUTFBytes("Submit Query\r\n");
	buffer.writeUTFBytes("--" + boundary + "--");
	
	urlRequest.data = buffer;
	
	var loader = new air.URLLoader();
	
	loader.addEventListener(air.IOErrorEvent.IO_ERROR , function (event){
		air.trace(event.text);
	});
	
	loader.addEventListener(air.DataEvent.UPLOAD_COMPLETE_DATA , function (event){
	air.trace("yes");
		air.trace(event.text);
	});
	
	loader.addEventListener(air.Event.COMPLETE, function(event) {
		air.trace(event.target.data);
	});
	
	loader.load(urlRequest);
*/
	
	fileToUpload.addEventListener(air.DataEvent.UPLOAD_COMPLETE_DATA, function(event) {
		var json = eval("(" + event.data + ")");
		
		var uploadReportEntry = {
			fileName: unescape(extractFileName(event.target.url)),
			success: true,
			msg: json.msg
		};
		
		air.trace("Upload complete.");
		air.trace("Uploaded file name: " + unescape(uploadReportEntry.fileName));
/*
		air.trace("Success: " + (uploadReportEntry.success ? "true" : "false"));
		air.trace("Msg: " + uploadReportEntry.msg);
*/
		air.trace("");
		
		uploadReport.push(uploadReportEntry);
		
		uploadNextFile();
	});
	
	fileToUpload.addEventListener(air.IOErrorEvent.IO_ERROR , function (event){
		var uploadReportEntry = {
			fileName: unescape(extractFileName(event.target.url)),
			success: false,
			msg: "File wasn't uploaded successfully."
		};
		
		air.trace("Upload failed.");
		air.trace("Uploaded file name: " + unescape(uploadReportEntry.fileName));
/*
		air.trace("Success: " + (uploadReportEntry.success ? "true" : "false"));
		air.trace("Msg: " + uploadReportEntry.msg);
*/
		air.trace("");
		
		uploadReport.push(uploadReportEntry);
		
		uploadNextFile();              
	});
	
	var uploadUrl = server + uploadUrlPath + childBridge.getCurrentFolder();
	//var uploadUrl = "http://localhost:8081/alfresco/" + uploadUrlPath + childBridge.getCurrentFolder();
 		
	var urlRequest = new air.URLRequest(uploadUrl);
	urlRequest.method = "POST";
	
	fileToUpload.upload(urlRequest, "file", false);
}

function replaceFile() {
	var fileToReplaceEntry = filesToUpload.pop();
	
	air.trace("Replacing file " + fileToReplaceEntry.fileName);
	
	var fileToReplace = fileToReplaceEntry.file;
	fileToReplace.addEventListener(air.DataEvent.UPLOAD_COMPLETE_DATA, function(event) {
		var json = eval("(" + event.data + ")");	
		
		var uploadReportEntry = {
			fileName: unescape(extractFileName(event.target.url)),
			success: true,
			msg: json.msg
		};
		
		air.trace("Upload complete.");
		air.trace("Uploaded file name: " + unescape(uploadReportEntry.fileName));
/*
		air.trace("Success: " + (uploadReportEntry.success ? "true" : "false"));
		air.trace("Msg: " + uploadReportEntry.msg);
*/
		air.trace("");
		
		uploadReport.push(uploadReportEntry);
	
		uploadNextFile();
	});
	
	fileToReplace.addEventListener(air.IOErrorEvent.IO_ERROR , function (event){
		var uploadReportEntry = {
			fileName: unescape(extractFileName(event.target.url)),
			success: false,
			msg: "File wasn't uploaded successfully."
		};
		
		air.trace("Upload failed.");
		air.trace("Uploaded file name: " + unescape(uploadReportEntry.fileName));
/*
		air.trace("Success: " + (uploadReportEntry.success ? "true" : "false"));
		air.trace("Msg: " + uploadReportEntry.msg);
*/
		air.trace("");
		
		uploadReport.push(uploadReportEntry);
		
		uploadNextFile();              
	});
	
	var replaceUrl = server + replaceUrlPath + fileToReplaceEntry.nodeID;
	
	var urlRequest = new air.URLRequest(replaceUrl);
	urlRequest.method = "POST";
	
	fileToReplace.upload(urlRequest, "file", false);
}

// Utility function to extract the last url component from a filePath
function extractFileName(filePath) {
	var fileName = filePath;
	
	var position = fileName.lastIndexOf("/"); // Unix
	if (position != -1) {
		fileName = fileName.substr(position + 1);
	}
	position = fileName.lastIndexOf("\\"); // Windows
	if (position != -1) {
		fileName = fileName.substr(position + 1);
	}
	
	return fileName;
}
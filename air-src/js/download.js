var downloadUrl;
var file;

function downloadFile(url) {
	var s = server.split('/')[2];
	downloadUrl = "http://" + s + url;
	
	var file = new air.File(); 
	file.addEventListener(air.Event.SELECT, dirSelected); 
	file.browseForDirectory("Select a download location"); 
}

function dirSelected(event) {
	var fileName = unescape(extractFileName(downloadUrl));
	
   	file = event.target.resolvePath(fileName);
   	if (file.exists) {
   		childBridge.showDownloadDuplicateDialog(fileName);
   		return;
   	}
   	
   	download();
}

function showDownloadDuplicateDialogCallback(answer) {
	if (answer == "replace") {
		download();
	} else if (answer == "cancel") {
		// Do nothing
		return;
	}
}

function download() {
	childBridge.showLoadingMask("Downloading file...");
   	var fileStream = new air.FileStream(); 
	
	var stream = new air.URLStream();
	var request = new air.URLRequest(downloadUrl);
	
	stream.addEventListener(air.Event.COMPLETE, function() {
		fileStream.close();
		childBridge.hideLoadingMask();
	});
	
	stream.addEventListener(air.IOErrorEvent.IO_ERROR, function() {
		fileStream.close();
		childBridge.hideLoadingMask();
		childBridge.showError("Download failed.");
	});
	
	stream.addEventListener(air.Event.OPEN, function() {
		fileStream.open(file, air.FileMode.WRITE);
	});
	
	stream.addEventListener(air.ProgressEvent.PROGRESS, function() {
		var fileData = new air.ByteArray();
		stream.readBytes(fileData, 0, stream.bytesAvailable);
		fileStream.writeBytes(fileData, 0, fileData.length);
	});

	try {
		stream.load(request);
	} catch (error) {
		air.trace("Unable to load requested URL.");
	}
}
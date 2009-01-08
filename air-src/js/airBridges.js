var parentBridge = {
	establishChildBridge: establishChildBridge,
	setFilesDroppedOnFolderView: setFilesDroppedOnFolderView,
	showDuplicateDialogCallback: showDuplicateDialogCallback,
	showDownloadDuplicateDialogCallback: showDownloadDuplicateDialogCallback,
	downloadFile: downloadFile,
	extractFileName: extractFileName,
	exit: exit
};
var childBridge;
var filesDroppedOnFolderView = false;

function establishParentBridge() {
	// Set the parent bridge
    document.getElementById("docasu-frame").contentWindow.parentSandboxBridge = parentBridge;
}

function establishChildBridge() {	
    // Get the child bridge
    childBridge = document.getElementById('docasu-frame').contentWindow.childSandboxBridge;
}

function setFilesDroppedOnFolderView() {
	filesDroppedOnFolderView = true;
}

function exit() {
	air.NativeApplication.nativeApplication.exit(0);
}
/*
 *    Copyright (C) 2008 Optaros, Inc. All rights reserved.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program. If not, see <http://www.gnu.org/licenses/>.
 *    
 */

// POST parameters
var folderId = url.extension;

var newFolderName = args.folderName;

// default to company home
if (folderId == null || typeof(folderId) == 'undefined') {
	folderId = companyhome.id;
}

// search for node
var folder = search.findNode("workspace://SpacesStore/" + folderId);
if(folder != null) {
	// get name property
	var nodeName = folder.properties.name;
	
	// make sure is folder
	if(folder.isContainer) {
		if (folder.hasPermission("CreateChildren")) {
			newFolder = folder.createFolder(newFolderName);
			
			model.success = true;
			model.msg = "Folder " + newFolderName + " was created";
			logger.log("Folder " + newFolderName + " was created");
		} else {
			status.code = 400;
			status.message = "You do not have permission to create folder";
			status.redirect = true;
			logger.log("User does not have permission to create folder");
		}
	} else {
		status.code = 400;
		status.message = "Node " + nodeName + " is not a folder";
		status.redirect = true;
		logger.log("Folder " + nodeName + " is not a folder");
	}
} else {
	status.code = 400;
	status.message = "Invalid node reference " + folderId;
	status.redirect = true;
	logger.log("Invalid node reference " + folderId);
}

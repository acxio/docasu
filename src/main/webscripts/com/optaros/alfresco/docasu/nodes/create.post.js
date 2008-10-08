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

var fileName = null;
var contentToWrite = null;
var contentType = null;

for each (field in formdata.fields) {
	if (field.name == "filename") {
	    fileName = field.value;
	} else if (field.name == "content") {
		  contentToWrite = field.value;
	} else if (field.name == "contentType") {
		contentType = field.value;
	}
}

// search for folder
var folderToWriteIn = search.findNode("workspace://SpacesStore/" + folderId);
if(folderToWriteIn != null) {
	// search for already existing file
	var file = folderToWriteIn.childByNamePath(fileName);
	if(file == null) {
		// check for create content permission
		if (folderToWriteIn.hasPermission("CreateChildren")) {
			// create the new document
		    file = folderToWriteIn.createFile(fileName);
			file.content = contentToWrite;
			if ('HTML' == contentType) {
				file.properties.content.mimetype = 'text/html';
			} else {
				file.properties.content.mimetype = 'text/plain';
			}
			/* manually add titled aspect in order to fix issue with working-copy */
			var scAspectQName = "{http://www.alfresco.org/model/content/1.0}titled";
			var addAspect = actions.create("add-features");
	        addAspect.parameters["aspect-name"] = scAspectQName;
			addAspect.execute(file);
			file.save();
			
			model.success = true;
			model.msg = "Document " + fileName + " created";
			logger.log("Document " + fileName + " created");
		} else {
			status.code = 400;
			status.message = "You do not have permission to create new content";
			status.redirect = true;
			logger.log("User does not have permission to create new content");
		}
	} else {
		status.code = 400;
		status.message = "File " + fileName + " already exists";
		status.redirect = true;
		logger.log("File " + fileName + " already exists");
	}
} else {
	status.code = 400;
	status.message = "Invalid node reference " + folderId;
	status.redirect = true;
	logger.log("Invalid node reference " + folderId);
}
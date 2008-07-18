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

var fileName = null;
var contentToWrite = null;
var folderId = null;
var contentType = null;

// locate file attributes
for each (field in formdata.fields)
{
logger.log("Name: " + field.name + " ; Value: " + field.value);
  if (field.name == "filename") {
      fileName = field.value;
  } else if (field.name == "content") {
  	  contentToWrite = field.value;
  } else if (field.name == "folderId") {
	  folderId = field.value;
  } else if (field.name == "contentType") {
  	contentType = field.value;
  }
}

// find the listing folder - create if not already exists
var folderToWriteIn = search.findNode("workspace://SpacesStore/" + folderId );

// find if the new file already exist - create if not
var file = folderToWriteIn.childByNamePath(fileName);

if (folderToWriteIn.hasPermission("CreateChildren")) {
	if (file == null) {
		// create the file with the content
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
		
		model.msg = "ok";
		model.success = true;
		logger.log("file create");
	} else {
	    model.msg = "exist";
	    model.success = false;
	    logger.log("file already exist");
	}
} else {
	model.msg = "privileges";
	model.success = false;
	logger.log("user didn't have privileges");
}
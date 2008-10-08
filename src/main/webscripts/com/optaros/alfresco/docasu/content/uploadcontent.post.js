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

var filename = null;
var filecontent = null;

for each (field in formdata.fields) {
  if (field.isFile) {
    filename = field.filename;
    filecontent = field.content;
  }
}

// ensure mandatory file attributes have been located
if (folderId != null && filename != null && filecontent != null) {
	// search for node
	var folder = search.findNode("workspace://SpacesStore/" + folderId);
	if (folder != null && folder.isContainer) {
		// extract file name
		var t = filename.lastIndexOf("\\");
		if (t != -1) {
			filename = filename.substr(t + 1);
		}
		// create file and set properties
		var upload = folder.createFile(filename);
		upload.properties.title = filename;
		upload.properties.content.write(filecontent);
		/* serviceRegistry is exposed as a JavaScript extension - @see docasu-context.xml */
		upload.mimetype = serviceRegistry.getMimetypeService().guessMimetype(filename);
		upload.save();
		/* manually execute metadata extractor */
		var metadataExtracter = actions.create("extract-metadata");
		metadataExtracter.execute(upload);
		/* manually add titled aspect in order to fix issue with working-copy */
		var scAspectQName = "{http://www.alfresco.org/model/content/1.0}titled";
		var addAspect = actions.create("add-features");
        addAspect.parameters["aspect-name"] = scAspectQName;
		addAspect.execute(upload);
	
		model.success = true;
		model.msg = "File was uploaded successfully";
		logger.log("File was uploaded successfully");
	} else {
		status.code = 400;
		status.message = "Invalid folder reference " + folderId;
		status.redirect = true;
		logger.log("Invalid folder reference " + folderId);
	}
} else {
	status.code = 400;
	status.message = "Invalid upload parameters";
	status.redirect = true;
	logger.log("Invalid upload parameters");
}

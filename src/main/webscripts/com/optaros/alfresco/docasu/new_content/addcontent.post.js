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

var foldernode = url.extension;

var filename = null;
var filecontent = null;

// locate file attributes
for each (field in formdata.fields) {
  if (field.isFile) {
    filename = field.filename;
    filecontent = field.content;
  }
}

// ensure mandatory file attributes have been located
if (filename == undefined || filecontent == undefined)
{
	model.success = false;
	model.msg = "Uploaded file cannot be located in request";
}

var folder = search.findNode("workspace://SpacesStore/" + foldernode);
if (folder == null || !folder.isContainer)
{
   	model.success = false;
	model.msg = "Folder " + foldernode + " not found.";
} else { 
	
	var t = filename.lastIndexOf("\\");
	if (t != -1) {
		filename = filename.substr(t + 1);
	}
	
	try {
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
		model.msg = 'File uploaded successfully';
	} catch(e) {
		model.success = false;
		logger.log(e.message);
		if (e.message.indexOf('FileExistsException') != -1) {
			model.msg = 'File already exists';
		} else {
			model.msg = 'An internal error occurred';
		}
	}
}
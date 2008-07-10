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

var filename = null;
var filecontent = null;
var foldernode = null;

// locate file attributes
for each (field in formdata.fields)
{
  if (field.name == "file" && field.isFile)
  {
    filename = field.filename;
    filecontent = field.content;
  } else if (field.name == "folder") {
  	foldernode = field.value;
  }
}

// ensure mandatory file attributes have been located
if (filename == undefined || filecontent == undefined)
{
  status.code = 400;
  status.message = "Uploaded file cannot be located in request";
  status.redirect = true;
}

var folder = search.findNode("workspace://SpacesStore/" + foldernode);
if (folder == null || !folder.isContainer)
{
	status.code = 404;
   	status.message = "Folder " + foldernode + " not found.";
   	status.redirect = true;
} else { 
	
	var t = filename.lastIndexOf("\\");
	if (t != -1) {
		filename = filename.substr(t + 1);
	}
	
	try {
		var upload = folder.createFile(filename);
		upload.properties.content.write(filecontent);
		upload.save();
		
		/* manually add titled aspect in order to fix issue with working-copy */
		var scAspectQName = "{http://www.alfresco.org/model/content/1.0}titled";
		var addAspect = actions.create("add-features");
        addAspect.parameters["aspect-name"] = scAspectQName;
		addAspect.execute(upload);
	
		model.msg = 'ok';
	} catch(e) {
		logger.log(e.message);
		if (e.message.indexOf('FileExistsException') != -1) {
			model.msg = 'duplicate';
		} else {
			model.msg = 'generror';
		}
	}
}
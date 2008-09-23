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

var nodeId = null;
var filecontent = null;

// locate file attributes
for each (field in formdata.fields) {
  if (field.isFile) {
    filecontent = field.content;
  } else if (field.name == "path") {
  	nodeId = field.value;
  }
}

// ensure mandatory file attributes have been located
if (nodeId == undefined || filecontent == undefined)
{
	model.success = false;
	model.msg = "Uploaded file cannot be located in request";
}

var node = search.findNode("workspace://SpacesStore/" + nodeId);
if (node == null)
{
   	model.success = false;
	model.msg = "File " + nodeId + " not found.";
} else { 
	
	try {
		node.properties.content.write(filecontent);
		node.save();
	
		model.success = true;
		model.msg = 'File updated successfully';
	} catch(e) {
		model.success = false;
		logger.log(e.message);
		model.msg = 'An internal error occurred';
	}
}
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
for each (field in formdata.fields)
{
  if (field.name == "file" && field.isFile)
  {
    filecontent = field.content;
  } else if (field.name == "nodeId") {
  	nodeId = field.value;
  }
}

// ensure mandatory file attributes have been located
if (nodeId == undefined || filecontent == undefined)
{
  status.code = 400;
  status.message = "Uploaded file cannot be located in request";
  status.redirect = true;
}

var node = search.findNode("workspace://SpacesStore/" + nodeId);
if (node == null)
{
	status.code = 404;
   	status.message = "Node " + nodeId + " not found.";
   	status.redirect = true;
} else { 
	
	try {
		node.properties.content.write(filecontent);
		node.save();
	
		model.msg = 'ok';
	} catch(e) {
		logger.log(e.message);
		model.msg = 'generror';
	}
}
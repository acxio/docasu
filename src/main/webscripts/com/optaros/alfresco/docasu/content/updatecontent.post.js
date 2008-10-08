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
var nodeId = url.extension;

var filecontent = null;

for each (field in formdata.fields) {
	if (field.isFile) {
		filecontent = field.content;
	}
}

// ensure mandatory file attributes have been located
if (nodeId != null && filecontent != null) {
	// search for node
	var node = search.findNode("workspace://SpacesStore/" + nodeId);
	if (node != null) {
		node.properties.content.write(filecontent);
		node.save();
		
		model.success = true;
		model.msg = "File was updated successfully";
		logger.log("File was updated successfully");
	} else {
		status.code = 400;
		status.message = "Invalid node reference " + nodeId;
		status.redirect = true;
		logger.log("Invalid node reference " + nodeId);
	}
} else {
	status.code = 400;
	status.message = "Invalid upload parameters";
	status.redirect = true;
	logger.log("Invalid upload parameters");
}
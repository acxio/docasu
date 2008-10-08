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

// PUT parameters
var nodeId = url.extension;

var newName = args.newName;

// search for node
var contentToRename = search.findNode("workspace://SpacesStore/" + nodeId);
if(contentToRename != null) {
	if (contentToRename.hasPermission("Write")) {
		// get name property before renaming
		var nodeName = contentToRename.properties.name;
		contentToRename.name = newName;
		
		model.success = true;
		model.msg = "Node " + nodeName + " was renamed to " + newName;
		logger.log("Node " + nodeName + " was renamed to " + newName);
	} else {
		status.code = 400;
		status.message = "You do not have permission to rename node";
		status.redirect = true;
		logger.log("User does not have permission to rename node");
	}
} else {
	status.code = 400;
	status.message = "Invalid node reference " + nodeId;
	status.redirect = true;
	logger.log("Invalid node reference " + nodeId);
}
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

// GET parameters
var folderId = url.extension;

// search for node
var folder = search.findNode("workspace://SpacesStore/" + folderId); 
if(folder != null) {
	model.folder = folder;
	
	if (folder.hasPermission("Write")) {
		model.writePermission = true;
	} else {
		model.writePermission = false;
	}
	if (folder.hasPermission("Delete")) {
		model.deletePermission = true;
	} else {
		model.deletePermission = false;
	}
	if (folder.hasPermission("CreateChildren")) {
		model.createPermission = true;
	} else {
		model.createPermission = false;
	}
	
	model.success = true;
	model.msg = "Folder properties were loaded";
	logger.log("Folder properties were loaded");
} else {
	status.code = 400;
	status.message = "Invalid node reference " + folderId;
	status.redirect = true;
	logger.log("Invalid node reference " + folderId);
}
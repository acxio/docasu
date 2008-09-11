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

// we need a nodeId
var folderId = args.folderId

var nodeRef = "workspace://SpacesStore/" + folderId

if (logger.isLoggingEnabled()) {
	logger.log("Fetching details for file with nodeRef: " + nodeRef);
}

var folder = search.findNode(nodeRef); 

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
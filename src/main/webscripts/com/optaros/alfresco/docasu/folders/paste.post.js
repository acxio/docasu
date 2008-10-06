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

var folderId = url.extension;

if (args.c == undefined) {
	status.code = 404;
   	status.message = "Empty clipboard";
   	status.redirect = true;
}


var nodeRef = "workspace://SpacesStore/" + folderId;

if (logger.isLoggingEnabled()) {
	logger.log("Fetching Folder: " + nodeRef);
}

var folder = search.findNode(nodeRef); 

if (folder == undefined || !folder.isContainer)
{
	status.code = 404;
   	status.message = "Folder " + folderId + " not found.";
   	status.redirect = true;
}

var nodes = args.c.split(",");

for each (ref in nodes) {
	var node = search.findNode("workspace://SpacesStore/" + ref);
	
	// TODO: error handling if node doesn't exist
	
	if (node != undefined) {
		node.copy(folder, true);
		logger.log("pasting " + ref);
	} else {
		logger.log("couldn't find " + ref);
	}
}

model.success = true;
model.msg = 'ok';


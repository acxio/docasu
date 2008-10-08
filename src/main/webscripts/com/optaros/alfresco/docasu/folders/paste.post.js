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

var clipParam = args.c;

if(clipParam) {
	// search for node
	var folder = search.findNode("workspace://SpacesStore/" + folderId);
	if(folder != null) {
		// make sure it's folder
		if(folder.isContainer) {
			var copyStatus = "";
			var nodes = clipParam.split(",");
			for each (ref in nodes) {
				// search for node
				var node = search.findNode("workspace://SpacesStore/" + ref);
				if(node != null) {
					node.copy(folder, true);
					copyStatus += node.properties.name + "-success; ";
				} else {
					copyStatus += ref + "-failed; ";
				}
			}
			
			model.success = true;
			model.msg = "Copy status: " + copyStatus;
			logger.log("Copy status: " + copyStatus);
		} else {
			status.code = 400;
			status.message = "Invalid folder reference " + folderId;
			status.redirect = true;
			logger.log("Invalid folder reference " + folderId);
		}
	} else {
		status.code = 400;
		status.message = "Invalid node reference " + folderId;
		status.redirect = true;
		logger.log("Invalid node reference " + folderId);
	}
} else {
	status.code = 400;
	status.message = "No clipboard parameter passed";
	status.redirect = true;
	logger.log("No clipboard parameter passed");
}

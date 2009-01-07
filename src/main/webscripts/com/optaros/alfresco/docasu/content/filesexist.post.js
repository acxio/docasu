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

/*
POST Request example:
{
	fileNames: ["filePath1", "filePath2"]
}
*/

var folderId = url.extension;

var folder = search.findNode("workspace://SpacesStore/" + folderId);
if (folder != null && folder.isContainer) {
	model.existingFileNames = [];

	// Get the fileNames to check for duplicates in folder
	var json = eval("(" + args.fileNames + ")");
	var fileNames = json.fileNames;

	for each (fileName in fileNames) {
		// If the file already exists add it to the result
		var nodeID = folder.childByNamePath(fileName);
		if (nodeID) {
			var existingFileName = {
				fileName: escape(fileName),
				nodeID: nodeID.nodeRef.id
			};
			model.existingFileNames.push(existingFileName);
		}
	}
	model.success = true;
	model.msg = "OK";
} else {
	// Error
	model.success = false;
	model.msg = "Invalid parameters";
	logger.log("Invalid parameters");
}
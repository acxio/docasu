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

// only works for nodes in workspace://SpacesStore

// If a node ID is passed to the service in parameter nodeId use that one
// else show the folders for companyhome
var nodeId = companyhome.id;

// Paging
var start = 0;
if (args.start != null) {
	start = args.start;
}

// Limit items per page. This value is connected to the config
// of the paging toolbar for the file grid
//		bbar: new Ext.PagingToolbar({
//            pageSize: 50,
//            store: gridStore,
var limit = 50;
if (args.limit != null) {
	limit = args.limit;
}

if (args.nodeId != null && args.nodeId.length>0 && args.nodeId != 'companyHomeNode') {
	nodeId = args.nodeId;
}

var nodeRef = "workspace://SpacesStore/" + nodeId

if (logger.isLoggingEnabled()) {
	logger.log("Fetching Folder: " + nodeRef);
}


var folder = search.findNode(nodeRef); 
var entries = new Array();
var total = 1;
var arrayIndex = 0;

if (folder == undefined || !folder.isContainer)
{
	status.code = 404;
   	status.message = "Folder " + nodeRef + " not found.";
   	status.redirect = true;
} else {
	// Step through all items  in folder
    for each (child in folder.children) {
    	// How many total items do we have? We cannot use folder.size
    	// since that would count folder as well
    	total++;
    	if (total>start && arrayIndex < limit) {
			var fileName = child.name;
			var extension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length()).toLowerCase();
			logger.log("Child name: " + fileName + " ext: " +  extension);
			if ((extension == 'txt') || (extension == 'htm') || (extension == 'html')) {
				var canEdit = true ;
			} else {
				var canEdit = false;
			}
			entries[arrayIndex] = new Array(2);
			entries[arrayIndex][0] = child;
			entries[arrayIndex][1] = canEdit;
		    arrayIndex++;
		} else if (arrayIndex >= limit) {
			break;
		}
    }    
}
// Pass entries and total number of files to Freemarker
model.entries = entries;
model.total = total-1;
model.randomNumber = Math.random();
model.path = folder.displayPath + "/" + folder.name;
model.folderName = folder.name;
model.folder = folder;
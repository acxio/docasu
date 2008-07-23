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

var givenNode = args.nodeId;
logger.log("Node ID: " + givenNode);

// find the given node
if (givenNode == null) {
	var givenNode = companyhome.id;
}

var node = search.findNode("workspace://SpacesStore/" + givenNode);
var entries = new Array();
var arrayIndex = 0;
model.comment = '';


if (!node.hasPermission("Read")) {
	model.comment += "cannotRead ";
} else {
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'viewDetails';
	entries[arrayIndex][1] = 'View Details';
	arrayIndex++;
}
if (!node.hasPermission("Write")) {
	model.comment += "cannotWrite ";
} else {
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'renameFolder';
	entries[arrayIndex][1] = 'Rename Folder';
	arrayIndex++;
}

if (!node.hasPermission("Delete")) {
	model.comment += "cannotDelete ";
} else {
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'deleteFolder';
	entries[arrayIndex][1] = 'Delete Folder';
	arrayIndex++;
}

if (!node.hasPermission("CreateChildren")) {
	model.comment += "cannotCreate ";
} else {
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'createFolder';
	entries[arrayIndex][1] = 'Create Folder';
	arrayIndex++;
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'pasteAll';
	entries[arrayIndex][1] = 'Paste All';
	arrayIndex++;
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'text';
	entries[arrayIndex][1] = 'Create Text File';
	arrayIndex++;
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'html';
	entries[arrayIndex][1] = 'Create HTML File';
	arrayIndex++;
	entries[arrayIndex] = new Array(2);
	entries[arrayIndex][0] = 'uploadFile';
	entries[arrayIndex][1] = 'Upload File';
	arrayIndex++;
}

if (model.comment == '') {
	model.comment = 'empty';
}

//model.entries = entries;
model.entries = entries;
model.total = arrayIndex;

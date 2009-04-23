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

// DELETE params
var nodeId = url.extension;

function getPreferences() {
	return person.childAssocs["app:configurations"][0].children[0];
}

// search for node
var node = search.findNode("workspace://SpacesStore/" + nodeId); 
if(node != null) {
	// get name property
	var nodeName = node.properties.name;
	
	// remove shortcut
	var preferences = getPreferences();
	
	var shortcutNodes = (preferences.properties["app:shortcuts"]);
	if(!isArray(shortcutNodes)){
		shortcutNodes = new Array(shortcutNodes);
	}
	var before = shortcutNodes.length;
	var removed = false;
	for (i = 0; i < shortcutNodes.length; i++) {
		if (shortcutNodes[i] == nodeId) {
			shortcutNodes.splice(i, 1);
			removed = true;
		}
	}
	preferences.properties["app:shortcuts"] = shortcutNodes;
	preferences.save();
	
	model.success = true;
	model.msg = "Favorite " + nodeName + " was removed. "+ removed + " res: " + shortcutNodes + " typeof " + (typeof shortcutNodes);
	logger.log("Favorite " + nodeName + " was removed");
} else {
	status.code = 400;
	status.message = "Invalid node reference " + nodeId;
	status.redirect = true;
	logger.log("Invalid node reference " + nodeId);
}

function isArray(obj) {
	   if (obj.constructor.toString().indexOf("Array") == -1)
	      return false;
	   else
	      return true;
}

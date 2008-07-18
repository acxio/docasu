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

// Get parameters
var nodeId = args.nodeId; // assume the 'id' arg contains a node id

logger.log("Node ID to check in is: " + nodeId);

// Get the node
var node = search.findNode("workspace://SpacesStore/" + nodeId);

if (node != null) {
	// Check it in
	node.checkin();		
	model.success = true;
	model.msg = "Document checked in";
		
} else {
	logger.log("Couldn't check it in.");
	model.success = false;
	model.comment = "Couldn't check it in.";
}
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

var nodeRef = "workspace://SpacesStore/" + args.nodeId;

if (logger.isLoggingEnabled()) {
	logger.log("Fetching Node: " + nodeRef);
}

var node = search.findNode(nodeRef); 

if (node == undefined || !node.isDocument)
{
	status.code = 404;
   	status.message = "Document " + args.nodeId + " not found.";
   	status.redirect = true;
}

model.d = node;
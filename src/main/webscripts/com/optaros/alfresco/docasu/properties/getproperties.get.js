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
var nodeId = args.nodeId

var nodeRef = "workspace://SpacesStore/" + nodeId

if (logger.isLoggingEnabled()) {
	logger.log("Fetching details for file with nodeRef: " + nodeRef);
}

var file = search.findNode(nodeRef); 

if (file == undefined || file.isContainer)
{
	status.code = 404;
   	status.message = "Folder " + nodeRef + " not found.";
   	status.redirect = true;
}

model.file = file;
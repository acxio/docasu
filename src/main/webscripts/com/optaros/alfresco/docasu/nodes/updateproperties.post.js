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
var nodeId = url.extension;

var title = "";
var name = "";
var description = "";
var author = "";

for each (field in formdata.fields) {
	if (field.name == "title") {
		title = field.value;
	} else if (field.name == "name") {
		name = field.value;
	} else if (field.name == "description") {
		description = field.value;
	} else if (field.name == "author") {
		author = field.value;
	}
}

// search for node
var doc = search.findNode("workspace://SpacesStore/" + nodeId);
if(doc != null) {
	// make sure is document 
	if(!doc.isContainer) {
		// get name property before renaming
		var nodeName = doc.properties.name;
		doc.properties["title"] = title;
		doc.properties["name"] = name;
		doc.properties["description"] = description;
		doc.properties["author"] = author;
		doc.save();
		
		model.success = true;
		model.msg = "Properties for " + nodeName + " were updated";
		logger.log("Properties for " + nodeName + " were updated");
	} else {
		status.code = 400;
		status.message = "Invalid document reference " + nodeId;
		status.redirect = true;
		logger.log("Invalid document reference " + nodeId);
	}
} else {
	status.code = 400;
	status.message = "Invalid node reference " + nodeId;
	status.redirect = true;
	logger.log("Invalid node reference " + nodeId);
}

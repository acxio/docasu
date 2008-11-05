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

// DELETE parameters
var nodeId = url.extension;

var categoryId = args.categoryId;

// search for node
var node = search.findNode("workspace://SpacesStore/" + nodeId);
if (node != null) {
	// search for category
	var category = search.findNode("workspace://SpacesStore/" + categoryId);
	if(category != null) {
		// get some properties
		var nodeName = node.properties.name;
		var categoryName = category.properties.name;
		
		// add generalclassifiable aspect if it doesn't exist
		if(!node.hasAspect("cm:generalclassifiable")) {
			node.addAspect("cm:generalclassifiable");
		}
		
		// search if category exists
		var exists = false;
		var categories = node.properties["categories"];
		if(!categories || categories == null) {
			node.properties["categories"] = [];
		} else {
			for(i in categories) {
				if(categories[i].id == categoryId) {
					exists = true;
					break;
				}
			}
		}
		
		// add category
		if(!exists) {
			node.properties["categories"].push(category);
			node.save();
			
			model.success = true;
			model.msg = "Category " + categoryName + " was added to " + nodeName;
			logger.log("Category " + categoryName + " was added to " + nodeName);
		} else {
			status.code = 400;
			status.message = "Category " + categoryName + " already set";
			status.redirect = true;
			logger.log("Category " + categoryName + " already set");	
		}
	} else {
		status.code = 400;
		status.message = "Invalid category reference " + categoryId;
		status.redirect = true;
		logger.log("Invalid category reference " + categoryId);
	}
} else {
	status.code = 400;
	status.message = "Invalid node reference " + nodeId;
	status.redirect = true;
	logger.log("Invalid node reference " + nodeId);
}
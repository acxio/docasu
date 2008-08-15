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

// locate properties

var title = "";
var name = "";
var description = "";
var nodeId = null;
var author = "";

for each (field in formdata.fields)
{
  if (field.name == "title") {
  	title = field.value;
  } else if (field.name == "name") {
	name = field.value;
  } else if (field.name == "description") {
  	description = field.value;
  } else if (field.name == "nodeId") {
  	nodeId = field.value;
  } else if (field.name == "author") {
    author = field.value;
  }
}
logger.log(nodeId);
var doc = search.findNode("workspace://SpacesStore/" + nodeId);
if (doc == null || doc.isContainer) {
	status.code = 404;
	status.message = "Document " + nodeId + " not found.";
	status.redirect = true;
	model.msg = 'err';
}
else {

	doc.properties["title"] = title;
	doc.properties["name"] = name;
	doc.properties["description"] = description;
	doc.properties["author"] = author;
	doc.save();
	
	model.msg = "ok";
	model.success = true;
}

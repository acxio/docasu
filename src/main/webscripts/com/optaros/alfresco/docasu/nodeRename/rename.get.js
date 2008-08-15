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

var newName = null;
var contentID = null;

/* locate file attributes
for each (field in formdata.fields)
{
logger.log("Name: " + field.name + " ; Value: " + field.value);
  if (field.name == "filename") {
  	  newName = field.value;
  } else if (field.name == "nodeId") {
  	  contentID = field.value;
  }
}
*/
newName = args.newName;
contentId = args.nodeId;

// find the listing folder - create if not already exists
var contentToRename = search.findNode("workspace://SpacesStore/" + contentId );

if (contentToRename.hasPermission("Write")) {
	contentToRename.name = newName;
	model.msg = "ok";
	model.success = true;
	logger.log("filename updated");
} else {
	model.msg = "privileges";
	model.success = false;
	logger.log("user didn't have privileges");
}
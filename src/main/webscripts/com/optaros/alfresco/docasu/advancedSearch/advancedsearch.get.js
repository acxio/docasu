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

/**
 * Format a given date to the format used in date range queries - see
 * http://wiki.alfresco.com/wiki/Search#Range_Queries
 * Note that query parser asumes all dates to be in the server's timezone;
 * in addition, the time component of the given date is ignored!
 */
function writeDateForRange(d) {
	var temp = new Date();
	// The Date d contains the user's timezone, i.e. since we parse it into
	// temp and later use the "local" methods of the Date objects, this takes
	// care of converting this point in time to the server's local timezone.
	temp.setTime(Date.parse(d));
	return temp.getFullYear() + "\\-" + (temp.getMonth() + 1) + "\\-" +
		(temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate()) + "T00:00:00";
}

/**
 * Format a given date to suit the Alfresco query parser's taste.
 * Note that query parser asumes all dates to be in the server's timezone;
 * in addition, the time component of the given date is ignored!
 */
function writeDate(d) {
	var temp = new Date();
	// The Date d contains the user's timezone, i.e. since we parse it into
	// temp and later use the "local" methods of the Date objects, this takes
	// care of converting this point in time to the server's local timezone.
	temp.setTime(Date.parse(d));
	return temp.getFullYear() + "-" + (temp.getMonth() + 1) + "-" +
		(temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate()) + "T00:00:00";
}

var MAX_DATE = "3000\\-12\\-31T00:00:00";
var MIN_DATE = "1970\\-01\\-01T00:00:00";

var searchType = null;
var searchText = null;
var createdFrom = null;
var createdTo = null;
var modifiedFrom = null;
var modifiedTo = null;
var lookIn = null;

var luceneQuery = "";
  
  if (args.lookIn.length > 0)
  {lookIn = args.lookIn;}

  if (args.searchType.length > 0)
  {searchType = args.searchType;}
  if (args.searchText.length > 0)
  {searchText = args.searchText;}
  if (args.modifiedFrom.length > 0)
  {modifiedFrom = args.modifiedFrom;}
  if (args.modifiedTo.length > 0)
  {modifiedTo = args.modifiedTo;}
  if (args.createdFrom.length > 0)
  {createdFrom = args.createdFrom;}
  if (args.createdTo.length > 0)
  {createdTo = args.createdTo;}
  
  
  
if (createdFrom != null) {
	if (createdTo != null) {
		luceneQuery += "+@cm\\:created:[" + writeDateForRange(createdFrom) + " TO "
			+ writeDateForRange(createdTo) + "] ";
	} else {
		luceneQuery += "+@cm\\:created:[" + writeDateForRange(createdFrom) + " TO "
			+ MAX_DATE + "] ";
	}
} else if (createdTo != null) {
	luceneQuery += "+@cm\\:created:[" + MIN_DATE + " TO "
		+ writeDateForRange(createdTo) + "] ";
}

if (modifiedFrom != null) {
	if (modifiedTo != null) {
		luceneQuery += "+@cm\\:modified:[" + writeDateForRange(modifiedFrom) + " TO "
			+ writeDateForRange(modifiedTo) + "] ";
	} else {
		luceneQuery += "+@cm\\:modified:[" + writeDateForRange(modifiedFrom) + " TO "
			+ MAX_DATE + "] ";
	}
} else if (modifiedTo != null) {
	luceneQuery += "+@cm\\:modified:[" + MIN_DATE + " TO "
		+ writeDateForRange(modifiedTo) + "] ";
}

if (searchText != null) {
  if (searchType == "content") {
   	luceneQuery += " +(TEXT:\"" + searchText + "\"" + " @cm\\:name:\"" + searchText + "\") +TYPE:\"{http://www.alfresco.org/model/content/1.0}content\"";
  } else if (searchType == "filename") {
  	luceneQuery += " +@cm\\:name:\"" + searchText + "\" +TYPE:\"{http://www.alfresco.org/model/content/1.0}content\"";
  } else if (searchType == "space") {
   	luceneQuery += " +@cm\\:name:\"" + searchText + "\" +TYPE:\"{http://www.alfresco.org/model/content/1.0}folder\"";
  } else {
  	luceneQuery += " +(TEXT:\"" + searchText + "\"" + " OR @cm\\:name:\"" + searchText + "\" AND (TYPE:\"{http://www.alfresco.org/model/content/1.0}content\" OR TYPE:\"{http://www.alfresco.org/model/content/1.0}folder\"))";
  }
}



if (lookIn != null) {
  if (lookIn == "currentFolder") {
  	var node = search.findNode("workspace://SpacesStore/" + args.currentFolder); 	
	if (node != null) {
		var folderPath = node.qnamePath;
		luceneQuery += " +PATH:\"" + folderPath + "//.\"";
	}else {
		model.comment = "The node "+args.currentFolder+" was not found !!!";
	}		
  } 
}


// perform search
logger.log(luceneQuery);
var nodes = search.luceneSearch(luceneQuery);
model.total = nodes.length;
model.entries = nodes;

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

// check that search term has been provided
if (args.q == undefined || args.q.length == 0)
{
   status.code = 400;
   status.message = "Search term has not been provided.";
   status.redirect = true;
}
else
{
  // perform search
  var query; ;
  if (args.t == "content") {
   	query = "(TEXT:\"" + args.q + "\"" + " OR @cm\\:name:\"" + args.q + "\") AND TYPE:\"{http://www.alfresco.org/model/content/1.0}content\"";
  } else if (args.t == "filename") {
  	query = "@cm\\:name:\"" + args.q + "\" AND TYPE:\"{http://www.alfresco.org/model/content/1.0}content\"";
  } else if (args.t == "space") {
   	query = "@cm\\:name:\"" + args.q + "\" AND TYPE:\"{http://www.alfresco.org/model/content/1.0}folder\"";
  } else {
  	query = "TEXT:\"" + args.q + "\"" + " OR @cm\\:name:\"" + args.q + "\" AND (TYPE:\"{http://www.alfresco.org/model/content/1.0}content\" OR TYPE:\"{http://www.alfresco.org/model/content/1.0}folder\")";
  }
  logger.log(query);
  var nodes = search.luceneSearch(query);
  model.total = nodes.length;
  model.entries = nodes;
}

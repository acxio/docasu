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

function compareModified(n1, n2) {
	var d1 = n1.properties["cm:modified"];
	var d2 = n2.properties["cm:modified"];
	return d1 < d2 ? 1 : d1 > d2 ? -1 : 0;
}

function writeDateForRange(d) {
	var temp = d;
	return temp.getFullYear() + "\\-" + (temp.getMonth() + 1) + "\\-" +
		(temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate()) + "T00:00:00";
}

function y2k(number) {
	return (number < 1000) ? number + 1900 : number;
}

// get the date 3 days ago
var date = new Date();
var oldDate = new Date(Date.UTC(y2k(date.getYear()),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()) - 3*24*60*60*1000);

// search for documents modified in the last 3 days
var luceneQuery = "+@cm\\:modified:[" + writeDateForRange(oldDate) + " TO "
			+ writeDateForRange(new Date()) + "] AND TYPE:\"cm:content\" AND NOT PATH:\"/app:company_home/app:dictionary//.\""
			+ "AND PATH:\"/app:company_home//.\"";

var temp = search.luceneSearch(luceneQuery);

var results = new Array();

// Filter results to keep the existing nodes
for each (result in temp) {
	try{
			result.isDocument;
			results.push(result);
	}catch(err){
		if (err=="Node does not exist"){
			logger.log(err+": "+result);
		}else{
			logger.log(err);
		}
	}
}
// sort the result
results.sort(compareModified);

// fetch result
if (results.length > 20) {
	results = results.slice(0, 20);
}
model.resultset = results;

model.success = true;
model.msg = "Found " + results.length + " recent documents";
logger.log("Found " + results.length + " recent documents");

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


// DoCASUApplicationManager

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Utils");



// TODO replace this renderer with an anonymous function
/**
 * Renderer that converts dates & times from the JSON response to the
 * user's time zone
 * @param {Object} value
 * @param {Object} column
 * @param {Object} record
 */
DoCASU.App.Utils.timeZoneAwareRenderer = function(value, column, record) {
	return DoCASU.App.Utils.convertTimezone(value);
} // eo function timeZoneAwareRenderer


// TODO add documentation string!
DoCASU.App.Utils.convertTimezone = function(value) {
	// we're using ExtJs's version of the "Date" class here!
	// See http://extjs.com/deploy/dev/docs/?class=Date
	// All we do is parse the date with the given timezone and
	// then return a formatted version of the date which uses
	// the local (= browser's) timezone...
	var dateValue = Date.parseDate(value, "Y-m-d H:i O");
	var formattedDate = Ext.util.Format.date(dateValue, "Y-m-d H:i");
	return formattedDate;
} // eo function convertTimezone

DoCASU.App.Utils.mailLink = function(name, link) {
	parent.location="mailto:?subject=mailing:%20"+name+"&body=" + escape("<a href=\""+location.protocol + "//" + location.host + link+"\">"+name+"</a>");		
}

DoCASU.App.Utils.trim = function(s) {
	return s.replace(/^\s+|\s+$/g, '');
}

DoCASU.App.Utils.newTab = function(url) {
	// TODO: make this browser compatible - Firefox opens in new tab, but IE opens in new window
	window.open(url, "", ""); // (URL, windowName, windowFeatures)
}

DoCASU.App.Utils.copyTextToSystemClipboard = function(text2copy) {
	/* 
		This script and many more are available free online at The JavaScript Source <http://javascript.internet.com/forms/clipboard-copy.html>
		Created by: 
		 	- Mark O'Sullivan <http://lussumo.com>
			- Jeff Larson <http://www.jeffothy.com>
			- Mark Percival <http://webchicanery.com>
		Licensed under GNU Lesser General Public License
	*/
	if (window.clipboardData) {
	 	window.clipboardData.setData("Text", text2copy);
	} else {
		var flashcopier = "flashcopier";
		if(!document.getElementById(flashcopier)) {
			var divholder = document.createElement("div");
			divholder.id = flashcopier;
			document.body.appendChild(divholder);
		}
		document.getElementById(flashcopier).innerHTML = "";
		var divinfo = "<embed src=\"../../docasu/lib/swf/_clipboard.swf\" FlashVars=\"clipboard="+escape(text2copy)+"\" width=\"0\" height=\"0\" type=\"application/x-shockwave-flash\"></embed>";
		document.getElementById(flashcopier).innerHTML = divinfo;
	}
} // eo function copyTextToSystemClipboard

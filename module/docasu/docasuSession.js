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
 * Returns key strings to identify alfresco login page. 
 * @return {Array} an array of strings
 */
function getSessionExpiredKeyTags() {
	var tags = ["loginForm", "user-name", "user-password"];
	return tags;
}


/**
 * Checks the response to see if the session expired or not. <br> 
 * Call this method in Ext.Ajax.success function passing it the first parameter.
 * @param {Object} response The result of an Ext.Ajax.request
 * @return {Boolean} true if the session expired or false otherwise
 */
function sessionExpired(response) {
 	/** 
 	 * When session expires Alfresco forwards any request to the login page. <br>
 	 * This function should make sure that the response is the login page content. 
 	 */
 	
 	try {
		var jsonData = Ext.util.JSON.decode(response.responseText);
		// decode was successfull, session is not expired
		return false;
	}
	catch (err) {
		// response is not JSON data, could be the login page content
		var stringData = response.responseText;
		
		// check if valid string
		if(typeof stringData != 'string') {
			// response is not string, cannot be login page content
			return false;
		} else if(stringData.length < 1000) {
			// the response is too small to be login page content
			return false;
		}
		
		var tags = getSessionExpiredKeyTags();
		for(i in tags) {
			if(typeof tags[i] == 'string' && stringData.indexOf(tags[i]) < 0) {
				// one non matching string means not the login page
				return false;
			}
		}
		
		// respons matched all key strings, it may be the login page
		return true; 
	}
 	
 	// response did not match any scenario, session may be active
 	return false;
}
 
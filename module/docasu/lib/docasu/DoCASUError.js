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


/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Error");


/**
 * Checks the response to see if any error occurred and handles the error message. <br> 
 * Call this method in Ext.Ajax.success function passing it the first parameter.
 * @param {String} stringMsg The error message to display
 * @param {Object} response The response of an Ext.Ajax.request
 * @return {Boolean} true if any error occurred or false otherwise
 */
DoCASU.App.Error.checkHandleErrors = function(stringMsg, response) {
	// check for session expiration
	if(DoCASU.App.Session.isSessionExpired(response)) {
		// reload docasu
		DoCASU.App.ApplicationManager.getApplication().reload();
		return true;
	}
	try {
		// decode JSON message
		var jsonData = Ext.util.JSON.decode(response.responseText);
		if (!jsonData.success) {
			// handle error message
			var message = '<b>' + stringMsg + '</b> : ' + jsonData.msg;
			if (jsonData.status.code >= 500) {
				message = message + '<br/><br/>' + 
				'<b>Status: </b>' + jsonData.status.code  +' ' + jsonData.status.name + '' + jsonData.status.description + '<br/><br/>' +
				'<b>Exception: </b>' + jsonData.exception + '<br/><br/>' +
				'<b>Server:</b> ' + jsonData.server + '<br/><br/>' +
				jsonData.time;
			}
			Ext.MessageBox.alert('Failed', message);
			return true;
		} else {
			// request was successful
			//Ext.MessageBox.alert('Success', jsonData.msg);
			return false;
		}
	}
	catch (err) {
		Ext.MessageBox.alert('Failed', err + ' cannot parse JSON response: ' + response.responseText);
		return true;
	}
}

/**
 * Displays an error message. <br>
 * Call this method in Ext.Ajax.failure function passing it the first parameter.
 * @param {String} stringMsg The error message to display
 * @param {Object} response The response of an Ext.Ajax.request
 */
DoCASU.App.Error.handleFailureMessage = function(stringMsg, response) {
	try {
		// decode JSON message
		var jsonData = Ext.util.JSON.decode(response.responseText);
		var message = '<b>' + stringMsg + '</b> : ' + jsonData.msg;
		// handle error message
		if (jsonData.status.code >= 500) {
			message = message + '<br/><br/>' + 
			'<b>Status: </b>' + jsonData.status.code  +' ' + jsonData.status.name + '' + jsonData.status.description + '<br/><br/>' +
			'<b>Exception: </b>' + jsonData.exception + '<br/><br/>' +
			'<b>Server:</b> ' + jsonData.server + '<br/><br/>' +
			jsonData.time;
		}
		Ext.MessageBox.alert('Failed', message);
	}
	catch (err) {
		Ext.MessageBox.alert('Error', stringMsg + ' due to <br/><br/>' + response.responseText);
	}
}
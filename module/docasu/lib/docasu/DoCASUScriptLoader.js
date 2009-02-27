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
Ext.namespace("DoCASU.App");

/* constructor */
DoCASU.App.ScriptLoader = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.ScriptLoader.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeallstart",
		"allfinished",
		"filestart",
		"filefinished"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.ScriptLoader, Ext.util.Observable, {
	// configuration options
	type			:	"text/javascript",
	language		:	"JavaScript",
	
	// private variables
	remainingFiles	:	0,
	
	// methods
	fireStartEvent : function() {
		this.fireEvent("beforeallstart", this);
	}, // eo function fireStartEvent
	
	fireFinishEvent : function() {
		this.fireEvent("allfinished", this);
	}, // eo function fireFinishEvent
	
	fireFileStartEvent : function(scriptElement) {
		this.fireEvent("filestart", this);
		this.remainingFiles++;
		scriptElement.scriptLoader = this;
		// onload event for most browsers
		scriptElement.onload = function() {
			this.scriptLoader.fireFileFinishedEvent();
		}
		// onload event for IE
		scriptElement.onreadystatechange = function() {
			if (this.readyState == "complete" || this.readyState == "loaded") {
				this.scriptLoader.fireFileFinishedEvent();
			}
		}
	}, // eo function fireFileStartEvent
	
	fireFileFinishedEvent : function() {
		this.fireEvent("filefinished", this);
		this.remainingFiles--;
		if(this.remainingFiles <= 0) {
			this.fireFinishEvent();
		}
	}, // eo function fireFileFinishedEvent
	
	loadScriptFile : function(file) {
		// create a script element - ie. <script/>
		var scriptElement = document.createElement("script");
		// set src attribute - ie. <script src="./scriptFile" />
		scriptElement.setAttribute("src", file);
		// set type attribute - ie. <script src="./scriptFile" type="text/javascript" />
		scriptElement.setAttribute("type", this.type);
		// set language attribute - ie. <script src="./scriptFile" type="text/javascript" language="JavaScript" />
		scriptElement.setAttribute("language", this.language);
		
		// add the script element to the head tag - download begins asynchronously
		document.getElementsByTagName("head")[0].appendChild(scriptElement);
		
		// fire event
		this.fireFileStartEvent(scriptElement);
	}, // eo loadScriptFile
	
	loadScriptFiles : function(files) {
		this.fireStartEvent();
		for(i in files) {
			var file = files[i];
			if(typeof file != "function") {
				this.loadScriptFile(file);
			}
		}
	} // eo loadScriptFiles
	
}); // eo extend

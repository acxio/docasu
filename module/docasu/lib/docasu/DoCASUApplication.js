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


// general available code should go in DoCASU.App
// plugins have to be defined under 'DoCASU.Plugins'
// components should go under parent plugin 'DoCASU.Plugins.XXXPlugin'


/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App");


/* constructor */
DoCASU.App.Application = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Application.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeload",
		"ready"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Application, Ext.util.Observable, {

	fireBeforeLoadEvent : function() {
		this.fireEvent("beforeload", this);
	}, // eo function fireBeforeLoadEvent

	fireReadyEvent : function() {
		this.fireEvent("ready", this);
	}, // eo function fireReadyEvent

	loadScripts : function() {
		var scriptLoader = new DoCASU.App.ScriptLoader();
		scriptLoader.docasu = this;
		scriptLoader.on("beforeallstart", function(loader) {
			scriptLoader.docasu.fireBeforeLoadEvent();
		});
		scriptLoader.on("allfinished", function(loader) {
			scriptLoader.docasu.fireReadyEvent();
		});
	
		var files = DoCASU.App.PerspectiveManager.getScriptFilesFromPerspective();
		scriptLoader.loadScriptFiles(files);
	}, // eo function loadScripts

	reload : function() {
		window.location = "ui";
	} // eo function reload
	
}); // eo DoCASU.App.Application

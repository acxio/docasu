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
 

// UpdateFileComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.UpdateFileComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.UpdateFileComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeupdate",
		"afterupdate"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.UpdateFileComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"UpdateFileComponent",
	title		:	"Update File Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		var uiConfig	=	{
								id			:	this.id,
								width		:	280,
								minWidth	:	265,
								height		:	220,
								minHeight	:	200,
								layout		:	"fit",
								border		:	false,
								closable	:	true,
								iconCls		:	"icon-upload",
								items		:	[{
													xtype			:	"uploadpanel",
													buttonsAt		:	"tbar",
													id				:	"uppanel",
													url				:	"ui/node/content/update/", // add nodeId at runtime
													method			:	"POST",
													maxFileSize		:	1048576,
													enableProgress	:	false, // not implemented yet
													singleUpload	:	false, // upload a file at a time
													maxFiles		:	1 // upload a single file
												}]
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.UpdateFileComponent.superclass.init.apply(this, arguments);
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		var uploadPanel = uiWidget.items.map.uppanel;
		uploadPanel.on("beforeallstart", function (obj) {
			var component = DoCASU.App.PluginManager.getPluginManager().getComponent("UpdateFileComponent", "DoCASU.App.Core");
			component.fireEvent("beforeupdate", component);
		});
		uploadPanel.on("allfinished", function (obj) {
			var component = DoCASU.App.PluginManager.getPluginManager().getComponent("UpdateFileComponent", "DoCASU.App.Core");
			component.fireEvent("afterupdate", component);
		});
	}, // eo init
	
	show : function(fileName, fileId) {
		// init the window
		this.init();
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.setTitle("Update File " + fileName); // title of upload window
		uiWidget.items.map.uppanel.setUrl("ui/node/content/update/" + fileId); // nodeId of the update file
		uiWidget.show();
	} // eo show	

}); // eo DoCASU.App.Core.UpdateFileComponent

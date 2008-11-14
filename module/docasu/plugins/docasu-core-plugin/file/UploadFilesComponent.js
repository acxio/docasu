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
 

// UploadFilesComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.UploadFilesComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.UploadFilesComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeupload",
		"afterupload"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.UploadFilesComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"UploadFilesComponent",
	title		:	"Upload Files Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		var uiConfig	=	{
								id			:	this.id,
								title		:	"Upload Content",
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
													url				:	"ui/node/content/upload/", // add nodeId at runtime
													method			:	"POST",
													maxFileSize		:	1048576,
													enableProgress	:	false, // not implemented yet
													singleUpload	:	false, // upload a file at a time
												}]
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.UploadFilesComponent.superclass.init.apply(this, arguments);
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		var uploadPanel = uiWidget.items.map.uppanel;
		uploadPanel.on("beforeallstart", function (obj) {
			var component = DoCASU.App.PluginManager.getPluginManager().getComponent("UploadFilesComponent", "DoCASU.App.Core");
			component.fireEvent("beforeupload", component);
		});
		uploadPanel.on("allfinished", function (obj) {
			var component = DoCASU.App.PluginManager.getPluginManager().getComponent("UploadFilesComponent", "DoCASU.App.Core");
			component.fireEvent("afterupload", component);
		});
	}, // eo init
	
	show : function(folderId) {
		// init the window
		this.init();
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.items.map.uppanel.setUrl("ui/node/content/upload/" + folderId); // nodeId of the upload folder
		uiWidget.show();
	} // eo show	

}); // eo DoCASU.App.Core.UploadFilesComponent

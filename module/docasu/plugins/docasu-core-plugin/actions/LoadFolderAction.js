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


// LoadFolderAction

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.LoadFolderAction = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.LoadFolderAction.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeload",
		"afterload"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.LoadFolderAction, DoCASU.App.Component, {
	// configuration options
	id			:	"LoadFolderAction",
	title		:	"Load Folder Action",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.LoadFolderAction.superclass.init.apply(this, arguments);
		
		// register event handlers
		this.on("beforeload", function(component) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		this.on("afterload", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
	},
	
	load : function(folderId) {
		// fire beforeload event
		this.fireEvent("beforeload", this);
		var centerViewComponent;
		try {
			centerViewComponent = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		var store = centerViewComponent.items.items[0].store;
		store.baseParams.nodeId = folderId;
		store.baseParams.categoryId = null;
		
		// register listeners for store
		store.on("load", function() {
			var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
			loadFolderAction.fireEvent("afterload", loadFolderAction);
		});
		store.on("loadexception", function() {
			var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
			loadFolderAction.fireEvent("afterload", loadFolderAction);
		});
		
		store.load();
	}

}); // eo DoCASU.App.Core.LoadFolderAction

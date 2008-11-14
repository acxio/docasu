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
 

// CopyFolderComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.CopyFolderComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.CopyFolderComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.CopyFolderComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"CopyFolderComponent",
	title		:	"Copy Folder Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	
	copy : function(folderId) {
		this.setCopy(true); // flag to copy folder on next LoadFolderPropertiesAction
		var loadPropertiesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderPropertiesAction", "DoCASU.App.Core");
		loadPropertiesAction.on("beforeload", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		loadPropertiesAction.on("afterload", function(action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var copyFolderComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CopyFolderComponent", "DoCASU.App.Core");
			if(copyFolderComponent.getCopy()) {
				try {
					var folder = Ext.util.JSON.decode(response.responseText);
					var clipboard = DoCASU.App.PluginManager.getPluginManager().getComponent("ClipboardComponent", "DoCASU.App.Core");
					clipboard.put(folder.icon, folder.name, folder.id);
					clipboard.update();
				} catch (e) {
					Ext.MessageBox.alert("Error", "Failed to read folder properties " + e);
				}
				copyFolderComponent.setCopy(false); // flag NOT to copy folder on next LoadFolderPropertiesAction
			} else {
				// do not react to LoadFolderPropertiesAction
			}
		});
		loadPropertiesAction.on("fail", function(action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var copyFolderComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CopyFolderComponent", "DoCASU.App.Core");
			copyFolderComponent.setCopy(false); // flag NOT to copy folder on next LoadFolderPropertiesAction
		});
		loadPropertiesAction.load(folderId);
	}, // eo copy
	
	getCopy : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".copy", false);
	}, // eo getCopy
	
	setCopy : function(copy) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".copy", copy);
	} // eo setCopy

}); // eo DoCASU.App.Core.CopyFolderComponent

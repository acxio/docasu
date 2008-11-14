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
 

// DeleteFolderComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.DeleteFolderComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.DeleteFolderComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.DeleteFolderComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"DeleteFolderComponent",
	title		:	"Delete Folder Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	
	show : function(folderId) {
		Ext.Msg.confirm("Confirm folder deletion", "Are you sure you want to delete the folder and all it's contains ?", function(btn, text) {
			if (btn == "yes") {
				// make sure parent folder will be reloaded
				var centerViewComponent = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
				var store = centerViewComponent.items.items[0].store;
				store.baseParams.nodeId = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core").getParentFolder();
				var deleteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("DeleteNodeAction", "DoCASU.App.Core");
				deleteAction.deleteNode(folderId);
		    }
		});
	} // eo show

}); // eo DoCASU.App.Core.DeleteFolderComponent

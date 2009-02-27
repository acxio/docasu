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
 

// RenameFolderComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.RenameFolderComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.RenameFolderComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.RenameFolderComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"RenameFolderComponent",
	title		:	"Rename Folder Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	
	show : function(folderId) {
		Ext.Msg.prompt("Rename folder","Please enter the new folder name", function(btn, folderName){
	    	if (btn == "ok") {
				var renameFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("RenameFolderAction", "DoCASU.App.Core");
				renameFolderAction.on("beforesave", function(action) {
					new Ext.LoadMask(Ext.getBody()).show();
				});
				renameFolderAction.on("aftersave", function(action, response) {
					new Ext.LoadMask(Ext.getBody()).hide();
					DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
				});
				renameFolderAction.on("fail", function(action, response) {
					new Ext.LoadMask(Ext.getBody()).hide();
				});
				renameFolderAction.save(folderId, folderName);
		    }
		});
	} // eo show

}); // eo DoCASU.App.Core.RenameFolderComponent

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


// DoCASUHelpPlugin

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Air");

/* constructor */
DoCASU.App.Air.DoCASUAirPlugin = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Air.DoCASUAirPlugin.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeupdate",
		"afterupdate"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Air.DoCASUAirPlugin, DoCASU.App.Plugin, {
	// configuration options
	id			:	"DoCASUAirPlugin",
	title		:	"DoCASU Air Plugin",
	namespace	:	"DoCASU.App.Air", // each plugin is stored under a specified namespace - must be different than any class name
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Plugin
	
	isOnAir: function() {
		return window.parentSandboxBridge ? true : false;
	},
	getParentBridge: function() {
		return this.isOnAir() ? window.parentSandboxBridge : undefined;
	},
	init: function() {
		// call parent
		DoCASU.App.Air.DoCASUAirPlugin.superclass.init()
		
		if (this.isOnAir()) {
			// Create the child bridge
			var childInterface = {};
		
			window.childSandboxBridge = childInterface;
		
			// Establish the child bridge
			this.getParentBridge().establishChildBridge();

			var centerComponent = document.getElementById("DoCASUCenterComponent");

			centerComponent.addEventListener("dragenter", function(event) {
				event.preventDefault();
			});
    	
			centerComponent.addEventListener("dragover", function(event) {
				event.preventDefault();
			});
    	
			centerComponent.addEventListener("drop", function(event) {
				var thisPlugin = DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air");
				thisPlugin.fireEvent("beforeupdate", thisPlugin);
				thisPlugin.getParentBridge().setFilesDroppedOnFolderView();
			});
   	 	
			childInterface.getCurrentFolder = function() {	
				return DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core").getCurrentFolder();
			}
			
			childInterface.fireAfterUpdateEvent = function() {
				var thisPlugin = DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air");
				thisPlugin.fireEvent("afterupdate", thisPlugin);
			}
			
			this.on("afterupdate", function(obj) {
				var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
				loadFolderAction.load(window.childSandboxBridge.getCurrentFolder());
			});
			
			this.on("beforeupdate", function(obj) {
				// place holder
			});
			
			childInterface.showDuplicateDialog = function(file) {
				var win = new Ext.Window({
					title: "Upload",
					modal: true,
					layout: "fit",
					width: 430,
					autoheight: true,
					plain: true,
					border:false,
					buttons: [
						{text: "Cancel", handler: function() {DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().showDuplicateDialogCallback(file, "cancel", false); win.hide()}},
						{text: "Replace", handler: function() {DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().showDuplicateDialogCallback(file, "replace", false); win.hide()}},
						{text: "Replace All", handler: function() {DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().showDuplicateDialogCallback(file, "replace", true); win.hide()}},
						{text: "Skip", handler: function() {DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().showDuplicateDialogCallback(file, "skip", false); win.hide()}},
						{text: "Skip All", handler: function() {DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().showDuplicateDialogCallback(file, "skip", true);win.hide()}},
					]
				});
				
				var label = new Ext.form.Label({
					text: "An item named \"" + file.fileName + "\" already exists in this location. Do you want to replace it with the one you're uploading?",
					style: "font-size:12px;"
				});
				win.add(label);
				win.show();
			}
			
			childInterface.showDownloadDuplicateDialog = function(fileName) {
				var win = new Ext.Window({
					title: "Download",
					modal: true,
					layout: "fit",
					width: 430,
					autoheight: true,
					plain: true,
					border:false,
					buttons: [
						{text: "Cancel", handler: function() {DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().showDownloadDuplicateDialogCallback("cancel"); win.hide()}},
						{text: "Replace", handler: function() {DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().showDownloadDuplicateDialogCallback("replace"); win.hide()}}
					]
				});
				
				var label = new Ext.form.Label({
					text: "An item named \"" + unescape(DoCASU.App.PluginManager.getPluginManager().getPlugin("DoCASUAirPlugin", "DoCASU.App.Air").getParentBridge().extractFileName(fileName)) + "\" already exists in this location. Do you want to replace it with the one you're downloading?",
					style: "font-size:12px;"
				});
				win.add(label);
				win.show();
			}
			
			childInterface.showError = function(errorMessage) {
				Ext.MessageBox.alert('Error', errorMessage);
			}
			
			childInterface.showUploadDialog = function(uploadReport) {
				DoCASU.App.PluginManager.getPluginManager().getComponent("UploadFilesComponent", "DoCASU.App.Air").show(childInterface.getCurrentFolder());
				
				var uiWidget;
				try {
					uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("UploadFilesComponent");
				} catch(err) {
					// no UI widget was created thus component is disabled or closed
					return;
				}
				var uploadPanel = uiWidget.items.map.uppanel;
				
				for (var i = 0; i < uploadReport.length; i++) {
					uploadPanel.addFile(uploadReport[i]);
				}
			}
			
			childInterface.showLoadingMask = function(message) {
				new Ext.LoadMask(Ext.getBody(), {msg: message}).show();
			}
			
			childInterface.hideLoadingMask = function() {
				new Ext.LoadMask(Ext.getBody()).hide();
			}
		}
	}
	
}); // eo DoCASU.App.Help.DoCASUAirPlugin

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


// MainScreenHeaderComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.MainScreenHeaderComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.MainScreenHeaderComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.MainScreenHeaderComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"MainScreenHeaderComponent",
	title		:	"Main Screen Header Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		var folderName = new Ext.Panel({
			border	:	false,
			html	:	"<div id=\"folderName\"><img src=\"../../docasu/images/folder.gif\"/><div></div></div>"
		});
		folderName.on("render", function(panel) {
			panel.getEl().parent("td").addClass("folderName");
		});
		var folderActionsLabel = new Ext.Panel({
			border	:	false,
			cls		:	"folderActionsLabel",
			html	:	"<div id=\"folderActionsLabel\">Folder actions:</div>"
		});
		folderActionsLabel.on("render", function(panel) {
			panel.getEl().parent("td").child("div").addClass("folderActionsLabel");
		});
		var actionComboBoxStore = new Ext.data.SimpleStore({
			id		:	"actionComboBoxStore",
			fields	:	["code", "label"],
			data	:	[
						    ["createFolder",	"Create Folder"],
							["renameFolder",	"Rename Folder"],
							["deleteFolder",	"Delete Folder"],
							["viewDetails",		"View Details"],
							["pasteAll",		"Paste All"],
							["text",			"Create Text File"],
					        ["html",			"Create HTML File"],
							["uploadFile",		"Upload File(s)"]
						]
		});
		var folderActions = new Ext.form.ComboBox({
			id				:	"folderActions",
		    hiddenName		:	"t",
			typeAhead		:	true,
			emptyText		:	"View details",
			store			:	actionComboBoxStore,
			displayField	:	"label",
			valueField		:	"code",
			mode			:	"local",
			value			:	"",
			triggerAction	:	"all",
			selectOnFocus	:	true,
			editable		:	false,
			listeners		:	{
									select : function(f, n, o) {
										var currentFolder = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core").getCurrentFolder();
										if (f.getValue() == "pasteAll") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("PasteAllAction", "DoCASU.App.Core").paste(currentFolder);
										} else if (f.getValue() == "deleteFolder") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("DeleteFolderComponent", "DoCASU.App.Core").show(currentFolder);
										} else if (f.getValue() == "viewDetails") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("FolderDetailsComponent", "DoCASU.App.Core").show(currentFolder);
										} else if (f.getValue() == "createFolder") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("CreateFolderComponent", "DoCASU.App.Core").show(currentFolder);
										} else if (f.getValue() == "copyFolder") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("CopyFolderComponent", "DoCASU.App.Core").copy(currentFolder);
										} else if (f.getValue() == "renameFolder") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("RenameFolderComponent", "DoCASU.App.Core").show(currentFolder);
										} else if (f.getValue() == "text") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("CreateContentComponent", "DoCASU.App.Core").show("txt", currentFolder);
										} else if (f.getValue() == "html") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("CreateContentComponent", "DoCASU.App.Core").show("html", currentFolder);
										} else if (f.getValue() == "uploadFile") {
											DoCASU.App.PluginManager.getPluginManager().getComponent("UploadFilesComponent", "DoCASU.App.Core").show(currentFolder);
										} else {
											Ext.MessageBox.alert("There is no action defined for " +f.getValue());
										}
									}
								}
		});
		var uiConfig	=	{
								// config
								id			:	this.id,
								// look
								region		:	"north",
								height		:	40,
								layout		:	"table",
								layoutConfig:	{columns:3},
								border		:	false,
								cls			:	"center-header-bar",
								items		:	[folderName, folderActionsLabel, folderActions]  
							}; // the config to construct the UI object(widget)
							
		var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
		loadFolderAction.on("beforeload", function(action) {
			// show folder icon
			Ext.get("folderName").child("img").show();
			// show folder actions
			Ext.get("folderActions").parent("div").show();
			Ext.get("folderActionsLabel").show();
		});
		
		var loadCategoryAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadCategoryAction", "DoCASU.App.Categories");
		loadCategoryAction.on("beforeload", function(action) {
			// show folder icon
			Ext.get("folderName").child("img").show();
			// hide folder actions
			Ext.get("folderActions").parent("div").hide();
			Ext.get("folderActionsLabel").hide();
		});
		
		var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
		searchAction.on("beforeload", function(action) {
			/* Set the title to "Search results" */
			Ext.get("folderName").child("div").update("Search Results");
		
			/* Hide folder icon */
			Ext.get("folderName").child("img").setVisibilityMode(Ext.Element.DISPLAY);
			Ext.get("folderName").child("img").hide();
			
			/* Hide folder actions */
			Ext.get("folderActions").parent("div").hide();
			Ext.get("folderActionsLabel").hide();
		});
									
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
}); // eo DoCASU.App.Core.MainScreenHeaderComponent

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
 

// FolderDetailsComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.FolderDetailsComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.FolderDetailsComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.FolderDetailsComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"FolderDetailsComponent",
	title		:	"Folder Details Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		var name = new Ext.ux.form.StaticTextField({
			id			:	"folderpropName",
			fieldLabel	:	"Folder name",
			name		:	"name",
			value		:	"undefined"
		});
		var parent = new Ext.ux.form.StaticTextField({
			id			:	"folderpropParentPath",
			fieldLabel	:	"Parent Folder",
			autoHeight	:	true,
			value		:	"undefined"
		});
		parent.on("render", function (parent) {
			Ext.get("folderpropParentPath").addClass("link");
			Ext.get("folderpropParentPath").on("click", function () {
				DoCASU.App.PluginManager.getPluginManager().getUIWidget("FolderDetailsComponent").close();
				var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
				var folderDetailsComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("FolderDetailsComponent", "DoCASU.App.Core");
				loadFolderAction.load(folderDetailsComponent.getParentFolder());
			});
		});
		var creator = new Ext.ux.form.StaticTextField({
			id			:	"folderCreator",
			fieldLabel	:	"Creator",
			name		:	"foldercreator",
			value		:	"undefined"
		});
	
		var modified = new Ext.ux.form.StaticTextField({
			id			:	"folderpropModified",
			fieldLabel	:	"Last change",
			allowBlank	:	false,
			name		:	"modified",
			anchor		:	"90%",
			value		:	"undefined"
		});
		
		var created = new Ext.ux.form.StaticTextField({
			id			:	"folderpropCreated",
			fieldLabel	:	"Creation time",
			allowBlank	:	false,
			name		:	"created",
			anchor		:	"90%",
			value		:	"undefined"
		});
		var showDetailsPanel = new Ext.form.FormPanel({
			id			:	"folderDetailsPanel",
			title		:	"Folder details",
			frame		:	false,
			baseCls		:	"x-plain",
			labelWidth	:	120,
			bodyStyle	:	"padding: 15px",
			defaults	:	{
								anchor		:	"-15",
								xtype		:	"statictextfield",
								submitValue	:	true
							},
			items		:	[name, parent, creator, created, modified],
			buttons		:	[new Ext.Button({
								text	:	"Add to favorites", 
								handler : function() {
									DoCASU.App.PluginManager.getPluginManager().getUIWidget("FolderDetailsComponent").close();
									var addFavoriteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("AddFavoriteAction", "DoCASU.App.Core");
									var folderDetailsComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("FolderDetailsComponent", "DoCASU.App.Core");
									addFavoriteAction.save(folderDetailsComponent.getCurrentFolder());
								}
							})]
		});
		var uiConfig	=	{
								id				:	this.id,
								layout			:	"fit",
								modal			:	true,
								width			:	600,
								height			:	300,
								x				:	200,
								y				:	200,
								iconCls			:	"icon-grid",
								shim			:	false,
								animCollapse	:	false,
								constrainHeader	:	true,
								items			:	[{
														xtype		:	"tabpanel",
														id			:	"folderDetailsTabPanel",
														plain		:	true,
														activeTab	:	0,
														height		:	235,
														defaults	:	{bodyStyle: "padding:10px"},
														items		:	[showDetailsPanel] 
													}]
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	show : function(folderId) {
		// init the window
		this.init();
		this.setShow(true); // flag to show window on next LoadFolderPropertiesAction
		var loadPropertiesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderPropertiesAction", "DoCASU.App.Core");
		loadPropertiesAction.on("beforeload", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		loadPropertiesAction.on("afterload", function(action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var folderDetailsComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("FolderDetailsComponent", "DoCASU.App.Core");
			if(folderDetailsComponent.getShow()) {
				try {
					var folder = Ext.util.JSON.decode(response.responseText);
					folderDetailsComponent.setCurrentFolder(folder.nodeId);
					folderDetailsComponent.setParentFolder(folder.parentId);
					Ext.getCmp("folderpropName").setValue(folder.name);
					Ext.getCmp("folderpropParentPath").setValue(folder.path);
					Ext.getCmp("folderCreator").setValue(folder.creator);
					Ext.getCmp("folderpropModified").setValue(DoCASU.App.Utils.convertTimezone(folder.modified));
					Ext.getCmp("folderpropCreated").setValue(DoCASU.App.Utils.convertTimezone(folder.created));
					var uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("FolderDetailsComponent");
					uiWidget.setTitle(folder.name);
					uiWidget.show();
				} catch (e) {
					Ext.MessageBox.alert("Error", "Failed to read folder properties " + e);
				}
				folderDetailsComponent.setShow(false); // flag NOT to show window on next LoadFolderPropertiesAction
			} else {
				// do not react to LoadFolderPropertiesAction
			}
		});
		loadPropertiesAction.on("fail", function(action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var folderDetailsComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("FolderDetailsComponent", "DoCASU.App.Core");
			folderDetailsComponent.setShow(false); // flag NOT to show window on next LoadFolderPropertiesAction
		});
		loadPropertiesAction.load(folderId);
	}, // eo show
	
	getShow : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".show", false);
	}, // eo getShow
	
	setShow : function(show) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".show", show);
	}, // eo setShow
	
	getCurrentFolder : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".currentFolder");
	}, // eo getCurrentFolder
	
	setCurrentFolder : function(folderId) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".currentFolder", folderId);
	}, // eo setCurrentFolder
	
	getParentFolder : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".parentFolder");
	}, // eo getParentFolder
	
	setParentFolder : function(folderId) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".parentFolder", folderId);
	} // eo setParentFolder

}); // eo DoCASU.App.Core.FolderDetailsComponent

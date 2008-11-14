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
 

// FileDetailsComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.FileDetailsComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.FileDetailsComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.FileDetailsComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"FileDetailsComponent",
	title		:	"File Details Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		// Text fields for displaying file properties
		var name = new Ext.ux.form.StaticTextField({
			id: "filepropName",
			fieldLabel: "Name",
			name: "name",
			value: "none"
		});
		var title = new Ext.ux.form.StaticTextField({
			id: "filepropTitle",
			fieldLabel: "Title",
			name: "title",
			value: "undefined"
		});
		var mimetype = new Ext.ux.form.StaticTextField({
			id: "filepropMimetype",
			fieldLabel: "Content Type",
			name: "mimetype",
			value: "undefined"
		});
		var size = new Ext.ux.form.StaticTextField({
			id: "filepropSize",
			fieldLabel: "Size",
			name: "size",
			value: "undefined"
		});
		var parent = new Ext.ux.form.StaticTextField({
			id: "filepropParentPath",
			fieldLabel: "Parent Folder",
			autoHeight: true,
			value: "undefined"
		});
		parent.on("render", function (parent) {
			Ext.get("filepropParentPath").addClass("link");
			Ext.get("filepropParentPath").on("click", function () {
				Ext.getCmp("fileDetailsWindow").hide();
				loadParentFolder();
			});
		});
		var description = new Ext.form.TextArea({
			id: "filepropDescription",
			fieldLabel: "Description",
			allowBlank: true,
			name: "description",
			anchor: "90%",
			submitValue: false,
			readOnly: true,
			value: "undefined"
		});
		var version = new Ext.ux.form.StaticTextField({
			id: "filepropVersion",
			fieldLabel: "Version",
			name: "version",
			value: "undefined"
		});
		var author = new Ext.ux.form.StaticTextField({
			id: "filepropAuthor",
			fieldLabel: "Author",
			name: "author",
			value: "undefined"
		});
		var creator = new Ext.ux.form.StaticTextField({
			id: "filepropCreator",
			fieldLabel: "Creator",
			name: "creator",
			value: "undefined"
		});
		var modifier = new Ext.ux.form.StaticTextField({
			id: "filepropModifier",
			fieldLabel: "Modifier",
			name: "modifier",
			value: "undefined"
		});
		var modified = new Ext.ux.form.StaticTextField({
			id: "filepropModified",
			fieldLabel: "Last change",
			name: "modified",
			value: "undefined"
		});
		var created = new Ext.ux.form.StaticTextField({
			id: "filepropCreated",
			fieldLabel: "Creation time",
			name: "created",
			value: "undefined"
		});
		// Text fields for edit properties
		var editName = new Ext.form.TextField({
			id: "filepropEditName",
			fieldLabel: "File name",
			allowBlank: false,
			name: "name",
			anchor: "90%",
			value: "undefined"
		});
		var editTitle = new Ext.form.TextField({
			id: "filepropEditTitle",
			fieldLabel: "Title",
			allowBlank: true,
			name: "title",
			anchor: "90%",
			value: "undefined"
		});
		var editAuthor = new Ext.form.TextField({
			id: "filepropEditAuthor",
			fieldLabel: "Author",
			allowBlank: true,
			name: "author",
			anchor: "90%",
			value: "undefined"
		});
		var editDescription = new Ext.form.TextArea({
			id			:	"filepropEditDescription",
			fieldLabel	:	"Description",
			allowBlank	:	true,
			autoScroll	:	true,
			name		:	"description",
			anchor		:	"90%",
			value		:	"undefined"
		});
		var hiddenNodeId = new Ext.form.Hidden({
			id		:	"filepropEditNodeId",
			name	:	"nodeId"
		});
		// VERSIONS GRID	
		var versionsGrid = new Ext.grid.GridPanel({
			id				:	"versionsGrid",
			width			:	700,
			height			:	400,
			deferredRender	:	false,
			store : new Ext.data.Store({
				// set proxy before load
				reader : new Ext.data.JsonReader({
					root			:	"rows",
					totalProperty	:	"total",
					id				:	"nodeId",
					fields			:	[
									         {name: "label", type:"string"},
									         {name: "name", type:"string"},
									         {name: "created", type:"string"},
									         {name: "author", type:"string"},
									         {name: "downloadLink", type:"string"},
									         {name: "description", type:"string"}
								         ]
				})
			}),
			columns			:	[
							        {header: "Version", width: 60, sortable: true, dataIndex: "label"},
							        {header: "Download Link", width: 100, sortable: false, dataIndex: "downloadLink", renderer: function(value, column, record){return "<a href=\""+value+"\" target=\"_blank\" title=\""+record.get("name")+", Version "+record.get("label")+"\" >Download</a>";}},
							        {header: "Description", width: 310, sortable: false, dataIndex: "description"},
							        {header: "Uploaded by", width: 70, sortable: false, dataIndex: "author"},
							        {header: "Created on", width: 120, sortable: false, dataIndex: "created", renderer: DoCASU.App.Utils.timeZoneAwareRenderer}
						        ],
          sm				:	new Ext.grid.RowSelectionModel({singleSelect:true}),
          frame				:	false
		});
		// CATEGORIES GRID	
		var categoriesGrid = new Ext.grid.GridPanel({
			id				:	"categoriesGrid",
			width			:	700,
			height			:	400,
			deferredRender	:	false,
			store : new Ext.data.Store({
				// set proxy before load
				reader : new Ext.data.JsonReader({
					root			:	"rows",
					totalProperty	:	"total",
					id				:	"nodeId",
					fields			:	[
									         {name: "id", type:"string"},
									         {name: "text", type:"string"}
								        ]
				})
			}),
			columns			:	[
							         {header: "Category", width: 200, sortable: true, dataIndex: "text"},
							         {header: "Actions", width: 100, sortable: false, dataIndex: "actions", renderer: function(value, column, record){if(!Ext.getCmp("filepropEditName").disabled){return "<a href=\"#\" onclick=\"removeCategory('"+Ext.getCmp("filepropEditNodeId").getValue()+"','"+record.get("id")+"'); return false;\"><img title=\"Delete\" class=\"actionIcon\" src=\"../../docasu/images/delete.gif\"/></a>";}}}
			          			],
	        sm				:	new Ext.grid.RowSelectionModel({singleSelect:true}),
	        frame			:	false
		});
		// create form panel
		var showDetailsPanel = new Ext.form.FormPanel({
			id			:	"fileDetailsPanel",
			title		:	"File details",
			frame		:	false,
			baseCls		:	"x-plain",
			labelWidth	:	100,
			items		:	[name, mimetype, title, description, parent, author, size, creator, created, modifier, modified],
			listeners	:	{
								activate: function() { 
									Ext.getCmp("fileDetailsSaveButton").hide();
									Ext.getCmp("mailtoButton").show();
									Ext.getCmp("favoritesButton").show();  
								}
							}
		});
		// Panel with grid for file versions, if exist
		var versionsPanel = new Ext.Panel({
			id			:	"versionsPanel",
			title		:	"Versions",
			frame		:	false,
			baseCls		:	"x-plain",
			labelWidth	:	75,
			bodyStyle	:	"padding: 0px",
			layout		:	"fit",
			items		:	[versionsGrid],
			listeners	:	{
								activate: function() { 
									Ext.getCmp("fileDetailsSaveButton").hide();
									Ext.getCmp("mailtoButton").show();
									Ext.getCmp("favoritesButton").show();  
								}
							}
		});
		// Panel with grid for document categories, if exist
		var categoriesPanel = new Ext.Panel({
			id			:	"categoriesPanel",
			title		:	"Categories",
			frame		:	false,
			baseCls		:	"x-plain",
			labelWidth	:	75,
			bodyStyle	:	"padding: 0px",
			layout		:	"fit",
			items		:	[categoriesGrid],
			listeners	:	{
								activate : function() { 
									Ext.getCmp("fileDetailsSaveButton").hide();
									Ext.getCmp("mailtoButton").show();
									Ext.getCmp("favoritesButton").show();  
								}
							}
		});
		var editDetailsPanel = new Ext.form.FormPanel({
			id			:	"filePropertiesForm",
			title		:	"Edit Properties",
			frame		:	false,
			fileUpload	:	true,
			baseCls		:	"x-plain",
			labelWidth	:	75,
			bodyStyle	:	"padding: 15px",
			defaults	:	{
								anchor		:	"-15",
								submitValue	:	true
							},
			items		:	[editName, editTitle, editDescription, editAuthor, hiddenNodeId],
			listeners	:	{
								activate : function() { 
									Ext.getCmp("fileDetailsSaveButton").show();
									Ext.getCmp("mailtoButton").hide();
									Ext.getCmp("favoritesButton").hide();   
								}
							}
		});
		var uiConfig	=	{
								id				:	this.id,
								width			:	500,
								height			:	500,
								layout			:	"fit",
								modal			:	true,
								iconCls			:	"icon-grid",
								animCollapse	:	false,
								constrainHeader	:	true,
								resizable		:	false,
								closeAction		:	"hide",
								buttonAlign		:	"center",
								items			:	[
														{
															xtype		:	"tabpanel",
															id			:	"fileDetailsTabPanel",
															plain		:	true,
															activeTab	:	0,
															defaults	:	{bodyStyle:"padding:10px"},
															items		:	[
																				showDetailsPanel, 
																				versionsPanel, 
																				categoriesPanel, 
																				editDetailsPanel
																			]
														}
													], // eo items
								buttons			:	[
														{
															text		:	"Save",
															id			:	"fileDetailsSaveButton",
															handler : function() {
																var savePropertiesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SaveDocumentPropertiesAction", "DoCASU.App.Core");
																savePropertiesAction.on("beforesave", function(component) {
																	new Ext.LoadMask(Ext.getBody()).show();
																});
																savePropertiesAction.on("aftersave", function(component) {
																	new Ext.LoadMask(Ext.getBody()).hide();
																	var fileDetailsWindow = DoCASU.App.PluginManager.getPluginManager().getUIWidget("FileDetailsComponent");
																	fileDetailsWindow.close();
																	var centerView = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
																	var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
																	loadFolderAction.load(centerView.getCurrentFolder());
																});
																savePropertiesAction.on("fail", function(component) {
																	new Ext.LoadMask(Ext.getBody()).hide();
																	var fileDetailsWindow = DoCASU.App.PluginManager.getPluginManager().getUIWidget("FileDetailsComponent");
																	fileDetailsWindow.close();
																	var centerView = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
																	var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
																	loadFolderAction.load(centerView.getCurrentFolder());
																});		
																savePropertiesAction.save(Ext.getCmp("filepropEditNodeId").getValue(), Ext.getCmp("filePropertiesForm").getForm().getEl());
															}
														}, 
														{
															text	:	"Add to favorites",
															id		:	"favoritesButton",
															handler : function() {
																var addFavoriteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("AddFavoriteAction", "DoCASU.App.Core");
																addFavoriteAction.on("beforesave", function(component) {
																	var fileDetailsWindow = DoCASU.App.PluginManager.getPluginManager().getUIWidget("FileDetailsComponent");
																	fileDetailsWindow.close();
																});
																addFavoriteAction.save(Ext.getCmp("filepropEditNodeId").getValue());
															}
														}, 
														{
															text	:	"Mail Link",
															id		:	"mailtoButton"
														}
													] // eo buttons
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration	
	
	show : function(nodeId, canEditProp) {
		// init the window
		this.init();
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		// access the record set of the file in the grid
		var centerViewComponent;
		try {
			centerViewComponent = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		var store = centerViewComponent.getLayout().activeItem.store;
		var record = store.getById(nodeId);
		// store the nodeId of this file
		this.setSelectedFile(nodeId);
		// store parent folder
		this.setParentFolder(record.get("parentId"));
		// do UI modifications
		Ext.getCmp("mailtoButton").setHandler(function() {DoCASU.App.Utils.mailLink(record.get("name"), record.get("link"));});
		Ext.getCmp("filepropName").setValue(record.get("name"));
		Ext.getCmp("filepropTitle").setValue(record.get("title"));
		Ext.getCmp("filepropSize").setValue(record.get("size"));
		Ext.getCmp("filepropMimetype").setValue(record.get("mimetype"));
		Ext.getCmp("filepropParentPath").setValue(record.get("parentPath"));
		Ext.getCmp("filepropDescription").setValue(record.get("description"));
		Ext.getCmp("filepropAuthor").setValue(record.get("author"));
		Ext.getCmp("filepropCreator").setValue(record.get("creator"));
		Ext.getCmp("filepropModifier").setValue(record.get("modifier"));
		Ext.getCmp("filepropModified").setValue(record.get("modified"));
		Ext.getCmp("filepropCreated").setValue(record.get("created"));
		Ext.getCmp("filepropVersion").setValue(record.get("version"));
		Ext.getCmp("filepropEditName").setValue(record.get("name"));
		Ext.getCmp("filepropEditDescription").setValue(record.get("description"));
		Ext.getCmp("filepropEditAuthor").setValue(record.get("author"));
		Ext.getCmp("filepropEditNodeId").setValue(record.get("nodeId"));
		Ext.getCmp("filepropEditTitle").setValue(record.get("title"));
		// load versions grid if versioning is enabled
	    if (record.get("versionable")) {
	        Ext.getCmp("versionsPanel").enable();
	        var versionsStore = Ext.getCmp("versionsGrid").getStore();
	        versionsStore.proxy = new Ext.data.HttpProxy({
				url: "ui/node/versions/" + record.get("nodeId"),
				method: "GET"
			}),
	        versionsStore.load();
	    } else {
	        Ext.getCmp("versionsPanel").disable();
	    }
	    // load categories grid
	    var categoriesStore = Ext.getCmp("categoriesGrid").getStore();
	    categoriesStore.proxy = new Ext.data.HttpProxy({
			url: "ui/node/categories/" + record.get("nodeId"),
			method: "GET"
		}),
	    categoriesStore.load();
	    Ext.getCmp("fileDetailsSaveButton").hide();
		Ext.getCmp("fileDetailsTabPanel").setActiveTab(Ext.getCmp("fileDetailsPanel"));
		Ext.getCmp("fileDetailsPanel").doLayout();
	    // enable/disable properties
		var fileName = Ext.getCmp("filepropEditName");
		var fileTitle = Ext.getCmp("filepropEditTitle");
		var fileDesc = Ext.getCmp("filepropEditDescription");
		(canEditProp) ? fileName.enable() : fileName.disable();
		(canEditProp) ? fileTitle.enable() : fileTitle.disable();
		(canEditProp) ? fileDesc.enable() : fileDesc.disable();
		uiWidget.setTitle(record.get("nameIcon"));
		uiWidget.show();
	}, // eo show
	
	getSelectedFile : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".selectedFile");
	}, // eo getSelectedFile
	
	setSelectedFile : function(nodeId) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".selectedFile", nodeId);
	}, // eo setSelectedFile
	
	getParentFolder : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".parentFolder");
	}, // eo getParentFolder
	
	setParentFolder : function(folderId) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".parentFolder", folderId);
	} // eo setParentFolder

}); // eo DoCASU.App.Core.FileDetailsComponent

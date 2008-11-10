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


// CenterViewComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.CenterViewComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.CenterViewComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.CenterViewComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"CenterViewComponent",
	title		:	"Center View Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		/* Data store for the file grid in the main content section */
		var gridStore = new Ext.data.Store({
			remoteSort	:	true,
			proxy		:	new Ext.data.HttpProxy({
								url : "ui/folder/docs",
								method : "GET"
							}),
	        reader		:	new Ext.data.JsonReader({
					            root			:	"rows",
					            totalProperty	:	"total",
					            id				:	"nodeId",
								fields			:	[
														{name:"created",			type:"string"},
														{name:"author",				type:"string"},
														{name:"creator",			type:"string"},
														{name:"description",		mapping:"description"},
														{name:"parentId",			type:"string"},
														{name:"parentPath",			type:"string"},
														{name:"mimetype",			type:"string"},
														{name:"url",				type:"string"},
														{name:"downloadUrl",		type:"string"},
														{name:"modified",			type:"string"},
														{name:"modifier",			type:"string"},
														{name:"name",				type:"string"},
														{name:"nodeId",				type:"string"},
														{name:"link",				type: "string"},
														{name:"size",				type:"int"},
														{name:"title",				type:"string"},
														{name:"version",			type:"string"},
														{name:"versionable",		type:"boolean"},
														{name:"writePermission",	type:"boolean"},
														{name:"createPermission",	type:"boolean"},
														{name:"deletePermission",	type:"boolean"},
														{name:"locked",				type:"boolean"},
														{name:"editable",			type:"boolean"},
														{name:"isWorkingCopy",		type:"boolean"},
														{name:"iconUrl",			type:"string"},
														{name:"icon32Url",			type:"string"},
														{name:"icon64Url",			type:"string"},
														{name:"isFolder",			type:"boolean"}
										            ]
							})
		});
		gridStore.on("load", function() {
			var searchQuery = null;
			var folderName = gridStore.reader.jsonData.folderName;
			var folderId = gridStore.reader.jsonData.folderId;
			if(gridStore.baseParams.nodeId != null) {
				//showFolderView(folderId, folderName);
			} else {
				//showCategoryView(folderName);
			}
		});
		gridStore.on("loadexception", function(proxy, options, response, error) {
			var searchQuery = null;
			// check response for errors
			if(DoCASU.App.Error.checkHandleErrors("Failed to load content", response)) {
				return;
			}
			Ext.MessageBox.alert("Error", "Failed to display contents");
		});
		gridStore.setDefaultSort("name", "asc");
		var fileSelectionModel = new Ext.grid.RowSelectionModel({singleSelect:true});
		fileSelectionModel.on("rowselect", function (grid, rowIndex) {
	    	// this event fires when a row is selected in the grid
	        //updateDocumentInfoPane();
	    });
	    var gridList = new Ext.grid.GridPanel({
	        id			:	"folderView",
			store		:	gridStore,
		    columns		:	[
						        {id:"nodeId", header: "Name", width: 110, sortable: true, dataIndex: "name", renderer: DoCASU.App.Utils.fileNameRenderer},
						        {header: "Size", width: 20, sortable: true, dataIndex: "size", renderer: Ext.util.Format.fileSize}, 
						        {header: "Changed", width: 60, sortable: true, dataIndex: "modified", renderer: DoCASU.App.Utils.timeZoneAwareRenderer},
						        {header: "Created", width: 60, sortable: true, dataIndex: "created", renderer: DoCASU.App.Utils.timeZoneAwareRenderer},
								{header: "Creator", width: 60, sortable: true, dataIndex: "creator"},
						        {header: "Action",  sortable: false, dataIndex: "nodeId", renderer: DoCASU.App.Utils.actionRenderer}
						    ],
		    viewConfig	:	{forceFit:true},
			bbar		:	new Ext.PagingToolbar({
					            pageSize	:	50,
					            store		:	gridStore,
					            displayInfo	:	true,
					            displayMsg	:	"Displaying file(s) {0} - {1} of {2}",
					            emptyMsg	:	"No files to display"
					        }),
		    sm			:	fileSelectionModel
		});
		gridList.on("contextmenu", function(e) {
	        e.preventDefault();
	        // if on a category
			/*if (gridStore.baseParams.categoryId == null) {
				this.contextMenu = getFolderContextMenu(Ext.state.Manager.get("currentFolder"), Ext.state.Manager.get("currentFolderProperties"));
				var xy = e.getXY();
				this.contextMenu.showAt(xy);
			}*/
	    });
	    gridList.on("rowcontextmenu", function (grid, rowIndex, e) {
	    	e.preventDefault();	
	    	// select row
	    	/*fileSelectionModel.selectRow(rowIndex, false);
	        var record = grid.getStore().getAt(rowIndex);
	        if (record.get("isFolder")) {
	        	var myRecord = new Object("Node "+record.get("nodeId"));
	        	myRecord.id = record.get("nodeId");
	        	myRecord.text = record.get("name");
				myRecord.name = record.get("name");
				myRecord.parentPath = record.get("parentPath");
				myRecord.link = record.get("link");
				myRecord.url = record.get("url");
				myRecord.writePermission = record.get("writePermission");
				myRecord.createPermission = record.get("createPermission");
				myRecord.deletePermission = record.get("deletePermission");
	        	this.contextMenu = getFolderContextMenu(record.get("nodeId"), myRecord);
	        }
	        else {
	        	this.contextMenu = getFileContextMenu(record);
	        }
	        var xy = e.getXY();
			this.contextMenu.showAt(xy);*/
	    });
	    gridList.on("mouseover", function(e, t) {
	    	var rowIndex = this.getView().findRowIndex(t);
	    	var component = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
	    	if (rowIndex === false) {
	        	component.hideToolTip();
	    	} else {
	    		component.showToolTip(this.store.getAt(rowIndex));
	    	}
	    });
	    gridList.on("render", function (panel) {
			var tooltip = new Ext.ToolTip({
				id				:	panel.id + "ToolTip",
				target			:	panel.id,
				trackMouse		:	true,
				renderTo		:	Ext.getBody(),
				showDelay		:	500,
				hideDelay		:	0,
				dismissDelay	:	5000
			});
			// disable tooltip on empty rows
			tooltip.on("beforeshow", function(tooltip) {
				if (tooltip.noData) {
					return false;
				}
		    });
		});
		var uiConfig	=	{
								// config
								id			:	this.id,
								// look
								region		:	"center",
								layout		:	"card",
								defaults	:	{border:false},
								activeItem	:	0,
								items		:	[gridList/*, _initSearchResultsView()*/]
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.CenterViewComponent.superclass.init.apply(this, arguments);
		
		// register listener for CenterHeaderComponent.userloaded
		var centerHeader = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterHeaderComponent", "DoCASU.App.Core");
		centerHeader.on("userloaded", function(component) {
			// TODO: replace document.getElementById with something cross browser
			var initialFolderId = document.getElementById("initialFolderId");
			if(initialFolderId.value != "") {
				// a folder id was passed in the URL
			} else {
				// default to company home
				initialFolderId.value = component.getUser().companyHome;
			}
			var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
			loadFolderAction.load(initialFolderId.value);
		});
	},
	
	getToolTip : function() {
		var uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		var toolTipId = uiWidget.items.items[0].id + "ToolTip";
		return Ext.getCmp(toolTipId);
	},
	
	showToolTip : function(row) {
		var size = row.get("size");	size = Ext.util.Format.fileSize(size);
		var created = row.get("created"); created = DoCASU.App.Utils.timeZoneAwareRenderer(created);
		var modified = row.get("modified"); modified = DoCASU.App.Utils.timeZoneAwareRenderer(modified);
		var data = {
			name		:	row.get("name"),
			title		:	row.get("title"),
			mimetype	:	row.get("mimetype"),
			description	:	row.get("description"),
			path		:	row.get("path"),
			author		:	row.get("author"),
			version		:	row.get("version"),
			size		:	size,
			creator		:	row.get("creator"),
			created		:	created,
			modifier	:	row.get("modifier"),
			modified	:	modified
		};	
		var tpl = new Ext.Template(
			"<b>{name}</b><br/>"+
			"Title: {title}<br/>"+
			"Description: {description}<br/>"+
			"Version: {version}<br/>"+
			"Author: {author}<br/>"+
			"Creator: {creator}<br/>"+
			"Modifier: {modifier}<br/>"+
			"MIME: {mimetype}<br/>"+
			"Size: {size}<br/>"+
			"Created: {created}<br/>"+
			"Modified: {modified}<br/>"
		);
		var toolTip = this.getToolTip();
		tpl.overwrite(toolTip.body, data);
		toolTip.noData = false;
		toolTip.show(); // reset the counter for dismissDelay to 0
	}, // eo showToolTip
	
	hideToolTip : function() {
		var toolTip = this.getToolTip();
		toolTip.noData = true;
		toolTip.hide();
	}

}); // eo DoCASU.App.Core.CenterViewComponent

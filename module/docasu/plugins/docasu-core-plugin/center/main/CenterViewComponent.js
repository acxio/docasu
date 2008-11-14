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
		var folderViewListConfig = this.getFolderViewListConfig();
		var searchViewListConfig = this.getSearchViewListConfig();
		var uiConfig	=	{
								// config
								id			:	this.id,
								// look
								region		:	"center",
								layout		:	"card",
								defaults	:	{border:false},
								activeItem	:	0,
								items		:	[folderViewListConfig, searchViewListConfig]
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	getFolderViewListConfig : function() {
		// data store for the file grid in the main content section
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
		gridStore.on("beforeload", function(store, options) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		gridStore.on("load", function(store, records, options) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var folderName = store.reader.jsonData.folderName;
			var folderId = store.reader.jsonData.folderId;
			var component = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
			if(store.baseParams.nodeId != null) {
				component.showFolderView(folderId, folderName);
			} else {
				component.showCategoryView(folderName);
			}
		});
		gridStore.on("loadexception", function(proxy, options, response, error) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.Error.checkHandleErrors("Failed to load content", response);
			// TODO: redirect to My Home folder
		});
		gridStore.setDefaultSort("name", "asc");
		var fileSelectionModel = new Ext.grid.RowSelectionModel({singleSelect:true});
	    var gridList = new Ext.grid.GridPanel({
	        id			:	"folderView",
			store		:	gridStore,
		    columns		:	[
						        {id:"nodeId", header: "Name", width: 110, sortable: true, dataIndex: "name", renderer: this.fileNameRenderer},
						        {header: "Size", width: 20, sortable: true, dataIndex: "size", renderer: Ext.util.Format.fileSize}, 
						        {header: "Changed", width: 60, sortable: true, dataIndex: "modified", renderer: DoCASU.App.Utils.timeZoneAwareRenderer},
						        {header: "Created", width: 60, sortable: true, dataIndex: "created", renderer: DoCASU.App.Utils.timeZoneAwareRenderer},
								{header: "Creator", width: 60, sortable: true, dataIndex: "creator"},
						        {header: "Action",  sortable: false, dataIndex: "nodeId", renderer: this.actionRenderer}
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
		return gridList;
	}, // eo getFolderViewListConfig
	
	getSearchViewListConfig : function() {
		/* Data store for the file grid in the main content section */
		var gridStore = new Ext.data.Store({
			remoteSort	:	true,
			proxy		:	new Ext.data.HttpProxy({
								url : "ui/search",
								method : "GET"
							}),
	        reader		:	new Ext.data.JsonReader({
					            root			:	"rows",
					            totalProperty	:	"total",
					            id				:	"nodeId",
								fields: [
											{name: 'created', type:'string'},
											{name: 'author', type:'string'},
											{name: 'creator', type:'string'},
											{name: 'description', mapping:'description'},
											{name: 'parentId', type:'string'},
											{name: 'parentPath', type:'string'},
											{name: 'mimetype', type:'string'},
											{name: 'url', type:'string'},
											{name: 'downloadUrl', type:'string'},
											{name: 'modified', type:'string'},
											{name: 'modifier', type:'string'},
											{name: 'name', type:'string'},
											{name: 'nodeId', type:'string'},
											{name: 'link', type: 'string'},
											{name: 'size', type:'int'},
											{name: 'title', type:'string'},
											{name: 'version', type:'string'},
											{name: 'versionable', type:'boolean'},
											{name: 'writePermission', type:'boolean'},
											{name: 'createPermission', type:'boolean'},
											{name: 'deletePermission', type:'boolean'},
											{name: 'locked', type:'boolean'},
											{name: 'editable', type:'boolean'},
											{name: 'isWorkingCopy', type:'boolean'},
											{name: 'iconUrl', type:'string'},
											{name: 'icon32Url', type:'string'},
											{name: 'icon64Url', type:'string'},
											{name: 'isFolder', type:'boolean'}
								         ]
							})
		});
		gridStore.on("beforeload", function(store, options) {
			var centerViewComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
			// TODO:  add missing params for paging
			/*for (var param in store.params) {
				options.params[param] = store.params[param];
			}*/			
			// TODO: validate the parameters
			/*
			var message = centerViewComponent.validateSearchParameters(options);
			if(message.length > 0) {
				// invalid search parameters
				Ext.MessageBox.show({
					title: 'Invalid search parameters',
					msg: message,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
				return false;
			}*/
			Ext.MessageBox.show({
				msg				:	"Search",
				progressText	:	"Processing...",
				width			:	200,
				wait			:	true,
				waitConfig		:	{interval:200},
				icon			:	Ext.MessageBox.INFO
			});		
		});
		gridStore.on("load", function(store, records, options) {
			Ext.MessageBox.hide();
		});
		gridStore.on("loadexception", function(proxy, options, response, error) {
			Ext.MessageBox.hide();
			DoCASU.App.Error.checkHandleErrors("Failed to perform search", response);
		});
		gridStore.setDefaultSort("name", "asc");
	    var gridList = new Ext.grid.GridPanel({
	        id			:	"searchList",
			store		:	gridStore,
		    columns		:	[
						        {id:"nodeId", header: "Name", width: 110, sortable: true, dataIndex: "name", renderer: this.fileNameRenderer},
						        {header: "Path",  width: 180, sortable: false, dataIndex: "parentPath", renderer: this.parentPathRenderer},
						        {header: "Size", width: 20, sortable: true, dataIndex: "size", renderer: Ext.util.Format.fileSize}, 
						        {header: "Changed", width: 60, sortable: true, dataIndex: "modified", renderer: DoCASU.App.Utils.timeZoneAwareRenderer},
						        {header: "Created", width: 60, sortable: true, dataIndex: "created", renderer: DoCASU.App.Utils.timeZoneAwareRenderer},
								{header: "Creator", width: 60, sortable: true, dataIndex: "creator"},
						        {header: "Action",  sortable: false, dataIndex: "nodeId", renderer: this.actionRenderer}
						    ],
		    viewConfig	:	{forceFit:true},
			bbar		:	new Ext.PagingToolbar({
					            pageSize	:	50,
					            store		:	gridStore,
					            displayInfo	:	true,
					            displayMsg	:	"Displaying file(s) {0} - {1} of {2}",
					            emptyMsg	:	"No files to display"
					        }),
		    sm			:	new Ext.grid.RowSelectionModel({singleSelect:true})
		});
		
		return gridList;
	}, // eo getSearchViewListConfig
	
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
		
		var loadFolderAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core");
		loadFolderAction.on("beforeload", function(action) {
			// activate load folder results view list
			var centerViewWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
			centerViewWidget.getLayout().setActiveItem("folderView");
		});
		
		var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
		searchAction.on("beforeload", function(action) {
			// activate search results view list
			var centerViewWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
			centerViewWidget.getLayout().setActiveItem("searchList");
		});
		
		var deleteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("DeleteNodeAction", "DoCASU.App.Core");
		deleteAction.on("beforedelete", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		deleteAction.on("afterdelete", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		deleteAction.on("fail", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		
		var pasteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("PasteAllAction", "DoCASU.App.Core");
		pasteAction.on("beforepaste", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		pasteAction.on("afterpaste", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		pasteAction.on("fail", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		
		var checkinAction = DoCASU.App.PluginManager.getPluginManager().getComponent("CheckinFileAction", "DoCASU.App.Core");
		checkinAction.on("beforecheckin", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		checkinAction.on("aftercheckin", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		checkinAction.on("fail", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		
		var checkoutAction = DoCASU.App.PluginManager.getPluginManager().getComponent("CheckoutFileAction", "DoCASU.App.Core");
		checkoutAction.on("beforecheckout", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		checkoutAction.on("aftercheckout", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		checkoutAction.on("fail", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		
		var undoCheckoutAction = DoCASU.App.PluginManager.getPluginManager().getComponent("UndoCheckoutFileAction", "DoCASU.App.Core");
		undoCheckoutAction.on("beforeundocheckout", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		undoCheckoutAction.on("afterundocheckout", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		undoCheckoutAction.on("fail", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
		
		var uploadFilesComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("UploadFilesComponent", "DoCASU.App.Core");
		uploadFilesComponent.on("afterupload", function(action) {
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
		});
	},
	
	showFolderView : function(folderId, folderName) {
		// show folder icon 
		Ext.get("folderName").child("img").show();
		// show folder actions 
		this.loadPermissions(folderId); // load permissions and action dropdown
		Ext.get("folderActions").parent("div").show();
		Ext.get("folderActionsLabel").show();
		this.updateCurrentFolder(folderId);
		this.updateBreadcrumbs(folderName, folderId);
		// show folder name
		Ext.get("folderName").child("div").update(folderName);
	}, // eo showFolderView
	
	loadPermissions : function(nodeId) {
		var loadPermissionsAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderPermissionsAction", "DoCASU.App.Core");
		loadPermissionsAction.on("beforeload", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		loadPermissionsAction.on("afterload", function(action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			try {
				var jsonData = Ext.util.JSON.decode(response.responseText);
				var centerView = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
				centerView.addActionItems(jsonData);
			} catch (e) {
				Ext.MessageBox.alert("Error", "Could not read folder permissions");
			}
		});
		loadPermissionsAction.on("fail", function(action) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		loadPermissionsAction.load(nodeId);
	}, // eo loadPermissions
	
	addActionItems : function(jsonData) {
		var store = Ext.getCmp("folderActions").store;
		store.removeAll(); // remove all items from the list
		var newRec = Ext.data.Record.create([
		    {name:"code",	mapping:"code"},
		    {name:"label",	mapping:"label"}
	    ]);
		var nbRows = jsonData.total;
		var item = jsonData.rows;
		for (var i=0; i<nbRows; i++) {		
			var myNewRecord = new newRec({
			    code	:	item[i].code,
			    label	:	item[i].label
		    });
			store.add(myNewRecord);
		}
	}, // eo addActionItems
	
	updateCurrentFolder : function(folderId){
		this.setCurrentFolder(folderId);
		var loadPropertiesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderPropertiesAction", "DoCASU.App.Core");
		loadPropertiesAction.on("beforeload", function(action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		loadPropertiesAction.on("afterload", function(action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			try {
				var folder = Ext.util.JSON.decode(response.responseText);
				var myRecord = new Object("Node " + folder.nodeId);
		       	myRecord.id = folder.nodeId;
		       	myRecord.text = folder.name;
				myRecord.name = folder.name;
				myRecord.parentPath = folder.path;
				myRecord.link = folder.link;
				myRecord.url = folder.url;
				myRecord.writePermission = eval(folder.writePermission);
				myRecord.createPermission = eval(folder.createPermission);
				myRecord.deletePermission = eval(folder.deletePermission);
				var centerView = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
				centerView.setParentFolder(folder.parentId);
				centerView.setCurrentFolderProperties(myRecord);
			} catch (e) {
				Ext.MessageBox.alert("Error", "Failed to read folder properties " + e);
			}
		});
		loadPropertiesAction.on("fail", function(action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		loadPropertiesAction.load(folderId);
	}, // eo updateCurrentFolder
	
	updateBreadcrumbs : function(folderName, folderId) {
		if (typeof folderId != "undefined" && folderId != this.getBreadcrumb("breadcrumb1Id")) {
			var breadcrumbs = "";
			var tempName = this.getBreadcrumb("breadcrumb3Name");
			var tempId = this.getBreadcrumb("breadcrumb3Id");
			if (typeof tempName != "undefined") {
				breadcrumbs = "<a href=\"#\" class=\"breadcrumb\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('"+tempId+"'); return false;\">" + tempName + "</a> &gt; ";
			}
			tempName = this.getBreadcrumb("breadcrumb2Name");
			tempId = this.getBreadcrumb("breadcrumb2Id");
			if (typeof tempName != "undefined") {
				breadcrumbs += "<a href=\"#\" class=\"breadcrumb\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('"+tempId+"'); return false;\">" + tempName + "</a> &gt; ";
				this.setBreadcrumb("breadcrumb3Name", tempName);
				this.setBreadcrumb("breadcrumb3Id", tempId);
			}
			tempName = this.getBreadcrumb("breadcrumb1Name");
			tempId = this.getBreadcrumb("breadcrumb1Id");
			if (typeof tempName != "undefined") {
				breadcrumbs += "<a href=\"#\" class=\"breadcrumb\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('"+tempId+"'); return false;\">" + tempName + "</a> &gt; ";
				this.setBreadcrumb("breadcrumb2Name", tempName);
				this.setBreadcrumb("breadcrumb2Id", tempId);
			}
			breadcrumbs += "<a href=\"#\" class=\"breadcrumb\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('"+folderId+"'); return false;\">" + folderName + "</a>";
			this.setBreadcrumb("breadcrumb1Name", folderName);
			this.setBreadcrumb("breadcrumb1Id", folderId);
			// set title on main screen
			var uiWidget;
			try {
				uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("MainScreenComponent");
			} catch(err) {
				// no UI widget was created thus component is disabled or closed
				return;
			}
			uiWidget.setTitle(breadcrumbs);
		}
	}, // eo updateBreadcrumbs
	
	showCategoryView : function(categoryName) {
		// show folder icon
		Ext.get("folderName").child("img").show();
		// hide folder actions
		Ext.get("folderActions").parent("div").hide();
		Ext.get("folderActionsLabel").hide();
		// show category name
		Ext.get("folderName").child("div").update(categoryName);
	}, // eo showCategoryView
	
	getToolTip : function() {
		var uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		var toolTipId = uiWidget.items.items[0].id + "ToolTip";
		return Ext.getCmp(toolTipId);
	}, // eo getToolTip
	
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
	}, // eo hideToolTip
	
	fileNameRenderer : function(value, column, record) {
		var html = "";
		if (record.get("isFolder")) {
			html += "<a href=\"#\" onClick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('"+record.get("nodeId")+"'); return false;\">";
		} else {
			html += "<a href=\""+record.get("downloadUrl")+"\">";
		}
		html += "<div style=\"float: left; cursor: pointer;\">";
		if (record.get("isFolder")) {
			html += "<img src=\"../../docasu/lib/extjs/resources/images/default/tree/folder.gif\"";
		} else {
			html += "<img src=\""+record.get("iconUrl")+"\"";
		}
		html += " alt=\""+record.get("name")+"\"";
		html += "</div>";
		html += "<span>&nbsp;"+record.get("name")+"</span>";
		html += "</a>";
	    return html;
	}, // eo fileNameRenderer
	
	actionRenderer : function(value, column, record) {
		var centerView = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
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
			return centerView.createActionItemsForFolder(myRecord)[1];
		}
		else {
			return centerView.createActionItems(record)[1];
		}
	}, // eo actionRenderer
	
	createActionItems : function(record) {
		var result = new Array();
		var html = "";
	
		result.push({
			 text: "Show infos",
			 icon: "../../docasu/images/info.gif",
			 handler: function() { DoCASU.App.PluginManager.getPluginManager().getComponent("FileDetailsComponent", "DoCASU.App.Core").show(record.get("nodeId"), record.get("writePermission"));}
		});
		html += 
			"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('FileDetailsComponent', 'DoCASU.App.Core').show('"+record.get("nodeId")+"','"+record.get("writePermission")+"'); return false;\">"+
				"<img title=\"Show infos\" class=\"actionIcon\" src=\"../../docasu/images/info.gif\"/>"+
			"</a>";
		
		if (!record.get("locked")) {
			if (record.get("writePermission")) {
				if (record.get("editable")) {
					result.push({
						text: "Edit",
						icon: "../../docasu/images/edit.gif",
						handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("EditContentComponent", "DoCASU.App.Core").show(record.get("name"), record.get("nodeId"));}
					});
					html += 
						"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('EditContentComponent', 'DoCASU.App.Core').show('"+record.get("name")+"','"+record.get("nodeId")+"'); return false;\">"+
							"<img title=\"Edit\" class=\"actionIcon\" src=\"../../docasu/images/edit.gif\"/>"+
						"</a>";
				}
		   		if (record.get("createPermission")) {
		   			if (record.get("isWorkingCopy")) {
		   				result.push({
		   					text: "Checkin",
		   					icon: "../../docasu/images/checkin.gif",
		   					handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("CheckinFileAction", "DoCASU.App.Core").checkin(record.get("nodeId"));}
		   				});
						html += 
							"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('CheckinFileAction', 'DoCASU.App.Core').checkin('"+record.get("nodeId")+"'); return false;\">"+
								"<img title=\"Checkin\" class=\"actionIcon\" src=\"../../docasu/images/checkin.gif\"/>"+
							"</a>";
		   				result.push({
		   					text: "Undo checkout",
		   					icon: "../../docasu/images/undo_checkout.gif",
		   					handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("UndoCheckoutFileAction", "DoCASU.App.Core").undoCheckout(record.get("nodeId"));}
		   				});
						html += 
							"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('UndoCheckoutFileAction', 'DoCASU.App.Core').undoCheckout('"+record.get("nodeId")+"'); return false;\">"+
								"<img title=\"Undo checkout\" class=\"actionIcon\" src=\"../../docasu/images/undo_checkout.gif\"/>"+
							"</a>";
		   			}
		   			else {
		   				result.push({
		   					text: "Checkout",
		   					icon: "../../docasu/images/checkout.gif",
		   					handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("CheckoutFileAction", "DoCASU.App.Core").checkout(record.get("nodeId"));}
		   				});
		   				html += 
							"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('CheckoutFileAction', 'DoCASU.App.Core').checkout('"+record.get("nodeId")+"'); return false;\">"+
								"<img title=\"Checkout\" class=\"actionIcon\" src=\"../../docasu/images/checkout.gif\"/>"+
							"</a>";
		   				if (record.get("deletePermission")) {
		   					result.push({
		    					text: "Delete",
		    					icon: "../../docasu/images/delete.gif",
		    					handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core").deleteFile(record.get("name"), record.get("nodeId"));}
		   					});
		   					html += 
	   							"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('CenterViewComponent', 'DoCASU.App.Core').deleteFile('"+record.get("name")+"','"+record.get("nodeId")+"'); return false;\">"+
	   								"<img title=\"Delete\" class=\"actionIcon\" src=\"../../docasu/images/delete.gif\"/>"+
	   							"</a>";
		   				}
		   			}
		   		}
		   		result.push({
					 text: "Update",
					 icon: "../../docasu/images/update.gif",
					 handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("UpdateFileComponent", "DoCASU.App.Core").show(record.get("name"), record.get("nodeId"));}
		   		});
		   		html += 
					"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('UpdateFileComponent', 'DoCASU.App.Core').show('"+record.get("name")+"','"+record.get("nodeId")+"'); return false;\">"+
						"<img title=\"Update\" class=\"actionIcon\" src=\"../../docasu/images/update.gif\"/>"+
					"</a>";
				result.push({
					 text: "Categorization",
					 icon: "../../docasu/images/categories.gif",
					 handler: function() {showSelectCategoryWindow(record.get("nodeId"));}
			   	});
			}
		   	result.push({
				 text: "Copy",
				 icon: "../../docasu/images/copy.gif",
				 handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("ClipboardComponent", "DoCASU.App.Core").copyLink(record.get("iconUrl"), record.get("name"), record.get("nodeId"));}
		   	});
		   	html += 
				"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('ClipboardComponent', 'DoCASU.App.Core').copyLink('"+record.get("iconUrl")+"',' "+record.get("name")+"',' "+record.get("nodeId")+"'); return false;\">"+
					"<img title=\"Copy\" class=\"actionIcon\" src=\"../../docasu/images/copy.gif\"/>"+
				"</a>";
	    }
		
		var returnValue = new Array(result, html);
		return returnValue;
	}, // eo createActionItems
	
	createActionItemsForFolder : function(record) {
		var id = record.id;
		var result = new Array();
		var html = "";
		
		result.push({
			text: "View details",
			icon: "../../docasu/images/info.gif",
			handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("FolderDetailsComponent", "DoCASU.App.Core").show(record.id);}
		});
		html += "<a href=\"#\" onClick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('FolderDetailsComponent', 'DoCASU.App.Core').show('"+record.id+"'); return false;\">"+
					"<img title=\"View details\" class=\"actionIcon\" src=\"../../docasu/images/info.gif\"/>"+
				"</a>";
		if (record.createPermission) {
			result.push({
				text: "Create folder",
				handler: function() {createFolder(id);}
			});
		}
		if (record.deletePermission) {
			result.push({
				text: "Delete folder",
				icon: "../../docasu/images/delete.gif",
				handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core").deleteFolder(record.name, record.id);}
			});
			html += 
				"<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('CenterViewComponent', 'DoCASU.App.Core').deleteFolder('"+record.name+"','"+record.id+"'); return false;\">"+
					"<img title=\"Delete\" class=\"actionIcon\" src=\"../../docasu/images/delete.gif\"/>"+
				"</a>";
		}
		if (record.writePermission) {
			result.push({
				text: "Rename folder",
				handler: function() {renameFolder(id);}
			});
		}
		if (record.createPermission) {
			result.push({
				text: "Paste all",
				handler: function() {DoCASU.App.PluginManager.getPluginManager().getComponent("PasteAllAction", "DoCASU.App.Core").paste(id);}
			});
			result.push({
				text: "Create HTML content",
				handler: function() {createContent("HTML", id);}
			});
			result.push({
				text: "Create text content",
				handler: function() {createContent("text", id);}
			});	
			result.push({
				text: "Upload file(s)",
				handler: function() {showUploadFile(id);}
			});	
		}
			
		var returnValue = new Array(result, html);
		return returnValue;
	}, // eo createActionItemsForFolder
	
	deleteFile : function(fileName, nodeId) {
		Ext.Msg.confirm("Confirm file deletion", "Are you sure you want to delete the file '" + fileName + "' ?", function(btn, text) {
			if (btn == "yes") {
				var deleteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("DeleteNodeAction", "DoCASU.App.Core");
				deleteAction.on("afterdelete", function(action, response) {
					DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
				});
				deleteAction.deleteNode(nodeId);
			}
		});
	}, // eo deleteFile
	
	deleteFolder : function(folderName, nodeId) {
		Ext.Msg.confirm("Confirm folder deletion", "Are you sure you want to delete the folder '" + folderName + "' and all it's contains ?", function(btn, text) {
			if (btn == "yes") {
				var deleteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("DeleteNodeAction", "DoCASU.App.Core");
				deleteAction.deleteNode(nodeId);
			}
		});
	}, // eo deleteFolder
	
	parentPathRenderer : function (value, column, record) {
		return '<a href="#" onclick="DoCASU.App.PluginManager.getPluginManager().getComponent(\'LoadFolderAction\', \'DoCASU.App.Core\').load(\''+ record.get('parentId') +'\'); return false;">' + record.get('parentPath') + '</a>';
	}, // eo parentPathRenderer

 	validateSearchParameters: function (params) {
		// validate query
		var query = null;
		alert('boo:'+params.q);
		if (params.q != undefined && params.q.length > 0) {
			query = params.q;
		} 
		if (query == null) {
			return "Missing search term!";
		}
		
		// validate dates
		var createdFrom = null;
		var createdTo = null;
		var modifiedFrom = null;
		var modifiedTo = null;
		if (params.createdFrom != undefined && params.createdFrom.length > 0) {
			createdFrom = Date.parse(params.createdFrom);
		}
		if (params.createdTo != undefined && params.createdTo.length > 0) {
			createdTo = Date.parse(params.createdTo);
		}
		if (params.modFrom != undefined && params.modFrom.length > 0) {
			modifiedFrom = Date.parse(params.modFrom);
		}
		if (params.modTo != undefined && params.modTo.length > 0) {
			modifiedTo = Date.parse(params.modTo);
		}
		//alert("dates:"+createdFrom+","+createdTo+","+modifiedFrom+","+modifiedTo+";");
		if(createdFrom != null &&  createdTo != null && createdTo < createdFrom) {
			// if createdTo is before createdFrom 
			return "'Created Before' date cannot be set before 'Created After' date!";
		}
		if(modifiedFrom != null &&  modifiedTo != null && modifiedTo < modifiedFrom) {
			// if modifiedTo is before modifiedFrom 
			return "'Modified Before' date cannot be set before 'Modified After' date!";
		}
		if(createdFrom != null &&  modifiedTo != null && modifiedTo < createdFrom) {
			// if modifiedTo is before createdFrom 
			return "'Modified Before' date cannot be set before 'Created After' date!";
		}
	
		return "";
	}, // eo validateSearchParameters
	
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
	}, // eo setParentFolder
	
	getCurrentFolderProperties : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".currentFolderProperties");
	}, // eo getCurrentFolderProperties
	
	setCurrentFolderProperties : function(folderProperties) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".currentFolderProperties", folderProperties);
	}, // eo setCurrentFolderProperties
	
	getBreadcrumb : function(key) {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".Breadcrumbs." + key);
	}, // eo getBreadcrumb
	
	setBreadcrumb : function(key, value) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".Breadcrumbs." + key, value);
	} // eo setBreadcrumb

}); // eo DoCASU.App.Core.CenterViewComponent

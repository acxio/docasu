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


// SearchListComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.SearchListComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.SearchListComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.SearchListComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"SearchListComponent",
	title		:	"Search List Component",
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
			// TODO:  add missing params for paging
			/*for (var param in store.params) {
				options.params[param] = store.params[param];
			}*/			
			// TODO: validate the parameters
			/*var searchListComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchListComponent", "DoCASU.App.Core");
			var message = searchListComponent.validateSearchParameters(options);
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
			// TODO: redirect to My Home folder
		});
		gridStore.setDefaultSort("name", "asc");
		var fileSelectionModel = new Ext.grid.RowSelectionModel({singleSelect:true});
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
		    sm			:	fileSelectionModel
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
		DoCASU.App.Core.SearchListComponent.superclass.init.apply(this, arguments);
		
		// register listener for CenterHeaderComponent.userloaded
		var centerHeader = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchListComponent", "DoCASU.App.Core");
		centerHeader.on("userloaded", function(component) {
			var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
			searchAction.search();
		});
	},

	actionRenderer : function(value, column, record) {
		var centerView = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
		return centerView.actionRenderer(value, column, record);
	}, // eo actionRenderer
	
	fileNameRenderer : function(value, column, record) {
		var centerView = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterViewComponent", "DoCASU.App.Core");
		return centerView.fileNameRenderer(value, column, record);
	}, // eo fileNameRenderer	
	
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
	}
		
}); // eo DoCASU.App.Core.SearchListComponent

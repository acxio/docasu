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


/*
 * Add category to node
 */
function addCategory(nodeId, categoryId) {
	Ext.Ajax.request({
		url: 'ui/node/category/'+nodeId+'?categoryId='+categoryId,
		method: 'PUT',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to add category to node', response)) {
				return;
			}
			// notify success to user
			var jsonData = Ext.util.JSON.decode(response.responseText);
			Ext.MessageBox.alert('Success', jsonData.msg);
		},
		failure: function(response, options) {
			handleFailureMessage('Failed to add category to node', response);
		}
	});
}

/*
 * Remove category from node
 */
function removeCategory(nodeId, categoryId) {
	Ext.Ajax.request({
		url: 'ui/node/category/'+nodeId+'?categoryId='+categoryId,
		method: 'DELETE',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to remove category from node', response)) {
				return;
			}
			// reload categories grid
			var store = Ext.getCmp('categoriesGrid').getStore();
		    store.reload();
		},
		failure: function(response, options) {
			handleFailureMessage('Failed to remove category from node', response);
		}
	});
}

/**
 * Show a window with file information &
 * a tab to edit properties
 * @param Object fileRecordSet
 */
function showFileDetailsWindow(fileRecordSet) {
	
	// Only create new window with content if doesn't exist
	if (!Ext.getCmp('fileDetailsWindow')) {
		_initFileDetailsWindow();
	}

	// fill the existing window with new values
	Ext.getCmp('mailtoButton').setHandler(function() {
		parent.location='mailto:?subject=mailing:%20'+fileRecordSet.get('name')+'&body=' + escape('<a href="'+location.protocol + '//' + location.host + fileRecordSet.get('link')+'">'+fileRecordSet.get('name')+'</a>');
		});
	Ext.getCmp('filepropName').setValue(fileRecordSet.get('name'));
	Ext.getCmp('filepropTitle').setValue(fileRecordSet.get('title'));
	Ext.getCmp('filepropSize').setValue(fileRecordSet.get('size'));
	Ext.getCmp('filepropMimetype').setValue(fileRecordSet.get('mimetype'));
	Ext.state.Manager.set('parentFolderId', fileRecordSet.get('parentId'));
	Ext.getCmp('filepropParentPath').setValue(fileRecordSet.get('parentPath'));
	Ext.getCmp('filepropDescription').setValue(fileRecordSet.get('description'));
	Ext.getCmp('filepropAuthor').setValue(fileRecordSet.get('author'));
	Ext.getCmp('filepropCreator').setValue(fileRecordSet.get('creator'));
	Ext.getCmp('filepropModifier').setValue(fileRecordSet.get('modifier'));
	Ext.getCmp('filepropModified').setValue(fileRecordSet.get('modified'));
	Ext.getCmp('filepropCreated').setValue(fileRecordSet.get('created'));
	Ext.getCmp('filepropVersion').setValue(fileRecordSet.get('version'));
	// File the values of edit properties pane
	Ext.getCmp('filepropEditName').setValue(fileRecordSet.get('name'));
	Ext.getCmp('filepropEditDescription').setValue(fileRecordSet.get('description'));
	Ext.getCmp('filepropEditAuthor').setValue(fileRecordSet.get('author'));
	Ext.getCmp('filepropEditNodeId').setValue(fileRecordSet.get('nodeId'));
	Ext.getCmp('filepropEditTitle').setValue(fileRecordSet.get('title'));

    // If there are version, load versions grid
    if (fileRecordSet.get('versionable')) {
        Ext.getCmp('versionsPanel').enable();
        var store = Ext.getCmp('versionsGrid').getStore();
        store.proxy = new Ext.data.HttpProxy({
							url: 'ui/node/versions/'+fileRecordSet.get('nodeId'),
							method: 'GET'
						}),
        store.load();
    } else {
        Ext.getCmp('versionsPanel').disable();
    }
    
    // load categories grid
    var store = Ext.getCmp('categoriesGrid').getStore();
    store.proxy = new Ext.data.HttpProxy({
			url: 'ui/node/categories/'+fileRecordSet.get('nodeId'),
			method: 'GET'
		}),
    store.load();
    
    Ext.getCmp('fileDetailsSaveButton').hide();
	// set icon and file name as window title
	Ext.getCmp('fileDetailsWindow').setTitle(fileRecordSet.get('nameIcon'));
	// select the file details pane in case the edit pane is active
	Ext.getCmp('fileDetailsTabPanel').setActiveTab(Ext.getCmp('fileDetailsPanel'));

	Ext.getCmp('fileDetailsPanel').doLayout();
		
}


function updateFile(name, id) {

	var win = new Ext.Window({
         width:280
		,minWidth:265
        ,id:'winid'
        ,height:220
		,minHeight:200
        ,layout:'fit'
        ,border:false
        ,closable:true
        ,title:'Update File '+ name
		,iconCls:'icon-upload'
		,items:[{
			  xtype:'uploadpanel'
			 ,buttonsAt:'tbar'
			 ,id:'uppanel'
			 ,url:'ui/node/content/update/' + id // nodeId of the update file
			 ,method:'POST'
			 ,maxFileSize:1048576
			 ,enableProgress:false // not implemented yet
			 ,singleUpload:false // upload a file at a time
			 ,maxFiles:1 // upload a single file
		}]
    });
    win.show();
    
    var uploadPanel = win.items.map.uppanel;
	uploadPanel.on('allfinished', function (obj) {
		reloadView(true);		
	});
	
}



function deleteFile(fileName, nodeId) {
	Ext.Msg.confirm("Confirm file deletion","Are you sure you want to delete the file " + fileName + " ?", function(btn, text) {	
    	if (btn == 'yes') {
			Ext.Ajax.request({
				url: 'ui/node/' + nodeId,
				method: 'DELETE',
				success: function(response, options) {
					// check response for errors
					if(checkHandleErrors('Failed to delete file', response)) {
						return;
					}
					if (searchQuery != null) {
						// if delete is performed on a search result
						var store = Ext.getCmp('searchResultsView').getStore();
						store.params = searchQuery.form.getValues(false);
						store.load(searchQuery.options);
					} else {
						clearDocumentInfoPane();
						gridStore.load();
					}
				},
				failure: function(response, options) {
					handleFailureMessage('Failed to delete file', response);
				}
	    	});
		}
	});
}


function showUploadFile(folder) {

	var win = new Ext.Window({
         width:280
		,minWidth:265
        ,id:'winid'
        ,height:220
		,minHeight:200
        ,layout:'fit'
        ,border:false
        ,closable:true
        ,title:'Upload Content'
		,iconCls:'icon-upload'
		,items:[{
			  xtype:'uploadpanel'
			 ,buttonsAt:'tbar'
			 ,id:'uppanel'
			 ,url:'ui/node/content/upload/' + folder // nodeId of the parent folder
			 ,method:'POST' 
			 ,maxFileSize:1048576
			 ,enableProgress:false // not implemented yet - check progress.get.js
			 ,progressUrl:'ui/node/content/progress'
			 ,singleUpload:false // upload a file at a time - to allow multiple uploads at a time, adjust addcontent.post.js
		}]
    });
    win.show();
    
    var uploadPanel = win.items.map.uppanel;
    //debugger;
	uploadPanel.on('allfinished', function (obj) {
		reloadView(true);		
	});

}

/**
 * Put the given file on the clipboard
 * @param {String} icon: path to the icon
 * @param {String} name
 * @param {String} nodeId
 */
function copyLink(icon, name, nodeId) {
	clipboard.put(icon, name, nodeId);
	clipboard.update();
}


/**
 * File checkin
 */
function checkinFile(nodeId) {
	Ext.Ajax.request({
		url: 'ui/node/checkin/'+nodeId,
		method: 'PUT',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to checkin file', response)) {
				return;
			}
			updateDocumentInfoPane();
			gridStore.load();
		},
		failure: function(response, options) {
			handleFailureMessage('Failed to checkin file', response);
		}
	});
}

/**
 * File checkout
 */
function checkoutFile(nodeId) {
	Ext.Ajax.request({
		url: 'ui/node/checkout/'+nodeId,
		method: 'PUT',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to checkout file', response)) {
				return;
			}
			gridStore.load();
		},
		failure: function(response, options) {
			handleFailureMessage('Failed to checkout file', response);
		}
	});
}

/**
 * Undo file checkout
 */
function undoCheckout(nodeId) {
	Ext.Ajax.request({
		url: 'ui/node/checkout/'+nodeId,
		method: 'DELETE',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to undo checkout file', response)) {
				return;
			}
			updateDocumentInfoPane();
			gridStore.load();
		},
		failure: function(response, options) {
			handleFailureMessage('Failed to undo checkout file', response);
		}
	});
}


/**
 * Call method to open a popup window with file informations
 * @param {String} nodeId
 * @param {boolean} canEditProp
 */
function showFileInfos(nodeId, canEditProp){
	// Access the record set of the file in the grid
	var record = gridStore.getById(nodeId);
	// Store the nodeId of this file
	Ext.state.Manager.set("selectedFileId", nodeId);
	
	showFileDetailsWindow(record);
	var fileName = Ext.getCmp('filepropEditName');
	var fileTitle = Ext.getCmp('filepropEditTitle');
	var fileDesc = Ext.getCmp('filepropEditDescription');
	(canEditProp) ? fileName.enable() : fileName.disable();
	(canEditProp) ? fileTitle.enable() : fileTitle.disable();
	(canEditProp) ? fileDesc.enable() : fileDesc.disable();

	Ext.getCmp('fileDetailsWindow').show();
}

function _initFileDetailsWindow() {

	// Text fields for displaying file properties
	var name = new Ext.ux.form.StaticTextField({
		id: 'filepropName',
		fieldLabel: 'Name',
		name: 'name',
		value: 'none'
	});

	var title = new Ext.ux.form.StaticTextField({
		id: 'filepropTitle',
		fieldLabel: 'Title',
		name: 'title',
		value: 'undefined'
	});

	var mimetype = new Ext.ux.form.StaticTextField({
		id: 'filepropMimetype',
		fieldLabel: 'Content Type',
		name: 'mimetype',
		value: 'undefined'
	});

	var size = new Ext.ux.form.StaticTextField({
		id: 'filepropSize',
		fieldLabel: 'Size',
		name: 'size',
		value: 'undefined'
	});

	var parent = new Ext.ux.form.StaticTextField({
		id: 'filepropParentPath',
		fieldLabel: 'Parent Folder',
		autoHeight: true,
		value: 'undefined'
	});
	
	parent.on('render', function (parent) {
		Ext.get('filepropParentPath').addClass('link');
		Ext.get('filepropParentPath').on('click', function () {
			Ext.getCmp('fileDetailsWindow').hide();
			loadParentFolder();
		});
	});

	var description = new Ext.form.TextArea({
		id: 'filepropDescription',
		fieldLabel: 'Description',
		allowBlank: true,
		name: 'description',
		anchor: '90%',
		submitValue: false,
		readOnly: true,
		value: 'undefined'
	});

	var version = new Ext.ux.form.StaticTextField({
		id: 'filepropVersion',
		fieldLabel: 'Version',
		name: 'version',
		value: 'undefined'
	});

	var author = new Ext.ux.form.StaticTextField({
		id: 'filepropAuthor',
		fieldLabel: 'Author',
		name: 'author',
		value: 'undefined'
	});

	var creator = new Ext.ux.form.StaticTextField({
		id: 'filepropCreator',
		fieldLabel: 'Creator',
		name: 'creator',
		value: 'undefined'
	});

	var modifier = new Ext.ux.form.StaticTextField({
		id: 'filepropModifier',
		fieldLabel: 'Modifier',
		name: 'modifier',
		value: 'undefined'
	});

	var modified = new Ext.ux.form.StaticTextField({
		id: 'filepropModified',
		fieldLabel: 'Last change',
		name: 'modified',
		value: 'undefined'
	});

	var created = new Ext.ux.form.StaticTextField({
		id: 'filepropCreated',
		fieldLabel: 'Creation time',
		name: 'created',
		value: 'undefined'
	});

	// Text fields for edit properties
	var editName = new Ext.form.TextField({
		id: 'filepropEditName',
		fieldLabel: 'File name',
		allowBlank: false,
		name: 'name',
		anchor: '90%',
		value: 'undefined'
	});

	var editTitle = new Ext.form.TextField({
		id: 'filepropEditTitle',
		fieldLabel: 'Title',
		allowBlank: true,
		name: 'title',
		anchor: '90%',
		value: 'undefined'
	});

	var editAuthor = new Ext.form.TextField({
		id: 'filepropEditAuthor',
		fieldLabel: 'Author',
		allowBlank: true,
		name: 'author',
		anchor: '90%',
		value: 'undefined'
	});

	var editDescription = new Ext.form.TextArea({
		id: 'filepropEditDescription',
		fieldLabel: 'Description',
		allowBlank: true,
		autoScroll: true,
		name: 'description',
		anchor: '90%',
		value: 'undefined'
	});

	var hiddenNodeId = new Ext.form.Hidden({
		id: 'filepropEditNodeId',
		name: 'nodeId'
	});

	// VERSIONS GRID	
	var versionsGrid = new Ext.grid.GridPanel({
		id: 'versionsGrid',
		width: 700,
		height: 400,
		deferredRender:false,
		store: new Ext.data.Store({
			/*set proxy before load()*/

			reader: new Ext.data.JsonReader({
				root: 'rows',
				totalProperty: 'total',
				id: 'nodeId',
				fields: [
				         {name: 'label', type:'string'},
				         {name: 'name', type:'string'},
				         {name: 'created', type:'string'},
				         {name: 'author', type:'string'},
				         {name: 'downloadLink', type:'string'},
				         {name: 'description', type:'string'}
				         ]
			})
		}),
		columns: [
		          {header: "Version", width: 60, sortable: true, dataIndex: 'label'},
		          {header: "Download Link", width: 100, sortable: false, dataIndex: 'downloadLink', renderer:function(value, column, record){return '<a href="'+value+'" target="_blank" title="'+record.get("name")+', Version '+record.get("label")+'" >Download</a>';}},
		          {header: "Description", width: 310, sortable: false, dataIndex: 'description'},
		          {header: "Uploaded by", width: 70, sortable: false, dataIndex: 'author'},
		          {header: "Created on", width: 120, sortable: false, dataIndex: 'created', renderer: timeZoneAwareRenderer}
		          ],
		          sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
		          frame: false
	});
	
	// CATEGORIES GRID	
	var categoriesGrid = new Ext.grid.GridPanel({
		id: 'categoriesGrid',
		width: 700,
		height: 400,
		deferredRender:false,
		store: new Ext.data.Store({
			/*set proxy before load()*/

			reader: new Ext.data.JsonReader({
				root: 'rows',
				totalProperty: 'total',
				id: 'nodeId',
				fields: [
				         {name: 'id', type:'string'},
				         {name: 'text', type:'string'}
				         ]
			})
		}),
		columns: [
		          {header: "Category", width: 200, sortable: true, dataIndex: 'text'},
		          {header: "Actions", width: 100, sortable: false, dataIndex: 'actions', renderer:function(value, column, record){if(!Ext.getCmp('filepropEditName').disabled){return '<a href="#" onclick="removeCategory(\''+Ext.getCmp('filepropEditNodeId').getValue()+'\',\''+record.get("id")+'\')"><img title="Delete" class="actionIcon" src="../../docasu/images/delete.gif"/></a>';}}}
		          ],
        sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
        frame: false
	});

	// create form panel
	var showDetailsPanel = new Ext.form.FormPanel({
		id: 'fileDetailsPanel',
		title: "File details",
		frame: false,
		baseCls: 'x-plain',
		labelWidth: 100,
		items: [name, mimetype, title, description, parent, author, size, creator, created, modifier, modified],

		listeners: {activate: function() { 
		Ext.getCmp('fileDetailsSaveButton').hide();
		Ext.getCmp('mailtoButton').show();
		Ext.getCmp('favoritesButton').show();  
	}}
	});


	// Panel with grid for file versions, if exist
	var versionsPanel = new Ext.Panel({
		id: 'versionsPanel',
		title: "Versions",
		frame: false,
		baseCls: 'x-plain',
		labelWidth: 75,
		bodyStyle: 'padding: 0px',
		layout: 'fit',
		items: [ versionsGrid ],
		listeners: { activate: function() { 
			Ext.getCmp('fileDetailsSaveButton').hide();
			Ext.getCmp('mailtoButton').show();
			Ext.getCmp('favoritesButton').show();  
		}}
	});
	
	// Panel with grid for document categories, if exist
	var categoriesPanel = new Ext.Panel({
		id: 'categoriesPanel',
		title: "Categories",
		frame: false,
		baseCls: 'x-plain',
		labelWidth: 75,
		bodyStyle: 'padding: 0px',
		layout: 'fit',
		items: [ categoriesGrid ],
		listeners: { activate: function() { 
			Ext.getCmp('fileDetailsSaveButton').hide();
			Ext.getCmp('mailtoButton').show();
			Ext.getCmp('favoritesButton').show();  
		}}
	});

	var editDetailsPanel = new Ext.form.FormPanel({
		id: 'filePropertiesForm',
		title: "Edit Properties",
		frame: false,
		fileUpload: true,
		baseCls: 'x-plain',
		labelWidth: 75,
		bodyStyle: 'padding: 15px',
		defaults: {
			anchor: '-15',
			submitValue: true
		},
		items: [editName, editTitle, editDescription, editAuthor, hiddenNodeId],
		listeners: {activate: function() { 
			Ext.getCmp('fileDetailsSaveButton').show();
			Ext.getCmp('mailtoButton').hide();
			Ext.getCmp('favoritesButton').hide();   
		}}
	});

	new Ext.Window({
		id: 'fileDetailsWindow',
		title: '',
		width: 500,
		height: 500,
		layout: 'fit',
		modal: true,
		iconCls: 'icon-grid',
		animCollapse: false,
		constrainHeader: true,
		resizable: false,
		closeAction: 'hide',
		buttonAlign: 'center',
		items: [{
			xtype: 'tabpanel',
			id: "fileDetailsTabPanel",
			plain: true,
			activeTab: 0,
			//height: 330,
			defaults: {
				bodyStyle: 'padding:10px'
			},
			items: [showDetailsPanel, versionsPanel, categoriesPanel, editDetailsPanel]
		}],
		buttons: [{
			text: 'Save',
			id: 'fileDetailsSaveButton',
			handler: function(){
				Ext.Ajax.request({
					url: 'ui/node/properties/' + Ext.getCmp('filepropEditNodeId').getValue(),
					method: 'POST',
					form: Ext.getCmp('filePropertiesForm').getForm().getEl(),
					success: function(response, options) {
						Ext.getCmp('fileDetailsWindow').close();
						// check response for errors
						if(checkHandleErrors('Failed to update document properties', response)) {
							return;
						}
						gridStore.on('load', updateDocumentInfoPane);
						gridStore.load();
					}, 
					failure: function(response, options) {
						Ext.getCmp('fileDetailsWindow').close();
						handleFailureMessage('Failed to update document properties', response);
					}
				});
			}
		}, {
			text: 'Add to favorites',
			id: 'favoritesButton',
			handler: function() {
				var n = Ext.getCmp('filepropEditNodeId').getValue();
				Ext.getCmp('fileDetailsWindow').close();
				addFavorite(n);
			}
		}, {
			text: 'Mail Link',
			id: 'mailtoButton',
			handler: function() {
				mailLink(fileRecordSet.get('name'), fileRecordSet.get('link'));
			}
		}]
	});
}


function showSelectCategoryWindow(nodeId) {
	Ext.state.Manager.set("addToNodeId", nodeId);
	Ext.state.Manager.set("addCategoryId", null);
	
	// Tree for add category window
	var addCategoryTreeLoader = new Ext.tree.TreeLoader({
		dataUrl: 'ui/categories',
		requestMethod: 'GET'
	});
	addCategoryTreeLoader.on('loadexception', function(treeLoader, node, response) {
		// check for session expiration
		if(sessionExpired(response)) {
			// reload docasu
			window.location = 'ui';
			return;
		}
		handleFailureMessage('Failed to load sub-categories', response);
	});
	var addCategoryTree = new Ext.tree.TreePanel({
		id: 'addCategoryTree',
		border: false,
		frame: false,				
		enableDD: false, // Allow tree nodes to be moved (dragged and dropped)
		autoScroll: true,
		containerScroll: true,
		deferredRender: false,
		loader: addCategoryTreeLoader,
		// this adds a root node to the tree and tells it to expand when it is rendered
		root: new Ext.tree.AsyncTreeNode({
			id: Ext.state.Manager.get('categoryId'),
			text: 'Categories',
			draggable: false,
			expanded: true
		}),
		rootVisible: false
	});
	// in case the tree is modfied via the standard Alfresco GUI, it needs to be reloaded
	addCategoryTree.on('beforecollapsenode', function (node, deep, anim) {	
		node.loaded = false;
	});		
	addCategoryTree.addListener('click', function (node, event) {
		Ext.state.Manager.set("addCategoryId", node.id);
	});
	
	var addCategoryTreeContainer = new Ext.Panel({
		id: 'addCategoryTreeContainer',
		layout: 'fit',
		border: false,
		autoScroll: true,
		items: [addCategoryTree]
	});

	var acWindow = new Ext.Window({
		id: 'addCategoryWindow',
		title: '<b>Select Category</b>',
		width: 500,
		height: 500,
		layout: 'fit',
		modal: true,
		resizable: false,
		draggable: true,
		closeAction: 'destroy',
		buttonAlign: 'center',
		items:	[addCategoryTreeContainer],
		buttons: [
					{
						text: 'Add',
						id: 'addCategoryButton',
						handler: function() {
							// check if any category was selected
							var categoryId = Ext.state.Manager.get('addCategoryId');
							if(!categoryId || categoryId == null) {
								Ext.MessageBox.show({
									title: 'Error',
									msg: 'You must select a category first',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
								return false;
							}
							// add category to node
							var addToNodeId = Ext.state.Manager.get('addToNodeId');
							addCategory(addToNodeId, categoryId);
						}
					}, {
						text: 'Cancel',
						id: 'cancelButton',
						handler: function() {acWindow.destroy();}
					}
				]
	});
	acWindow.show();
}

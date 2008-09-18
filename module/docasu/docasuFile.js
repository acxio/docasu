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
        store.baseParams.nodeId = fileRecordSet.get('nodeId');
        store.load();
    } else {
        Ext.getCmp('versionsPanel').disable();
    }
    
    Ext.getCmp('fileDetailsSaveButton').hide();
	// set icon and file name as window title
	Ext.getCmp('fileDetailsWindow').setTitle(fileRecordSet.get('nameIcon'));
	// select the file details pane in case the edit pane is active
	Ext.getCmp('fileDetailsTabPanel').setActiveTab(Ext.getCmp('fileDetailsPanel'));

	Ext.getCmp('fileDetailsPanel').doLayout();
		
}

function updateFile(name, id) {
	var fileField = new Ext.form.TextField({
		name: 'file',
		inputType: 'file',
		hideLabel: true
	});
	
	var uploadForm = new Ext.form.FormPanel({
		title: "Choose file",
		width: 200,
		frame: false,
		fileUpload: true,
		items: [fileField,
			new Ext.form.Hidden({
				name: 'nodeId',
				value: id
			})],
		method: 'POST',
		buttons: [new Ext.Button({
			text: "Upload",
			handler: updateFileHandler
			})]
	});
	
	var updateFileWindow = new Ext.Window({
		id: 'updateFile',
		title: 'Update File: ' + name,
		width: 300,
		height: 200,
		x: 200,
		y: 200,
		iconCls: 'icon-grid',
		shim: false,
		animCollapse: false,
		constrainHeader: true,
		items: [uploadForm],
		layout: 'fit',
		modal: true
	});
	
	updateFileWindow.show();
					
	function updateFileHandler() {
		Ext.Ajax.request({
			url: 'ui/updatefile',
			method: 'POST',
			form: uploadForm.getForm().el,
			success: function(response, options){
					gridStore.on('load', updateDocumentInfoPane);
					gridStore.load();
					updateFileWindow.close();
					// TODO: update panels
		
			},
			failure: function(){Ext.MessageBox.alert('Failed to upload file')}
		});
	}
}



function deleteFile(fileName, nodeId) {

	Ext.Msg.confirm("Confirm file deletion","Are you sure to delete the file " + fileName + " ?", function(btn, text) {	
    	if (btn == 'yes') {
			Ext.Ajax.request({
				url: 'ui/node/remove',
				params: {nodeId : nodeId},
				method: 'GET',
				success: function(response, options) {
					
					var result = eval('('+response.responseText+')');
					
					if (!result.success) {
						Ext.MessageBox.alert('Failed', 'Failed to delete file. The following error occurred:\n\n' + result.msg);
					}
					
					if (advancedSearchQuery != "") {
												
						Ext.Ajax.request({
							url: 'ui/as',
							method: 'GET',
							params: advancedSearchQuery,
							success: function(response, options){
								clearDocumentInfoPane();
								var responseObj = Ext.util.JSON.decode(response.responseText);
								loadSearchResults(responseObj);
								
							},
							failure: function(){
								Ext.MessageBox.alert('Failed', 'Failed to display search results of advanced search');
							}
						});
					
					} else if (simpleSearchQuery != ""){	
						
						Ext.Ajax.request({
							url: 'ui/ss',
							method: 'GET',
							params: 'q=' + simpleSearchQuery,
							success: function(response, options){
								clearDocumentInfoPane();
								var responseObj = Ext.util.JSON.decode(response.responseText);
								loadSearchResults(responseObj);
						    }, 
		    				failure: function(){	
								Ext.MessageBox.alert('Failed', 'Failed to display search results of simple search');
		    				}
						});

					} else {
						clearDocumentInfoPane();
						gridStore.load();
					}
				},
				failure: function(response, options){
					Ext.MessageBox.alert('Failed', 'Failed to delete file.\n\n' + response.responseText);
				}
	    	});
		}
	});
		
}

function showNewUploadFile(folder) {

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
			 ,url:'ui/fileupload'
			 ,path:folder // nodeId for the upload folder
			 ,maxFileSize:1048576
			 ,enableProgress:false // not implemented yet
			 ,progressUrl:'ui/progress'
			 ,singleUpload:false // upload a file at a time - to allow multiple uploads at a time, adjust fileupload.post.js and progress.post.js
		}]
    });
    win.show();
    
    var uploadPanel = win.items.map.uppanel;
    //debugger;
	uploadPanel.on('allfinished', function (obj) {
		reloadView(true);		
	});

}

/*
 * Use The New File Upload Implementation !
 * TODO: remove this when upload ticket is closed
 */
function showUploadFile(folder) {

	showNewUploadFile(folder);
	return;

	var fileField = new Ext.form.TextField({
		name: 'file',
		inputType: 'file',
		hideLabel: true
	});
	
	var uploadForm = new Ext.form.FormPanel({
		title: "Choose file",
		id: 'uploadForm',
		width: 200,
		frame: false,
		fileUpload: true,
		items: [fileField,
			new Ext.form.Hidden({
				name: 'folder',
				value: folder
			})],
		method: 'POST',
		buttons: [new Ext.Button({
			text: "Upload",
			handler: uploadHandler
			})]
	});
	
	var uploadContentWindow = new Ext.Window({
		id: 'uploadContent',
		title: 'Upload Content',
		width: 300,
		height: 200,
		x: 200,
		y: 200,
		iconCls: 'icon-grid',
		shim: false,
		animCollapse: false,
		constrainHeader: true,
		items: [uploadForm],
		layout: 'fit',
		modal: true
	});
	
	uploadContentWindow.show();
					
	function uploadHandler() {
		Ext.Ajax.request({
			url: 'ui/ac',
			method: 'POST',
			form: uploadForm.getForm().el,
			success: function(response, options) {
				Ext.getCmp('uploadContent').close();
				reloadView(true);
				// TODO the webscript fails but the upload works. We don't understand why yet.
//				if (response.responseText == '"ok"') {
//					// TODO: update all panels !!
//					reloadView(true);
//				}
//				else {
//					if (response.responseText == '"duplicate"') {
//						Ext.MessageBox.alert('File already exists.');
//					}
//					else {
//						if (response.responseText == '"generror"') {
//							Ext.MessageBox.alert('A general error occurred.');
//						}
//						else {
//							Ext.MessageBox.alert('A unknown error occurred.');
//						}
//					}
//				}
			},
			failure: function(){ Ext.MessageBox.alert('Failed to upload file'); }
		});
	}
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

function checkoutFile(nodeId) {
				
	Ext.Ajax.request({
		url: 'ui/node/checkout/'+nodeId,
		method: 'PUT',
		success: function(result, request){
			gridStore.load();
		},
		failure: function(result, request){
			handleErrorMessage('Failed to checkout file', result);
		}
	});
}




function checkinFile(nodeId) {
	Ext.Ajax.request({
		url: 'ui/node/checkin/'+nodeId,
		method: 'PUT',
		success: function(result, request){
			updateDocumentInfoPane();
			gridStore.load();
		},
		failure: function(result, request){
			handleErrorMessage('Failed to checkin file', result);
		}
	});
}

function undoCheckout(nodeId) {
	Ext.Ajax.request({
		url: 'ui/node/checkout/'+nodeId,
		method: 'DELETE',
		success: function(result, request){
			updateDocumentInfoPane();
			gridStore.load();
		},
		failure: function(result, request){
			handleErrorMessage('Failed to undo checkout file', result);
		}
	});
}


function handleErrorMessage(stringMsg, result) {
		try {
			var jsonData = Ext.util.JSON.decode(result.responseText);
			if (!jsonData.success)
			{
				var message = '<b>' + stringMsg + '</b> : ' + jsonData.msg;
				if (jsonData.status.code >= 500) {
					message = message + '<br/><br/>' + 
					'<b>Status: </b>' + jsonData.status.code  +' ' + jsonData.status.name + '' + jsonData.status.description + '<br/><br/>' +
					'<b>Exception: </b>' + jsonData.exception + '<br/><br/>' +
					'<b>Server:</b> ' + jsonData.server + '<br/><br/>' +
					jsonData.time;
				}
			Ext.MessageBox.alert('Failed', message);
			return;
			}
		}
		catch (err) {
			Ext.MessageBox.alert('Failed', err + ' cannot parse error message: ' + result.responseText);
		}
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
			proxy: new Ext.data.HttpProxy({
				url: 'ui/versions',
				method: 'GET'
			}),

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

	var editDetailsPanel = new Ext.form.FormPanel({
		id: 'filePropertiesForm',
		title: "Edit Properties",
		frame: false,
		url: 'ui/updateproperties',
		method: 'POST',
		fileUpload:true,
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
			items: [showDetailsPanel, versionsPanel, editDetailsPanel]
		}],
		buttons: [{
			text: 'Save',
			id: 'fileDetailsSaveButton',
			handler: function(){
				Ext.Ajax.request({
					url: 'ui/updateproperties',
					method: 'POST',
					fileUpload: true,
					form: Ext.getCmp('filePropertiesForm').getForm().getEl(),
					success: function(response, options) {
						// document contents changed => refresh the data
						// for the currently selected document
						// Also reload the grid, since the filename might
						// have changed.
						gridStore.on('load', updateDocumentInfoPane); // !!
						gridStore.load();
						Ext.getCmp('fileDetailsWindow').close();
					}, 
					failure: function(){
						//Ext.MessageBox.alert('Must have been 4xx or a 5xx http status code');
						Ext.MessageBox.alert('Failed', 'Failed on updating properties');
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

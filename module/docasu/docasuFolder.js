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

function _initFolderDetailsWindow(folder) {
	var name = new Ext.ux.form.StaticTextField({
		id: 'folderpropName',
		fieldLabel: 'Folder name',
		name: 'name',
		value: 'undefined'
	});
	
	var parent = new Ext.ux.form.StaticTextField({
		id: 'folderpropParentPath',
		fieldLabel: 'Parent Folder',
		autoHeight: true,
		value: 'undefined'
	});
	
	parent.on('render', function (parent) {
		Ext.get('folderpropParentPath').addClass('link');
		Ext.get('folderpropParentPath').on('click', function () {
			Ext.getCmp('folderDetailsWindow').hide();
			loadParentFolder();
		});
	});
	
	var creator = new Ext.ux.form.StaticTextField({
		id: 'folderCreator',
		fieldLabel: 'Creator',
		name: 'foldercreator',
		value: 'undefined'
	});

	var modified = new Ext.ux.form.StaticTextField({
		id: 'folderpropModified',
		fieldLabel: 'Last change',
		allowBlank: false,
		name: 'modified',
		anchor: '90%',
		value: 'undefined'
	});
	
	var created = new Ext.ux.form.StaticTextField({
		id: 'folderpropCreated',
		fieldLabel: 'Creation time',
		allowBlank: false,
		name: 'created',
		anchor: '90%',
		value: 'undefined'
	});

	
	// create form panel
	var showDetailsPanel = new Ext.form.FormPanel({
		id: 'folderDetailsPanel',
		title: "Folder details",
		frame: false,
		baseCls: 'x-plain',
		labelWidth: 120,
		bodyStyle: 'padding: 15px',
		defaults: {
			anchor: '-15',
			xtype: 'statictextfield',
			submitValue: true
		},
		items: [name, parent, creator, created, modified],
		buttons: [new Ext.Button({text: 'Add to favorites', handler: function() {
			Ext.getCmp('folderDetailsWindow').hide();
			addFavorite(Ext.getCmp('folderDetailsWindow').folderId);
		}})]
	});

	new Ext.Window({
		id: 'folderDetailsWindow',
		title: '',
		width: 600,
		height: 300,
		x: 200,
		y: 200,
		iconCls: 'icon-grid',
		shim: false,
		animCollapse: false,
		constrainHeader: true,
		items: [{
			xtype: 'tabpanel',
			id: "folderDetailsTabPanel",
			plain: true,
			activeTab: 0,
			height: 235,
			defaults: {
				bodyStyle: 'padding:10px'
			},
			items: [showDetailsPanel] 
		}],
		layout: 'fit',
		modal: true
	});
}

function showFolderDetailsWindow(folderId) {
	Ext.Ajax.request({ 
		url: 'ui/folder/properties/' + folderId,
		method: 'GET',
		success: function (response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to load folder properties', response)) {
				return;
			}
			try {
				var folder = Ext.util.JSON.decode(response.responseText);
				// Only create new window with content if doesn't exist
				if (!Ext.getCmp('folderDetailsWindow')) {
					_initFolderDetailsWindow();
				}
				Ext.getCmp('folderDetailsWindow').folderId = folderId;
				Ext.getCmp('folderpropName').setValue(folder.name);
				Ext.state.Manager.set('parentFolderId', folder.parentId);
				Ext.getCmp('folderpropParentPath').setValue(folder.path);
				Ext.getCmp('folderCreator').setValue(folder.creator);
				Ext.getCmp('folderpropModified').setValue(convertTimezone(folder.modified));
				Ext.getCmp('folderpropCreated').setValue(convertTimezone(folder.created));
				Ext.getCmp('folderDetailsWindow').setTitle(folder.name); 
				Ext.getCmp('folderDetailsWindow').show();
			} catch (e) {
				Ext.MessageBox.alert('Error', 'Failed to read folder properties ' + e);
			}
		}, 
		failure: function(response, options) {
			handleFailureMessage('Failed to load folder properties', response);
		}
	});
}

function copyFolder() {
	var folderId = Ext.state.Manager.get('currentFolder');
	Ext.Ajax.request({
		url: 'ui/folder/properties/' + folderId,
		method: 'GET',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to load folder properties', response)) {
				return;
			}
			var folder = Ext.util.JSON.decode(response.responseText);
			clipboard.put(folder.icon, folder.name, folder.id);
			clipboard.update();
		}, 
		failure: function(response, options) {
			handleFailureMessage('Failed to load folder properties', response);
		}
	});
}

/**
 * Deletes a folder
 * @param {String} folderId: the folder to delete
 */
function deleteFolder(folderId) {
	Ext.Msg.confirm('Confirm Folder Delete','Do you really want to delete this folder and it\'s content?', function(btn, text){
		if (btn == 'yes'){
			Ext.Ajax.request({
				url: 'ui/node/' + folderId,
				method: 'DELETE',
				success: function(response, options) {
					// check response for errors
					if(checkHandleErrors('Failed to delete folder', response)) {
						return;
					}
					var result = Ext.util.JSON.decode(response.responseText);
           			Ext.state.Manager.set('currentFolder', result.parentId);
                   	reloadView(true);
				}, 
				failure: function(response, options) {
					handleFailureMessage('Failed to delete folder', response);
				}
			});	
			
	    }
	});
}

/**
 * Create a folder
 */
function createFolder(folderId) {
	Ext.Msg.prompt('New folder','Please enter the folder name', function(btn, folderName){
    	if (btn == 'ok'){
			Ext.Ajax.request({
				url: 'ui/folder/' + folderId,
				method: 'POST',
				params: {folderName : folderName},
				success: function(response, options){
					// check response for errors
					if(checkHandleErrors('Failed to create folder', response)) {
						return;
					}
			        reloadView(true);
				}, 
				failure: function(response, options) {
					handleFailureMessage('Failed to create folder', response);
				}
			});	
	    }
	});
}

/**
 * Rename a folder
 */
function renameFolder(f) {
	Ext.Msg.prompt('Rename folder','Please enter the new folder name', function(btn, folderName){
    	if (btn == 'ok'){
			Ext.Ajax.request({
				url: 'ui/node/name/' + f + '?newName=' + folderName,
				method: 'PUT',
				success: function(response, options) {
					// check response for errors
					if(checkHandleErrors('Failed to rename folder', response)) {
						return;
					}
					reloadView(true);
				}, 
				failure: function(response, options) {
					handleFailureMessage('Failed to rename folder', response);
				}
			});
	    }
	});
}
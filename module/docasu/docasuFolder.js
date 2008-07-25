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
	Ext.Ajax.request({ url: 'ui/folderproperties',
		method: 'GET',
		params: {folderId : folderId},
		success: function (response, options) {
			try {
				var folder = eval(response.responseText);
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
				// If the response isn't valid json it's probably the login page because the session timed out.
				// Redirect the user to force a new login.
				// TODO: not good. (#53)
				checkStatusAndReload(200);
			}
		}, 
		failure: function(response, options){
			Ext.MessageBox.alert('Failed', 'An error occurred while loading the folder properties');
		}
	});
}

function copyFolder() {
	var folderId = Ext.state.Manager.get('currentFolder');
	Ext.Ajax.request({
		url: 'ui/folderproperties',
		method: 'GET',
		params: {folderId : folderId},
		success: function(response, options){
			// TODO: check new response format
			// TODO: check for session timeout
			_copyFolder(response.responseText);
		}, 
		failure: function(){
			Ext.MessageBox.alert('Failed', 'An error occured while loading the folder');
		}
	});
}

function _copyFolder(data) {
	var folder = eval(data);
	clipboard.put(folder.icon,folder.name , folder.id);
	clipboard.update();
}

/**
 * deletes a folder
 * @param {String} folderId: the folder to delete
 */
function deleteFolder(folderId) {
	
	Ext.Msg.confirm('Confirm Folder Delete','Do you really want to delete this folder and its content?', function(btn, text){
		if (btn == 'yes'){
			var treeNode = getMyHomeTree().getNodeById(folderId);
			Ext.state.Manager.set('currentFolder', treeNode.parentNode.id);
			Ext.Ajax.request({
				url: 'ui/node/remove',
				method: 'GET',
				params: {nodeId : folderId},
				success: function(response, options){
					try {
						var result = eval(response);

	                    if (!result.success) {
							Ext.MessageBox.alert('Failed', 'Failed to delete file. The following error occurred:\n\n' + response.msg);
						} else {
	                    	reloadTree(true);
	                    }
                    
                    } catch (e) {
                		// TODO: not good. (#53)
                		checkStatusAndReload(200);
                    }
				}, 
				failure: function(response, options){
					Ext.MessageBox.alert('Failed', 'Failed to delete folder.\n\n');
					//Ext.MessageBox.alert('Delete Folder failed!');
				}
			});	
			
	    }
	});
}

/**
 * create a folder
 */
function createFolder(folderId) {
	
	Ext.Msg.prompt('New folder','Please enter the folder name?', function(btn, folderName){
    	if (btn == 'ok'){
			Ext.Ajax.request({
				url: 'ui/createFolder',
				method: 'GET',
				params: {folderId : folderId, folderName : folderName},
				success: function(response, options){
					// TODO: check new response format
					// TODO: check for session timeout
					Ext.MessageBox.alert("New folder", "New folder "+ folderName +" created");
			        reloadTree(true);
				}, 
				failure: function(){
					Ext.MessageBox.alert("New folder", "The folder "+ folderName + " couldn\'t be created!");
				}
			});	
	    }
	});
}

/**
 * Rename a folder
 */
function renameFolder(f) {
	Ext.Msg.prompt('Rename the folder','Please enter the new folder name', function(btn, folderName){
    	if (btn == 'ok'){
			
			Ext.Ajax.request({
				url: 'ui/node/rename',
				method: 'GET',
				params: {nodeId : f, newName : folderName},
				success: function(response, options){
					// TODO: check new response format
					// TODO: check for session timeout
					//Ext.MessageBox.alert("New folder "+ folderName +" renamed");
					reloadTree(true);
				}, 
				failure: function(){
					Ext.MessageBox.alert('Failed', 'The folder couldn\'t be renamed!');
				}
			});
	    }
	});
}

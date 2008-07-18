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

function _showFolderDetailsWindow(folder) {
	var folder;
	try {
		folder = eval(folder);
	} catch (e) {
		// If the response isn't valid json it's probably the login page because the session timed out.
		// Redirect the user to force a new login.
		doRedirectToUrl('ui');
	}

	var name = new Ext.ux.form.StaticTextField({
		id: 'folderpropName',
		fieldLabel: 'Folder name',
		allowBlank: false,
		name: 'name',
		anchor: '90%',
		value: folder.name
	});
	
	var path = new Ext.ux.form.StaticTextField({
		id: 'folderpropPath',
		fieldLabel: 'Path to Folder',
		allowBlank: false,
		name: 'folderpath',
		anchor: '90%',
		value: folder.path
	});
	
	var creator = new Ext.ux.form.StaticTextField({
		id: 'folderCreator',
		fieldLabel: 'Creator',
		allowBlank: false,
		name: 'foldercreator',
		anchor: '90%',
		value: folder.creator
	});

   /*var url = new Ext.ux.form.StaticTextField({
		id: 'folderUrl',
		fieldLabel: 'URL',
		allowBlank: false,
		name: 'folderurl',
		anchor: '90%',
		value: folder.url
	});*/
	
	var modified = new Ext.ux.form.StaticTextField({
		id: 'folderpropModified',
		fieldLabel: 'Last change',
		allowBlank: false,
		name: 'modified',
		anchor: '90%',
		value: convertTimezone(folder.modified)
	});
	
	var created = new Ext.ux.form.StaticTextField({
		id: 'folderpropCreated',
		fieldLabel: 'Creation time',
		allowBlank: false,
		name: 'created',
		anchor: '90%',
		value: convertTimezone(folder.created)
	});

	
	// create form panel
	var showDetailsPanel = new Ext.form.FormPanel({
		id: 'folderDetailsPane',
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
		items: [name, path, /*url,*/ creator, created, modified],
		buttons: [new Ext.Button({text: 'Add to favorites', handler: function() {
			Ext.getCmp('folderDetailsWindow').close();
			addFavorite(folder.nodeId);
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
			id: "folderDetailsPanel",
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

	Ext.getCmp('folderDetailsWindow').setTitle(folder.name); 
	Ext.getCmp('folderDetailsPanel').setActiveTab(Ext.getCmp('folderDetailsPane'));
	Ext.getCmp('folderDetailsWindow').show();
}

function showFolderDetailsWindow(folderId) {
	
	Ext.Ajax.request({
		url: 'ui/folderproperties',
		method: 'GET',
		params: 'folderId=' + folderId,
		success: function(response, options){
			//Ext.MessageBox.alert('Must have been 2xx http status code');
			
			_showFolderDetailsWindow(response.responseText);
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
		params: 'folderId=' + folderId,
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
                    	doRedirectToUrl('ui');
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

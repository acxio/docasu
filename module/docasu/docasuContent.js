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

function createContent(type, folderId) {
	
	/*
	 * Definition of the form fields
	 */
	var fileNameField = new Ext.form.TextField({
		fieldLabel: 'Filename',
		name: 'filename',
		id: 'filename',
		width: 300,
		Anchor: '100%',
		allowBlank: false
	});
	var hiddenField = new Ext.form.Hidden({
		name: 'folderId',
		value: folderId
	})
	var saveBtn = new Ext.Button ({
   		text: 'Save',
		handler: submitHandler
	});
	var cancelBtn = new Ext.Button({
		text: 'Cancel',
		handler: cancelHandler
	});
	
	if (type == 'HTML') {
		// If it's a wysiwyg editor
		var contentText = new Ext.form.HtmlEditor({
			fieldLabel: 'Content',
			name: 'content',
			id: 'content',
			height: 250,
			width: 500,
			Anchor: '100%',
			allowBlank: false
		});
		
		var contentType = new Ext.form.Hidden({
			name: 'contentType',
			value: 'HTML'
		});

		var createContentForm = new Ext.form.FormPanel({
			id: 'newContentForm',
			frame: false,
			method: 'POST',
			fileUpload: true,
			bodyStyle: 'padding:5px',
			defaults: {border: false},
			items: [
				{html: '<h3>Create your new content</h3>'},
				fileNameField,
				contentText,
				hiddenField,
				contentType
			],
			buttons: [saveBtn, cancelBtn]
		});
	} else {
		
		var contentText = new Ext.form.TextArea({
			fieldLabel: 'Content',
			name: 'content',
			id: 'content',
			height: 340,
			width: 550,
			Anchor: '100%',
			allowBlank: false
		});
		
		var contentType = new Ext.form.Hidden({
			name: 'contentType',
			value: 'TXT'
		});
		
		// If it's a simple text file to create
		var createContentForm = new Ext.form.FormPanel({
			id: 'newContentForm',
			frame: false,
			method: 'POST',
			fileUpload: true,
			bodyStyle: 'padding:5px',
			defaults: {border: false},
			items: [
				{html: '<h3>Edit content</h3>'},
				fileNameField,
				hiddenField,
				contentText,
				contentType
			],
			buttons: [saveBtn, cancelBtn]
		});
	}
		 
//	createContentForm.body.dom.firstChild.setAttribute('enctype', 'multipart/form-data');
//	var myForm = createContentForm.getForm();
	 
	//form.render(document.body);
	var createContentWindow = new Ext.Window({
		id: 'createContent',
		title: 'Content',
		width: 740,
		height: 480,
		x: 200,
		y: 200,
		iconCls: 'icon-grid',
		shim: false,
		animCollapse: false,
		constrainHeader: true,
		items: [createContentForm],
		layout: 'fit',
		modal: true
	});
	
	createContentWindow.show();
	
	/*
	 * Definition of the two handlers, submit and cancel btn
	 */
	function submitHandler() {
		Ext.Ajax.request({
			url: 'ui/node/create',
			method: 'POST',
			form: createContentForm.getForm().getEl(),
			success: function(response, options){
			
				var result = eval('(' + response.responseText + ')');

                if (result.success) {
						// TODO: update all panels !!
						// folder contents changed
					gridStore.load();
				}
                else {
            		Ext.Msg.show({
            			title:'File Creation',
            			msg: result.msg,
            			buttons: Ext.Msg.OK,
            			icon: Ext.MessageBox.ERROR
            		});
				}
				createContentWindow.close();
			}, 
			failure: function(){
				//Ext.MessageBox.alert('Must have been 4xx or a 5xx http status code');
				Ext.MessageBox.alert('Failed', 'Failed on creating content');
			}
		});
	}
	function cancelHandler() {
		createContentWindow.close();
	}
}

function editContent(fileName, nodeId) {
	
	var extension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length);

	Ext.Ajax.request({
		url: 'ui/content',
		params: 'nodeId=' + nodeId,
		method: 'GET',
		success: function(result, request){
			
 			//updateContentText.setValue(result.responseText);
			Ext.getCmp('content').setValue(result.responseText);
			updateContentWindow.show();
		},
		failure: function(result, request){
			//Ext.MessageBox.alert('Must have been 4xx or a 5xx http status code');
			Ext.MessageBox.alert('Failed', 'Failed on editing content. \n\r\n\r' + result.responseText);
		}
	});
	
	/*
	 * Definition of the form fields
	 */
	var fileNameField = new Ext.form.TextField({
		fieldLabel: 'Filename',
		name: 'filename',
		id: 'filename',
		width: 300,
		Anchor: '100%',
		allowBlank: false,
		disabled: true,
		value: fileName
	});
	var hiddenField = new Ext.form.Hidden({
		name: 'nodeId',
		value: nodeId
	})
	var saveBtn = new Ext.Button ({
   		text: 'Save',
		handler: updateHandler
	});
	var cancelBtn = new Ext.Button({
		text: 'Cancel',
		handler: cancelHandler
	});
	
	if (extension.toLowerCase() == 'html' || extension.toLowerCase() == 'htm') {
		var updateContentText = new Ext.form.HtmlEditor({
			fieldLabel: 'Content',
			name: 'content',
			id: 'content',
			height: 250,
			width: 500,
			Anchor: '100%',
			allowBlank: false
		});
		
		var editContentForm = new Ext.form.FormPanel({
			id: 'editContentForm',
			frame: false,
			method: 'POST',
			fileUpload: true,
			bodyStyle: 'padding:5px',
			defaults: {border: false},
			items: [
				{html: '<h3>Edit content</h3>'},
				fileNameField,
				hiddenField,
				updateContentText
			],
			buttons: [saveBtn, cancelBtn]
		});
		
	} else {
		var updateContentText = new Ext.form.TextArea({
			fieldLabel: 'Content',
			name: 'content',
			id: 'content',
			height: 340,
			width: 550,
			Anchor: '100%',
			allowBlank: false
		});
		var editContentForm = new Ext.form.FormPanel({
			id: 'editContentForm',
			frame: false,
			method: 'POST',
			fileUpload: true,
			bodyStyle: 'padding:5px',
			defaults: {border: false},
			items: [
				{html: '<h3>Edit content</h3>'},
				fileNameField,
				hiddenField,
				updateContentText
			],
			buttons: [saveBtn, cancelBtn]
		});
	}
		 
	var updateContentWindow = new Ext.Window({
		id: 'updateContent',
		title: 'Update Content',
		width: 740,
		height: 480,
		x: 200,
		y: 200,
		iconCls: 'icon-grid',
		shim: false,
		animCollapse: false,
		constrainHeader: true,
		items: [editContentForm],
		layout: 'fit',
		modal: true
	});
		
	
	/*
	 * Definition of the two handlers, submit and cancel btn
	 */
	function updateHandler() {
		Ext.Ajax.request({
			url: 'ui/node/update',
			method: 'POST',
			form: editContentForm.getForm().getEl(),
			success: function(response, options){
				if (extension.toLowerCase() == 'html' || extension.toLowerCase() == 'htm') {		
					fileNameField.destroy();
					hiddenField.destroy();
					updateContentText.destroy();
				}
				// TODO: update all panels !!
				// document _contents_ changed (not the metadata)
				// preview might need to be updated
				updateDocumentInfoPane();
				updateContentWindow.close();
			}, 
			failure: function(){
				//Ext.MessageBox.alert('Must have been 4xx or a 5xx http status code');
				Ext.MessageBox.alert('Failed', 'Faild on updating node');
			}
		});
	}
	function cancelHandler() {
		updateContentWindow.close();
	}
}
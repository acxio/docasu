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
			fileUpload:true,
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
			fileUpload:true,
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
	
	// Submit button handler
	function submitHandler() {
		// add extension to file name
		fileNameField.setValue(fileNameField.getValue() + '.' +contentType.getValue().toLowerCase());
		Ext.Ajax.request({
			url: 'ui/node/create/' + folderId,
			method: 'POST',
			form: createContentForm.getForm().getEl(),
			success: function(response, options) {
				createContentWindow.close();
				// check response for errors
				if(checkHandleErrors('Failed to create content', response)) {
					return;
				}
				gridStore.load();
			}, 
			failure: function(response, options) {
				createContentWindow.close();
				handleFailureMessage('Failed to create content', response);
			}
		});
	}
	
	// Cancel button handler
	function cancelHandler() {
		createContentWindow.close();
	}
}

function editContent(fileName, nodeId) {
	
	var extension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length);

	Ext.Ajax.request({
		url: 'ui/node/content/' + nodeId,
		method: 'GET',
		success: function(response, options) {
			// check for session expiration
			if(sessionExpired(response)) {
				// reload docasu
				window.location = 'ui';
				return;
			}
			Ext.getCmp('content').setValue(response.responseText);
			updateContentWindow.show();
		},
		failure: function(response, options) {
			handleFailureMessage('Failed to load document content', response);
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
			fileUpload:true,
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
			fileUpload:true,
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
		
	
	// Submit button handler
	function updateHandler() {
		Ext.Ajax.request({
			url: 'ui/node/update/' + nodeId,
			method: 'POST',
			form: editContentForm.getForm().getEl(),
			success: function(response, options){
				// check response for errors
				if(checkHandleErrors('Failed to update node', response)) {
					return;
				}
				if (extension.toLowerCase() == 'html' || extension.toLowerCase() == 'htm') {		
					fileNameField.destroy();
					hiddenField.destroy();
					updateContentText.destroy();
				}
				updateDocumentInfoPane();
				updateContentWindow.close();
			}, 
			failure: function(response, options) {
					handleFailureMessage('Failed to update node', response);
			}
		});
	}
	
	// Cancel button handler
	function cancelHandler() {
		updateContentWindow.close();
	}
}
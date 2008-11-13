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
 

// EditContentComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.EditContentComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.EditContentComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.EditContentComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"EditContentComponent",
	title		:	"Edit Content Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		var fileNameField = new Ext.form.TextField({
			fieldLabel	:	"Filename",
			name		:	"filename",
			id			:	"filename",
			width		:	300,
			Anchor		:	"100%",
			allowBlank	:	false,
			disabled	:	true,
			value		:	"at_runtime"
		});
		var hiddenField = new Ext.form.Hidden({
			name		:	"nodeId",
			value		:	"at_runtime"
		})
		var saveBtn = new Ext.Button ({
	   		text		:	"Save",
			handler : function() {
				var updateContentAction = DoCASU.App.PluginManager.getPluginManager().getComponent("UpdateFileContentAction", "DoCASU.App.Core");
				updateContentAction.on("beforeupdate", function (action) {
					new Ext.LoadMask(Ext.getBody()).show();
				});
				updateContentAction.on("afterupdate", function (action, response) {
					new Ext.LoadMask(Ext.getBody()).hide();
					/*if (extension.toLowerCase() == 'html' || extension.toLowerCase() == 'htm') {		
						fileNameField.destroy();
						hiddenField.destroy();
						updateContentText.destroy();
					}*/
					DoCASU.App.PluginManager.getPluginManager().getUIWidget("EditContentComponent").close();
				});
				updateContentAction.on("fail", function (action, response) {
					new Ext.LoadMask(Ext.getBody()).hide();
					DoCASU.App.PluginManager.getPluginManager().getUIWidget("EditContentComponent").close();
				});
				var editContentComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("EditContentComponent", "DoCASU.App.Core");
				updateContentAction.update(editContentComponent.getFileId(), Ext.getCmp("editContentForm").getForm().getEl());
			}
		});
		var cancelBtn = new Ext.Button({
			text		:	"Cancel",
			handler : function() {
				DoCASU.App.PluginManager.getPluginManager().getUIWidget("EditContentComponent").close();
			}
		});
		// default to text area and change at runtime if necessary
		var updateContentText = new Ext.form.TextArea({
			fieldLabel	:	"Content",
			name		:	"content",
			id			:	"content",
			height		:	340,
			width		:	550,
			Anchor		:	"100%",
			allowBlank	:	false
		});
		var editContentForm = new Ext.form.FormPanel({
			id			:	"editContentForm",
			fileUpload	:	true,
			bodyStyle	:	"padding:5px",
			defaults	:	{border: false},
			items		:	[
								{html	:	"<h3>Edit content</h3>"},
								fileNameField,
								hiddenField,
								updateContentText
							],
			buttons		:	[saveBtn, cancelBtn]
		});
		var uiConfig	=	{
								id				:	this.id,
								title			:	"Update Content",
								width			:	740,
								height			:	480,
								x				:	200,
								y				:	200,
								iconCls			:	"icon-grid",
								shim			:	false,
								animCollapse	:	false,
								constrainHeader	:	true,
								items			:	[editContentForm],
								layout			:	"fit",
								modal			:	true
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	show : function(fileName, fileId) {
		// init the window
		this.init();
		this.setFileId(fileId);
		this.setFileName(fileName);
		var getContentAction = DoCASU.App.PluginManager.getPluginManager().getComponent("GetFileContentAction", "DoCASU.App.Core");
		getContentAction.on("beforeget", function (action) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		getContentAction.on("afterget", function (action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var uiWidget;
			try {
				uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("EditContentComponent");
			} catch(err) {
				// no UI widget was created thus component is disabled or closed
				return;
			}
			var editContentComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("EditContentComponent", "DoCASU.App.Core");
			var fileId = editContentComponent.getFileId();
			var fileName = editContentComponent.getFileName();
			var extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
			var editContentForm = Ext.getCmp("editContentForm");
			if (extension.toLowerCase() == "html" || extension.toLowerCase() == "htm") {
				// replace the textarea with a html editor
				editContentForm.items.items[3] = new Ext.form.HtmlEditor({
					fieldLabel	:	"Content",
					name		:	"content",
					id			:	"content",
					height		:	340,
					width		:	550,
					Anchor		:	"100%",
					allowBlank	:	false
				});
			}
			// update form fields
			editContentForm.items.items[3].setValue(fileId); // hidden field
			Ext.getCmp("filename").setValue(fileName);
			Ext.getCmp("content").setValue(response.responseText);
			uiWidget.show();
		});
		getContentAction.on("fail", function (action, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		getContentAction.get(fileId);
	}, // eo show	
	
	getFileId : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".fileId");
	}, // eo getFileId
	
	setFileId : function(fileId) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".fileId", fileId);
	}, // eo setFileId
	
	getFileName : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".fileName");
	}, // eo getFileName
	
	setFileName : function(fileName) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".fileName", fileName);
	} // eo setFileName

}); // eo DoCASU.App.Core.EditContentComponent

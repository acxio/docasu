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
 

// CreateContentComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.CreateContentComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.CreateContentComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.CreateContentComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"CreateContentComponent",
	title		:	"Create Content Component",
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
			allowBlank	:	false
		});
		var hiddenField = new Ext.form.Hidden({
			name		:	"folderId",
			value		:	"at_runtime"
		})
		var saveBtn = new Ext.Button ({
	   		text		:	"Save",
			handler : function() {
				// validate file name
				if(fileNameField.getValue().trim() == "") {
					Ext.MessageBox.show({
						title		:	"Error",
						msg			:	"File name is required!",
						buttons		:	Ext.MessageBox.OK,
						icon		:	Ext.MessageBox.ERROR
					});
					return false;
				}
				fileNameField.setValue(fileNameField.getValue() + "." + contentType.getValue()); // add extension to file name
				var createContentAction = DoCASU.App.PluginManager.getPluginManager().getComponent("CreateFileContentAction", "DoCASU.App.Core");
				createContentAction.on("beforecreate", function (action) {
					new Ext.LoadMask(Ext.getBody()).show();
				});
				createContentAction.on("aftercreate", function (action, response) {
					new Ext.LoadMask(Ext.getBody()).hide();
					DoCASU.App.PluginManager.getPluginManager().getUIWidget("CreateContentComponent").close();
					DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFolderAction", "DoCASU.App.Core").reload();
				});
				createContentAction.on("fail", function (action, response) {
					new Ext.LoadMask(Ext.getBody()).hide();
					DoCASU.App.PluginManager.getPluginManager().getUIWidget("CreateContentComponent").close();
				});
				var createContentComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CreateContentComponent", "DoCASU.App.Core");
				createContentAction.create(createContentComponent.getFolderId(), Ext.getCmp("createContentForm").getForm().getEl());
			}
		});
		var cancelBtn = new Ext.Button({
			text		:	"Cancel",
			handler : function() {
				DoCASU.App.PluginManager.getPluginManager().getUIWidget("CreateContentComponent").close();
			}
		});
		// default to text area and change at runtime if necessary
		var contentText = new Ext.form.TextArea({
			fieldLabel	:	"Content",
			name		:	"content",
			id			:	"content",
			height		:	340,
			width		:	550,
			Anchor		:	"100%",
			allowBlank	:	false
		});
		var contentType = new Ext.form.Hidden({
			name		:	"contentType",
			value		:	"txt"
		});
		var createContentForm = new Ext.form.FormPanel({
			id			:	"createContentForm",
			fileUpload	:	true,
			bodyStyle	:	"padding:5px",
			defaults	:	{border: false},
			items		:	[
								{html	:	"<h3>Create new content</h3>"},
								fileNameField,
								hiddenField,
								contentText,
								contentType
							],
			buttons		:	[saveBtn, cancelBtn]
		});
		var uiConfig	=	{
								id				:	this.id,
								title			:	"Content",
								width			:	740,
								height			:	480,
								x				:	200,
								y				:	200,
								iconCls			:	"icon-grid",
								shim			:	false,
								animCollapse	:	false,
								constrainHeader	:	true,
								items			:	[createContentForm],
								layout			:	"fit",
								modal			:	true
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	show : function(contentType, folderId) {
		// init the window
		this.init();
		this.setFolderId(folderId);
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CreateContentComponent");
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		var createContentComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CreateContentComponent", "DoCASU.App.Core");
		var createContentForm = Ext.getCmp("createContentForm");
		if (contentType == "html" || contentType.toLowerCase() == "htm") {
			// replace the textarea with a html editor
			createContentForm.items.items[3] = new Ext.form.HtmlEditor({
				fieldLabel	:	"Content",
				name		:	"content",
				id			:	"content",
				height		:	340,
				width		:	550,
				Anchor		:	"100%",
				allowBlank	:	false
			});
		}
		createContentForm.items.items[2].setValue(folderId); // hidden field
		createContentForm.items.items[4].setValue(contentType.toLowerCase()); // content type
		uiWidget.show();
	}, // eo show
	
	getFolderId : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".folderId");
	}, // eo getFolderId
	
	setFolderId : function(folderId) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".folderId", folderId);
	} // eo setFolderId	

}); // eo DoCASU.App.Core.CreateContentComponent

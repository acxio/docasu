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


// GeneralInfoComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.GeneralInfoComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.GeneralInfoComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.GeneralInfoComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"GeneralInfoComponent",
	title		:	"General Info Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		var dataview = new Ext.DataView({
			id			:	"docInfoDataView",
			minHeight	:	100,
			autoScroll	:	true,
			store		:	new Ext.data.Store({
								fields: ["creator", "description", "creator", "modifier"]
							}),
			tpl: new Ext.XTemplate(
					'<tpl for=".">',
					'<table id="infoTable" class="docInfoTable">',
					'<tr valign="top">',
					'<td colspan="4" class="docInfoListItem">',
					'<tpl if="this.isImage(mimetype)">',
					'<img height="64" src="{link}" alt="{title}"/>',
					'</tpl>',
					'<tpl if="!this.isImage(mimetype)">',
					'<img height="32" src="{icon32Url}" alt="{title}"/>',
					'</tpl>',
					'</td>',
					'</tr>',
					'<tr valign="top">',    
					'<td><b>Title:</b></td><td colspan="3">{title}</td>',
					'</tr>',
					'<tr valign="top">',    
					'<td><b>Description:</b></td><td colspan="3">{description}</td>',
					'</tr>',
					'<tr valign="top">',
					'<td><b>Version:</b></td><td colspan="3">{version}</td>',
					'</tr>',
					'<tr valign="top">',    
					'<td><b>Author:</b></td><td colspan="3">{author}</td>',
					'</tr>',
					'<tr valign="top">',    
					'<td><b>Creator:</b></td><td colspan="3">{creator}</td>',
					'</tr>',
					'<tr valign="top">',    
					'<td><b>Modifier:</b></td><td colspan="3">{modifier}</td>',
					'</tr>',
					'<tr valign="top">',
					'<td><b>MIME:</b></td><td colspan="3">{mimetype}</td>',
					'</tr>',
					'<tr valign="top">',
					'<td><b>Size:</b></td><td colspan="3">{[Ext.util.Format.fileSize(values.size)]}</td>',
					'</tr>',
					'<tr valign="top">',
					'<td><b>Created:</b></td><td colspan="3">{[DoCASU.App.Utils.timeZoneAwareRenderer(values.created)]}</td>',
					'</tr>',
					'<tr valign="top">',
					'<td><b>Modified:</b></td><td colspan="3">{[DoCASU.App.Utils.timeZoneAwareRenderer(values.modified)]}</td>',
					'</tr>',
					'</table>',
					'</tpl>',
					{
						isImage : function(mimetype) {
							return mimetype.indexOf("image") === 0;
						}
					}
			),
			itemSelector:	"div.item-selector"
		});
		var uiConfig	=	{
								// config
								id			:	this.id,
								// look
								title		:	"General Info",
	    						border		:	false,
	    						iconCls		:	"settings",
	    						autoScroll	:	true,
	    						items		:	[dataview]
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.GeneralInfoComponent.superclass.init.apply(this, arguments);
		
		// register event handlers
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.on("beforeexpand", function(panel) {
			var navigator = DoCASU.App.PluginManager.getPluginManager().getComponent("DoCASUEastComponent", "DoCASU.App.Core");
			navigator.activeTab = panel.id;
		});
		uiWidget.on("beforecollapse", function(panel) {
			var navigator = DoCASU.App.PluginManager.getPluginManager().getComponent("DoCASUEastComponent", "DoCASU.App.Core");
			if (navigator.activeTab == panel.id) {
				return false;
			}
		});
		
		// register handler with CenterViewComponent selection model
		try {
			var centerView = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
			// folder view list
			var store = centerView.items.items[0].store;
			store.on("beforeload", function(store, options) {
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("GeneralInfoComponent", "DoCASU.App.Core");
				component.clear();
			});
			var selectionModel = centerView.items.items[0].selModel;
			selectionModel.on("rowselect", function(selectionModel, rowIndex, record) {
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("GeneralInfoComponent", "DoCASU.App.Core");
				component.update(record);
			});
			// search view list
			var store = centerView.items.items[1].store;
			store.on("beforeload", function(store, options) {
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("GeneralInfoComponent", "DoCASU.App.Core");
				component.clear();
			});
			var selectionModel = centerView.items.items[1].selModel;
			selectionModel.on("rowselect", function(selectionModel, rowIndex, record) {
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("GeneralInfoComponent", "DoCASU.App.Core");
				component.update(record);
			});
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
		}
		
		// set active tab
		var navigator = DoCASU.App.PluginManager.getPluginManager().getComponent("DoCASUEastComponent", "DoCASU.App.Core");
		navigator.activeTab = this.id;
	},
	
	clear : function() {
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.items.items[0].store.removeAll();
	}, // eo clear
	
	update : function(record) {
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		this.clear();
		if (record) {
			uiWidget.items.items[0].store.add([record]);
		}
	}

}); // eo DoCASU.App.Core.GeneralInfoComponent

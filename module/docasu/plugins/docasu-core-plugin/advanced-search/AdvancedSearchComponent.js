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
 

// AdvancedSearchComponent

var SEARCH_FIELD_WIDTH = 150;

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.AdvancedSearchComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.AdvancedSearchComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.AdvancedSearchComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"AdvancedSearchComponent",
	title		:	"Advanced Search Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		// Text fields for advanced search
		var searchField = new Ext.form.TextField({
			fieldLabel: 'Query',
			name: 'q',
			width: SEARCH_FIELD_WIDTH
		});
		
		var typeCombo = new Ext.form.ComboBox({
			fieldLabel: "Search for",
			hiddenName: 't',
			store: new Ext.data.SimpleStore({
				fields: ['code', 'label'],
				data: [['', 'All items'],
				       ['content', 'Documents'],
				       ['file', 'File names'],
				       ['folder', 'Folder names']]
			}),
			displayField: 'label',
			valueField: 'code',
			mode: 'local',
			value: '',
			width: SEARCH_FIELD_WIDTH,
			triggerAction: 'all',
			readOnly: true,
			editable: false
		});
		
		var createdFrom = new Ext.form.DateField({
			fieldLabel: 'Created After',
			name: 'createdFrom',
			format: 'Y/m/d',
			width: SEARCH_FIELD_WIDTH
		});
		
		var createdTo = new Ext.form.DateField({
			fieldLabel: 'Created Before',
			name: 'createdTo',
			format: 'Y/m/d',
			width: SEARCH_FIELD_WIDTH
		});
		
		var modifiedFrom = new Ext.form.DateField({
			fieldLabel: 'Modified After',
			name: 'modFrom',
			format: 'Y/m/d',
			width: SEARCH_FIELD_WIDTH
		});
		
		var modifiedTo = new Ext.form.DateField({
			fieldLabel: 'Modified Before',
			name: 'modTo',
			format: 'Y/m/d',
			width: SEARCH_FIELD_WIDTH
		});
		
		var lookInCombo = new Ext.form.ComboBox({
			fieldLabel: 'Look in',
			width: SEARCH_FIELD_WIDTH,
			hiddenName: 'nodeId',
			store: new Ext.data.SimpleStore({
				fields: ['code', 'label'],
				data: [[Ext.state.Manager.get('currentFolder'), 'Current Folder'], ['', 'All Folders']]
			}),
			displayField: 'label',
			valueField: 'code',
			mode: 'local',
			selectOnFocus: true,
			triggerAction: 'all',
			editable: false
		});

		var advSearchForm = new Ext.form.FormPanel({
			id: 'advSearchForm',
			width: 600,
			height: 160,
			frame: false,
			bodyStyle: 'border: none',
			keys: [{
				key: Ext.EventObject.ENTER,
				handler: this.advSearchSubmit()
			}],
			layout: 'column',
			layoutConfig: {
				itemCls: 'pad-children'
			},
			items: [new Ext.Panel({
				width: 280,
				layout: 'form',
				border: false,
				style: 'margin:8px 4px 4px 4px',
				items: [searchField, typeCombo, lookInCombo]
			}), new Ext.Panel({
				width: 280,
				layout: 'form',
				border: false,
				style: 'margin:8px 4px 4px 4px',
				items: [createdFrom, createdTo, modifiedFrom, modifiedTo]
			})],
			buttons: [new Ext.Button({
				text: 'Search',
				handler: this.advSearchSubmit()
			})]
		});

		var uiConfig	=	{
			id				:	this.id,
			title			:	'Advanced Search',
			width			:	580,
			height			:	200,
			modal			:	true,
			iconCls			:	"icon-grid",
			animCollapse	:	false,
			constrainHeader	:	true,
			resizable		:	false,
			closeAction		:	"hide",
			buttonAlign		:	"center",
		    items			:	[advSearchForm],			
		}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration	

	show : function() {
		// init the window
		this.init();
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.show();
	}, // eo show
	
	advSearchSubmit : function () {
		var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
		searchAction.on("beforeload", function(component) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		searchAction.on("afterload", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var advancedSearchWindow = DoCASU.App.PluginManager.getPluginManager().getUIWidget("AdvancedSearchComponent");
			advancedSearchWindow.close();
		});
		searchAction.on("fail", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var advancedSearchWindow = DoCASU.App.PluginManager.getPluginManager().getUIWidget("AdvancedSearchComponent");
			advancedSearchWindow.close();
		});
	}
		
}); // eo DoCASU.App.Core.AdvancedSearchComponent

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


// SearchFormComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.SearchFormComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.SearchFormComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.SearchFormComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"SearchFormComponent",
	title		:	"Search Form Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.form.FormPanel",
	getUIConfig : function() {
		var searchTypeStore = new Ext.data.SimpleStore({
			fields	:	["code", "label"],
			data	:	[
							["", "All items"],
							["content", "Documents"],
							["file", "File names"],
							["folder", "Folder names"]
						]
		});
		var searchTypeCombo = new Ext.form.ComboBox({
			id				: 	"searchType",
			fieldLabel		:	"Search for",
			hiddenName		:	"t",
			store			:	searchTypeStore,
			displayField	:	"label",
			valueField		:	"code",
			mode			:	"local",
			value			:	"",
			width			:	90,
			triggerAction	:	"all",
			readOnly		:	true,
			editable		:	false
		});
		var searchField = new Ext.form.TextField({
			id			:	"q",
			colspan		:	1,
			width		: 	90,
			style		:	"margin-left: 4px",
			name		:	"q",
			hideLabel	:	true,
			// reference to context
			searchFormId:	this.id
		});
		searchField.on("specialkey", function(f, event) {
			if(event.getKey() == event.ENTER) {
	    		DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.searchFormId).form.submit();
			}
		});
		var searchBtn = new Ext.Button({
			text		:	"Go",
			// reference to context
			searchFormId:	this.id,
			handler : function() {
				DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.searchFormId).form.submit();
			}
		});
		var uiConfig	=	{
								// config
								id			:	this.id,
								name		:	this.id,
								// look
								width		: 	380,
								bodyStyle	:	"padding: 4px;margin-top:5px;",
								region		:	"east",
								border		:	false,
								frame		:	false,
								layout		:	"table",
								items		:	[
													{
														html		:	"<span class=\"title\">Search:</span>",
														colspan		:	1,
														bodyStyle	:	"margin-right: 4px; border-style:none"
													},
													searchTypeCombo,
													searchField,
													searchBtn,
													{
														html		:	"<a href=\"#\" class=\"header\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('AdvancedSearchComponent', 'DoCASU.App.Core').show(); return false;\">Advanced&nbsp;Search</a>",
														border		:	false,
														colspan		:	1
													}
												] // eo search form items
								}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration	

	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.SearchFormComponent.superclass.init.apply(this, arguments);
		// register event handlers
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.on("beforeaction", function (node, event) {
			var q = Ext.getCmp("q").getValue();
			var t = Ext.getCmp("searchType").getValue()
			DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core").search(q, t);
		});		
		uiWidget.on("render", function(panel) {
			panel.getEl().parent("td").child("div").addClass("SearchFormComponent");
		});
		// update ui after each search
		var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
		searchAction.on("afterload", function(component) {
			var seachForm = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchFormComponent", "DoCASU.App.Core");
			seachForm.updateUI();
		});
	}, // eo init
	
	updateUI : function() {
		// populate search fields according to previous search
		var centerView = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
		var searchParameters = centerView.items.items[1].store.baseParams;
		var searchForm = Ext.getCmp(this.id).form;
		searchForm.setValues(searchParameters);
	} // eo updateUI
}); // eo DoCASU.App.Core.SearchFormComponent

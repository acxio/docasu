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
			id				: 	"t",
			fieldLabel		:	"Search for",
			hiddenName		:	"t",
			store			:	searchTypeStore,
			displayField	:	"label",
			valueField		:	"code",
			mode			:	"local",
			value			:	"",
			width			:	100,
			triggerAction	:	"all",
			readOnly		:	true,
			editable		:	false
		});
		var searchField = new Ext.form.TextField({
			id			:	"q",
			colspan		:	1,
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
			minWidth	:	40,
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
														html		:	"<a href=\"#\" class=\"header\" onclick=\"showAdvancedSearch(); return false;\">Advanced&nbsp;Search</a>",
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
		// search parameters: q, t, nodeId, createdFrom, createdTo, modifiedFrom, modifiedTo, start, limit, sort, dir
		uiWidget.on("beforeaction", function (node, event) {
			DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core").search(
				Ext.ComponentMgr.get('q').getValue(),
				Ext.ComponentMgr.get('t').getValue()
				);
		});		
		uiWidget.on("render", function(panel) {
			panel.getEl().parent("td").child("div").addClass("SearchFormComponent");
		});
	}
	
}); // eo DoCASU.App.Core.SearchFormComponent

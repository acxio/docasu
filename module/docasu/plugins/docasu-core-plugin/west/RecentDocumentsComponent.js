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


// RecentDocumentsComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.RecentDocumentsComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.RecentDocumentsComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.RecentDocumentsComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"RecentDocumentsComponent",
	title		:	"Recent Documents Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.grid.GridPanel",
	getUIConfig : function() {
		var recentDocsStore = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'ui/node/recentdocs',
				method: 'GET'
			}),
			reader: new Ext.data.JsonReader({
				root: 'rows',
				fields: [
				         {name: 'name', type:'string'},
				         {name: 'nameIcon', type:'string'},
				         {name: 'path', type:'string'},
				         {name: 'modified', type:'string'}
				         ]
			})
		});
		var uiConfig	=	{
								// config
								id			:	this.id,
								store		:	recentDocsStore,
								// look
								title		:	"Latest Documents",
	    						border		:	false,
	    						iconCls		:	"settings",
	    						columns		:	[
	    											{
	    												id			:	"name",
	    												dataIndex	:	"nameIcon"
	    											}
	    										],
	    						viewConfig	:	{forceFit:true}
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.RecentDocumentsComponent.superclass.init.apply(this, arguments);
		
		// register event handlers
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.on("beforeexpand", function(panel) {
			var navigator = DoCASU.App.PluginManager.getPluginManager().getComponent("DoCASUWestComponent", "DoCASU.App.Core");
			navigator.activeTab = panel.id;
		});
		uiWidget.on("beforecollapse", function(panel) {
			var navigator = DoCASU.App.PluginManager.getPluginManager().getComponent("DoCASUWestComponent", "DoCASU.App.Core");
			if (navigator.activeTab == panel.id) {
				return false;
			}
		});
		
		// load data
		uiWidget.store.load();
	}	

}); // eo DoCASU.App.Core.RecentDocumentsComponent

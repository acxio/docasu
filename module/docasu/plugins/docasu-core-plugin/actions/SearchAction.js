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


// SearchAction

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.SearchAction = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.SearchAction.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeload",
		"afterload",
		"fail"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.SearchAction, DoCASU.App.Component, {
	// configuration options
	id			:	"Search Action",
	title		:	"Search Action",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	
	search : function(q, t) {
		this.advancedSearch({"q" : q, "t" : t});
	},
	
	advancedSearch : function(searchParameters) {
		// fire beforeload event
		this.fireEvent("beforeload", this);
		var centerViewComponent;
		try {
			centerViewComponent = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CenterViewComponent");
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		//var store = centerViewComponent.items.items[1].store;
		var store = centerViewComponent.getLayout().activeItem.store;
		store.baseParams.q = searchParameters.q;
		store.baseParams.t = searchParameters.t;
		store.baseParams.nodeId = searchParameters.folderId; // keep different names to break synchronization with combo-box
		store.baseParams.createdFrom = searchParameters.createdFrom;
		store.baseParams.createdTo = searchParameters.createdTo;
		store.baseParams.modifiedFrom = searchParameters.modifiedFrom;
		store.baseParams.modifiedTo = searchParameters.modifiedTo;
		// register listeners for store
		store.on("load", function(store, records, options) {
			var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
			searchAction.fireEvent("afterload", searchAction, records);
		});
		store.on("loadexception", function(proxy, options, response, error) {
			var searchAction = DoCASU.App.PluginManager.getPluginManager().getComponent("SearchAction", "DoCASU.App.Core");
			searchAction.fireEvent("fail", searchAction, response);
		});
		store.load();
	}

}); // eo DoCASU.App.Core.LoadFolderAction

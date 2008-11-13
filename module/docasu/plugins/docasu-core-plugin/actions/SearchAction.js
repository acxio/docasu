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
		this.advancedSearch(q, t, null, null, null, null, null, null, null, null, null);
	},
	
	advancedSearch : function(q, t, nodeId, createdFrom, createdTo, modifiedFrom, modifiedTo, start, limit, sort, dir) {
		// fire beforeload event
		this.fireEvent("beforeload", this);
		var searchListComponent;
		try {
			searchListComponent = DoCASU.App.PluginManager.getPluginManager().getUIWidget("SearchListComponent");
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		var store = searchListComponent.items.items[0].store;
		store.baseParams.q = q;
		store.baseParams.t = t;
		store.baseParams.nodeId = nodeId;
		store.baseParams.createdFrom = createdFrom;
		store.baseParams.createdTo = createdTo;
		store.baseParams.modifiedFrom = modifiedFrom;
		store.baseParams.modifiedTo = modifiedTo;				
		store.baseParams.start = start;
		store.baseParams.limit = limit;
		store.baseParams.sort = sort;
		store.baseParams.dir = dir;
		
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

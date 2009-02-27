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


// LoadCategoriesAction

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Categories");

/* constructor */
DoCASU.App.Categories.LoadCategoriesAction = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Categories.LoadCategoriesAction.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeload",
		"afterload",
		"fail"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Categories.LoadCategoriesAction, DoCASU.App.Component, {
	// configuration options
	id			:	"LoadCategoriesAction",
	title		:	"Load Categories Action",
	namespace	:	"DoCASU.App.Categories", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	
	load : function(nodeId) {
		// fire beforeload event
		this.fireEvent("beforeload", this);
		var categorizationComponent;
		try {
			categorizationComponent = DoCASU.App.PluginManager.getPluginManager().getUIWidget("CategorizationComponent");
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		// categorizationComponent -> tabp anel -> categories panel -> categories grid -> store
		var store = categorizationComponent.items.items[0].items.items[0].items.items[0].store;
		store.proxy = new Ext.data.HttpProxy({
			url: "ui/node/categories/" + nodeId,
			method: "GET"
		}),
		
		// register listeners for store
		store.on("load", function(store, records, options) {
			var loadCategoryAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadCategoriesAction", "DoCASU.App.Categories");
			loadCategoryAction.fireEvent("afterload", loadCategoryAction, records);
		});
		store.on("loadexception", function(proxy, options, response, error) {
			var loadCategoryAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadCategoriesAction", "DoCASU.App.Categories");
			loadCategoryAction.fireEvent("fail", loadCategoryAction, response);
		});
		
		store.load();
	} // eo load

}); // eo DoCASU.App.Categories.LoadCategoriesAction

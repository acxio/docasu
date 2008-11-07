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


// CategoriesTreeComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Categories");

/* constructor */
DoCASU.App.Categories.CategoriesTreeComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Categories.CategoriesTreeComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Categories.CategoriesTreeComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"CategoriesTreeComponent",
	title		:	"Categories Tree Component",
	namespace	:	"DoCASU.App.Categories", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.tree.TreePanel",
	getUIConfig : function() {
		var categoriesTreeLoader = new Ext.tree.TreeLoader({
			dataUrl: "ui/categories",
			requestMethod: "GET"
		});
		categoriesTreeLoader.on("loadexception", function(treeLoader, node, response) {
			// check for session expiration
			if(DoCASU.App.Session.isSessionExpired(response)) {
				// reload docasu
				DoCASU.App.ApplicationManager.getApplication().reload();
				return;
			}
			DoCASU.App.Error.handleFailureMessage("Failed to load sub-categories", response);
		});
		var uiConfig	=	{
								// config
								id				:	this.id,
								autoScroll		:	true,
								enableDD		:	false, // Allow tree nodes to be moved (dragged and dropped)
								containerScroll	:	true,
								loader			:	categoriesTreeLoader,
								root			:	new Ext.tree.AsyncTreeNode({
														id			:	"cm:generalclassifiable", // default classification
														text		:	"Categories",
														draggable	:	false,
														expanded	:	true
													}), // this adds a root node to the tree and tells it to expand when it is rendered
								rootVisible		:	false,
								// look
								title		:	"<b>Categories</b>",
								split		:	true,
								width		:	200,
								minSize		:	175,
								maxSize		:	400,
								margins		:	"35 0 5 5",
								cmargins	:	"35 5 5 5",
								frame		:	false,
							    border		:	false
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Categories.CategoriesTreeComponent.superclass.init.apply(this, arguments);
		
		// register event handlers
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.on("beforecollapsenode", function (node, deep, anim) {	
			node.loaded = false;
		});	
		uiWidget.addListener("click", function (node, event) {
			// loadCategory(node.id);
			return false;
		});
		uiWidget.on("contextmenu", function(node, e) {
			e.preventDefault();
		});
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
	},
	
	reload : function() {
		var uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		uiWidget.root.reload();
	}

}); // eo DoCASU.App.Categories.CategoriesTreeComponent

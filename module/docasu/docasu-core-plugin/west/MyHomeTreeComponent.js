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


// MyHomeTreeComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.MyHomeTreeComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.MyHomeTreeComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.MyHomeTreeComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"MyHomeTreeComponent",
	title		:	"My Home Tree Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.tree.TreePanel",
	getUIConfig : function() {
		var myHomeTreeLoader = new Ext.tree.TreeLoader({
			dataUrl: "ui/folders",
			requestMethod: "GET"
		});
		myHomeTreeLoader.on("beforeload", function(treeLoader, node, response) {
			if(node.id == "cancel_load") {
				// cancel the load on the first render - wait for the user to be loaded first
				return false;
			}
		});
		myHomeTreeLoader.on("loadexception", function(treeLoader, node, response) {
			// check for session expiration
			if(DoCASU.App.Session.isSessionExpired(response)) {
				// reload docasu
				new DoCASU.App.Application().reload();
				return;
			}
			DoCASU.App.Error.handleFailureMessage("Failed to load sub-folders", response);
		});
		var uiConfig	=	{
								// config
								id				:	this.id,
								autoScroll		:	true,
								enableDD		:	false, // Allow tree nodes to be moved (dragged and dropped)
								containerScroll	:	true,
								loader			:	myHomeTreeLoader,
								root			:	new Ext.tree.AsyncTreeNode({
														id			:	"cancel_load", // companyHomeId - to be loaded from repository
														text		:	"My Home",
														draggable	:	false,
														expanded	:	true
													}), // this adds a root node to the tree and tells it to expand when it is rendered
								rootVisible		:	false,
								// look
								title		:	"<b>My Home</b>",
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
		DoCASU.App.Core.MyHomeTreeComponent.superclass.init.apply(this, arguments);
		
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
			// loadFolder(node.id);
			return false;
		});
		uiWidget.on("contextmenu", function(node, e) {
			e.preventDefault();
			/*
			var myRecord = new Object('Node '+node.id);
	       	myRecord.id = node.id;
	       	myRecord.text = node.text;
			myRecord.name = node.attributes.text;
			myRecord.parentPath = node.attributes.parentPath;
			myRecord.link = node.attributes.link;
			myRecord.url = node.attributes.url;
			myRecord.writePermission = eval(node.attributes.writePermission);
			myRecord.createPermission = eval(node.attributes.createPermission);
			myRecord.deletePermission = eval(node.attributes.deletePermission);
	
			this.contextMenu = getFolderContextMenu(node.id, myRecord);
	
			var xy = e.getXY();
			this.contextMenu.showAt(xy);*/
		});
		uiWidget.on("beforeexpand", function(panel) {
			var navigator = DoCASU.App.PluginManager.getPluginManager().getComponent("DoCASUWestComponent", "DoCASU.App.Core");
			navigator.activeTab = panel.id;
		});
		uiWidget.on("beforecollapse", function(panel) {
			var navigator = DoCASU.App.PluginManager.getPluginManager().getComponent("DoCASUWestComponent", "DoCASU.App.Core");
			if (navigator.activeTab == panel.id) {
				// loadFolder(Ext.state.Manager.get('companyHomeId'));
				return false;
			}
		});
		
		// register listener for CenterHeaderComponent.userloaded
		var centerHeader = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterHeaderComponent", "DoCASU.App.Core");
		centerHeader.on("userloaded", function(component) {
			var companyHomeTreeComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("MyHomeTreeComponent", "DoCASU.App.Core");
			companyHomeTreeComponent.reload(component);
		});
	},
	
	reload : function(component) {
		var uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		uiWidget.root.id = component.getUser().userHome;
		uiWidget.root.reload();
	}

}); // eo DoCASU.App.Core.MyHomeTreeComponent

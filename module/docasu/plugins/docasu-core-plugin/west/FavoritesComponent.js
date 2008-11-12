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


// FavoritesComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.FavoritesComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.FavoritesComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.FavoritesComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"FavoritesComponent",
	title		:	"Favorites Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		var uiConfig	=	{
								// config
								id		:	this.id,
								// look
								title	:	"My Favorites",
						 	    html	:	"<div id=\"" + this.id + "\">No favorites defined.<div>",
						 	    border	:	false,
						 	    iconCls	:	"settings"
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.FavoritesComponent.superclass.init.apply(this, arguments);
		
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
		
		var loadFavoritesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFavoritesAction", "DoCASU.App.Core");
		loadFavoritesAction.on("beforeload", function(component) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		loadFavoritesAction.on("afterload", function(component, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var favoritesComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("FavoritesComponent", "DoCASU.App.Core");
			favoritesComponent.updateView(response);
		});
		loadFavoritesAction.on("fail", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		
		var addFavoriteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("AddFavoriteAction", "DoCASU.App.Core");
		addFavoriteAction.on("beforesave", function(component) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		addFavoriteAction.on("aftersave", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFavoritesAction", "DoCASU.App.Core").load();
			DoCASU.App.PluginManager.getPluginManager().getComponent("FavoritesComponent", "DoCASU.App.Core").expand();
		});
		addFavoriteAction.on("fail", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		
		var removeFavoriteAction = DoCASU.App.PluginManager.getPluginManager().getComponent("RemoveFavoriteAction", "DoCASU.App.Core");
		removeFavoriteAction.on("beforeremove", function(component) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		removeFavoriteAction.on("afterremove", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
			DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFavoritesAction", "DoCASU.App.Core").load();
		});
		removeFavoriteAction.on("fail", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		
		// register listener for CenterHeaderComponent.userloaded
		var centerHeader = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterHeaderComponent", "DoCASU.App.Core");
		centerHeader.on("userloaded", function(component) {
			var loadFavoritesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFavoritesAction", "DoCASU.App.Core");
			loadFavoritesAction.load();
		});
	},
	
	updateView : function(response) {
		var favoritesPanel = DoCASU.App.PluginManager.getPluginManager().getUIWidget("FavoritesComponent");
		var favHtml = "<table style=\"width:100%;\">";
		var favorites = Ext.util.JSON.decode(response.responseText).rows;
		for (var i = 0; i < favorites.length; i++) {
			var favorite = favorites[i];
			favHtml += "<tr>";
			if (favorite.isFile) {
				favHtml += "<td><img src=\"" + favorite.icon + "\" /></td>";
				favHtml += "<td><a target=\"_blank\" href=\"" + favorite.url + "\"> " + favorite.name + "</a></td>";
				favHtml += "<td style=\"text-align:right;\">";
				favHtml +=   "<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('" + favorite.parentId + "'); return false;\" title=\"Open in Folder\"><img src=\"../../docasu/lib/extjs/resources/images/default/tree/folder.gif\"/></a>";
				favHtml +=   "&nbsp;";
				favHtml +=   "<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('RemoveFavoriteAction', 'DoCASU.App.Core').remove('" + favorite.id + "'); return false;\"><img src=\"../../docasu/images/delete.gif\" /></a>";
				favHtml += "</td>";
			}
			else {
				favHtml += "<td><img src=\"../../docasu/lib/extjs/resources/images/default/tree/folder.gif\"/></td>";
				favHtml += "<td><a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('" + favorite.id + "'); return false;\">" + favorite.name + "</a></td>";
				favHtml += "<td style=\"text-align:right;\"><a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('RemoveFavoriteAction', 'DoCASU.App.Core').remove('" + favorite.id + "')\"><img src=\"../../docasu/images/delete.gif\" /></a></td>";
			}
			favHtml += "</tr>";
		}
		favHtml += "</table>";
		favoritesPanel.body.dom.innerHTML = favHtml;
	}, // eo updateView
	
	expand : function() {
		var favoritesPanel = DoCASU.App.PluginManager.getPluginManager().getUIWidget("FavoritesComponent");
		favoritesPanel.expand();
	} // eo expand

}); // eo DoCASU.App.Core.FavoritesComponent

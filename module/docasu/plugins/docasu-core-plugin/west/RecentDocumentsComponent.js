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
	uiClass		:	"Ext.Panel",
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
								id				:	this.id,
								// look
								title			:	"Latest Documents",
						 	    html			:	"<div id=\"" + this.id + "\">No items found.<div>",
						 	    border			:	false,
						 	    autoScroll		:	true,
						 	    containerScroll	:	true,
						 	    iconCls			:	"settings"
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
		
		var loadRecentDocumentsAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadRecentDocumentsAction", "DoCASU.App.Core");
		loadRecentDocumentsAction.on("beforeload", function(component) {
			new Ext.LoadMask(Ext.getBody()).show();
		});
		loadRecentDocumentsAction.on("afterload", function(component, response) {
			new Ext.LoadMask(Ext.getBody()).hide();
			var recentDocumentsComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("RecentDocumentsComponent", "DoCASU.App.Core");
			recentDocumentsComponent.updateUI(response);
		});
		loadRecentDocumentsAction.on("fail", function(component) {
			new Ext.LoadMask(Ext.getBody()).hide();
		});
		loadRecentDocumentsAction.load();
	}, // eo init
	
	updateUI : function(response) {
		var recentDocsPanel = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		var recentDocsHtml = "<table style=\"width:100%; border-spacing: 0px;\">";
		var recentDocs = Ext.util.JSON.decode(response.responseText).rows;
		for (var i = 0; i < recentDocs.length; i++) {
			var doc = recentDocs[i];
			recentDocsHtml += "<tr><td><table style=\"width:100%; border-width: 0px 0px 1px 0px; border-style: solid; border-color: #d0d0d0;\"><tr>";
				recentDocsHtml += "<td><img src=\"" + doc.icon + "\" /></td>";
				recentDocsHtml += "<td style=\"text-align:left;\">";
				recentDocsHtml +=   "<a target=\"_blank\" href=\"" + doc.url + "\" title=\"Open\">" + doc.name + "</a>";
				recentDocsHtml += "</td>";
				recentDocsHtml += "<td style=\"text-align:right;\">";
				recentDocsHtml +=   "<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LoadFolderAction', 'DoCASU.App.Core').load('" + doc.parentId + "'); return false;\" title=\"Open in Folder\"><img src=\"../../docasu/lib/extjs/resources/images/default/tree/folder.gif\"/></a>";
				recentDocsHtml += "</td>";
			recentDocsHtml += "</tr>";
			recentDocsHtml += "<tr>";
				recentDocsHtml += "<td style=\"text-align:left;\" colspan=\"2\">Modified</td>";
				recentDocsHtml += "<td style=\"text-align:right;\">" + doc.modified + "</td>";
			recentDocsHtml += "</tr></table></td></tr>";
		}
		recentDocsHtml += "</table>";
		recentDocsPanel.body.dom.innerHTML = recentDocsHtml;
	} // eo updateUI	

}); // eo DoCASU.App.Core.RecentDocumentsComponent

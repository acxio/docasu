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


// ClipboardComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.ClipboardComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.ClipboardComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.ClipboardComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"ClipboardComponent",
	title		:	"Clipboard Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		var uiConfig	=	{
								// config
								id				:	this.id,
								// look
								title			:	"Clipboard",
	    						html			:	"<div id=\"" + this.id + "\">No items on clipboard.</div>",
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
		DoCASU.App.Core.ClipboardComponent.superclass.init.apply(this, arguments);
		
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
	}, // eo init
	
	copyLink : function(icon, name, nodeId) {
		this.put(icon, name, nodeId);
		this.update();
	}, // eo copyLink
	
	put : function(icon, name, nodeId) {
		var c = this.getAll();
		// TODO handle duplicates
		c.push([icon,name,nodeId].join(";"));
		this.setClipboard(c);
	}, // eo put
	
	getAll : function() {
		var s = this.getClipboard();
		var c = (s == "" ? new Array() : s.split(","));
		return c;
	}, // eo getAll
	
	update : function() {
		var nodes = this.getAll();
		var clipHtml = "<table style=\"width:100%; border-spacing: 0px;\">";
		for(var i = 0; i < nodes.length; i++) {
			var c = nodes[i].split(";");
			clipHtml += "<tr>"
				clipHtml += "<td><img src=\"" + c[0] + "\" /></td>";
				clipHtml += "<td style=\"text-align:left;\">" + c[1] + "</td>";
				clipHtml += "<td style=\"text-align:right;\">";
				clipHtml +=	  "<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('ClipboardComponent', 'DoCASU.App.Core').remove('" + c[2] + "'); return false;\" title=\"Remove from Clipboard\">";
				clipHtml +=	    "<img src=\"../../docasu/images/delete.gif\" />";
				clipHtml +=	  "</a>";
				clipHtml +=	"</td>";
			clipHtml += "</tr>";
		}
		clipHtml += "</table>";
		var uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id); // get UI reference
		uiWidget.body.dom.innerHTML = clipHtml;
	}, // eo update	
	
	remove : function(id) {
		var nodes = this.getAll();
		for (var i=0; i<nodes.length; i++) {
			if (nodes[i].indexOf(id) != -1) {
				nodes.splice(i, 1);
				break;
			}
		}
		this.setClipboard(nodes);
		this.update();
	}, // eo remove
	
	clear : function() {
		this.setClipboard(null);
		this.update();
	}, // eo clear
	
	getClipboard : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".clipboard", "");
	}, // eo getClipboard
	
	setClipboard : function(c) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".clipboard", c.join(","));
	} // eo setClipboard

}); // eo DoCASU.App.Core.ClipboardComponent

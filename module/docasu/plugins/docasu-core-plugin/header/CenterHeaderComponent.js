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


// CenterHeaderComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.CenterHeaderComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.CenterHeaderComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"userloaded"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.CenterHeaderComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"CenterHeaderComponent",
	title		:	"Center Header Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		var user = {firstName:"Guest", lastName:""};
		try {
			 user = this.getUser();
		} catch(err) {
			// user was not loaded yet - use defaults
		}
		var uiConfig	=	{
								// config
								id			:	this.id,
								// look
								margins		:	"0 2 0 2",
								border		:	false,
								html		:	"<span class=\"title\" style=\"margin-right:20px;margin-top:5px;\">Welcome " + user.firstName + " " + user.lastName + "</span> <a target=\"_blank\" href=\"../../faces/jsp/browse/browse.jsp\" class=\"header\">Standard Alfresco Client</a> <a href=\"#\" onClick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('DoCASUHelpComponent', 'DoCASU.App.Help').show();\" class=\"header\" >Help</a> <a href=\"#\" id=\"logoutLink\" onClick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('LogoutAction', 'DoCASU.App.Core').logout(); return false;\" class=\"header\" >Logout</a>"
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration	

	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.CenterHeaderComponent.superclass.init.apply(this, arguments);
		
		// register event handlers
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		uiWidget.on("render", function(panel) {
			panel.getEl().parent("td").addClass("filler");
		});
		
		this.on("userloaded", function(component) {
			component.updateUI();
		});
		
		// load user data
		this.loadUserData();
	},
	
	updateUI : function() {
		var uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id); // get UI reference
		uiWidget.body.dom.innerHTML = this.getUIConfig().html; // make changes visible
	},
	
	loadUserData : function() {
		Ext.Ajax.request({
			url: 'ui/user',
			method: 'GET',
			success: function(response, options) {
				// check response for errors
				if(DoCASU.App.Error.checkHandleErrors('Failed to load user data', response)) {
					return;
				}
				var user = Ext.util.JSON.decode(response.responseText);
				// store user data
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("CenterHeaderComponent", "DoCASU.App.Core");
				component.setUser(user);
				// fire userloaded event
				component.fireEvent("userloaded", component);
			},
			failure: function(response, options) {
				DoCASU.App.Error.handleFailureMessage('Failed to load user data', response);
			}
		});
	},
	
	
	// public data
	getUser : function() {
		return DoCASU.App.DataManager.getComponentData(this, "user");
	},
	setUser : function(user) {
		DoCASU.App.DataManager.setComponentData(this, "user", user);
	}
	
}); // eo DoCASU.App.Core.CenterHeaderComponent

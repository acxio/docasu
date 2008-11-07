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


// LogoutAction

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.LogoutAction = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.LogoutAction.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforelogout",
		"afterlogout"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.LogoutAction, DoCASU.App.Component, {
	// configuration options
	id			:	"LogoutAction",
	title		:	"Logout Action",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	
	// override init()
	init : function() {
		// call parent
		DoCASU.App.Core.LogoutAction.superclass.init.apply(this, arguments);
		
		// register event handlers
		this.on("beforelogout", function(component) {
			Ext.MessageBox.show({
				msg: 'Logout',
				progressText: 'Processing...',
				width:200,
				wait:true,
				waitConfig: {interval:200},
				icon: Ext.MessageBox.INFO
			});
		});
		this.on("afterlogout", function(component) {
			DoCASU.App.ApplicationManager.getApplication().reload();
		});
	},
	
	logout : function() {
		// fire beforelogout event
		this.fireEvent("beforelogout", this);
		setTimeout(function() {
			// add a small delay to execute beforelogout event handlers
			Ext.Ajax.request({
				url: 'ui/logout',
				method: 'GET',
				success: function(response, options) {
					// check response for errors
					if(DoCASU.App.Error.checkHandleErrors('Failed to logout', response)) {
						return;
					}
					// fire afterlogout event
					var component = DoCASU.App.PluginManager.getPluginManager().getComponent("LogoutAction", "DoCASU.App.Core");
					component.fireEvent("afterlogout", component);
				}, 
				failure: function(response, options) {
					DoCASU.App.Error.handleFailureMessage('Failed to logout', response);
				}
			});
		}, 1000);
	}

}); // eo DoCASU.App.Core.LogoutAction

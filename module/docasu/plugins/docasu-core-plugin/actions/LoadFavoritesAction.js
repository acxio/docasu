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


// LoadFavoritesAction

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.LoadFavoritesAction = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.LoadFavoritesAction.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforeload",
		"afterload",
		"fail"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.LoadFavoritesAction, DoCASU.App.Component, {
	// configuration options
	id			:	"LoadFavoritesAction",
	title		:	"Load Favorites Action",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	
	load : function() {
		// fire beforeload event
		this.fireEvent("beforeload", this);
		Ext.Ajax.request({
			url: 'ui/shortcuts',
			method: 'GET',
			success: function(response, options) {
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFavoritesAction", "DoCASU.App.Core");
				// check response for errors
				if(DoCASU.App.Error.checkHandleErrors("Failed to load favorite", response)) {
					// fire fail event
					component.fireEvent("fail", component, response);
				} else {
					// fire afterload event
					component.fireEvent("afterload", component, response);
				}
			}, 
			failure: function(response, options) {
				DoCASU.App.Error.handleFailureMessage("Failed to load favorite", response);
				// fire fail event
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadFavoritesAction", "DoCASU.App.Core");
				component.fireEvent("fail", component, response);
				
			}
		});
	}

}); // eo DoCASU.App.Core.LoadFavoritesAction

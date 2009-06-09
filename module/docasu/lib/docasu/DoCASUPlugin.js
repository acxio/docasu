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


// DoCASUPlugin


/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App");

/* constructor */
DoCASU.App.Plugin = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Plugin.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Plugin, Ext.util.Observable, {
	// configuration options
	id			:	"Plugin",
	title		:	"Plugin",
	file		:	getContextBase() + "/docasu/lib/docasu/DoCASUPlugin.js", // JS source file
	namespace	:	"DoCASU.App", // each plugin is stored under a specified namespace  - must be different than any class name
	pluginId	:	"", // parent plugin id, if any
	disabled	:	false, // disabled : true only if the plugin should not be used and it is not required
	required	:	false, // required : true only if there are other plugins/components that depend on the features of this plugin
	// state
	plugins		:	[], // children plugins
	components	:	[], // children components
	
	register : function() {
		var pluginManager = DoCASU.App.PluginManager.getPluginManager();
		pluginManager.registerPlugin(this);
		// cascade to children
		for(i in this.plugins) {
			var config = this.plugins[i];
			if(typeof config != "function") {
				var plugin = pluginManager.createPlugin(config);
				plugin.register();
			}
		}
		for(i in this.components) {
			var config = this.components[i];
			if(typeof config != "function") {
				var component = pluginManager.createComponent(config);
				component.register();
			}
		}
	},
	
	init : function() {
		// do custom init if plugin enabled
		if(!this.required && this.disabled) {
			return;
		}
		var pluginManager = DoCASU.App.PluginManager.getPluginManager();
		// cascade to children
		for(i in this.plugins) {
			var config = this.plugins[i];
			if(typeof config != "function") {
				var plugin = pluginManager.getPlugin(config.id, config.namespace);
				plugin.init();
			}
		}
		for(i in this.components) {
			var config = this.components[i];
			if(typeof config != "function") {
				var component = pluginManager.getComponent(config.id, config.namespace);
				component.init();
			}
		}
	}
}); // eo DoCASU.App.Plugin

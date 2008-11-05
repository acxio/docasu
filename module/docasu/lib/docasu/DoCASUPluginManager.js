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


// DoCASUPluginManager

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App");



DoCASU.App.PluginManager = new Object({
	// configuration options
	id			:	"DoCASUPluginManager",
	title		:	"DoCASU Plugin Manager",
	namespace	:	"DoCASU.App", // each plugin is stored under a specified namespace  - must be different than any class name
	
	// public interface
	getPluginManager : function() {
		return this.getPlugin(this.id, this.namespace);
	},
	
	getPlugin : function(pluginId, pluginNamespace) {
		var plugin = Ext.state.Manager.get(pluginNamespace + "." + pluginId); // each plugin is stored under it's namespace
		if(!plugin || plugin == null) {
			throw "No plugin with ID " + pluginNamespace + "." + pluginId + " was registered";
			return;
		}
		return plugin;
	},
	
	registerPlugin : function(plugin) {
		try {
			var existent = this.getPlugin(plugin.id, plugin.namespace);
			throw "A plugin with ID " + existent.namespace + "." + existent.id + " was already registered: " + existent.title;
			return;
		} catch(err) {
			// no plugin exception
			Ext.state.Manager.set(plugin.namespace + "." + plugin.id, plugin); // each plugin is stored under it's namespace
		}
	},
	
	updatePlugin : function(plugin) {
		var existent = this.getPlugin(plugin.id, plugin.namespace);
		// if plugin exists
		Ext.state.Manager.set(plugin.namespace + "." + plugin.id, plugin); // each plugin is stored under it's namespace
	},
	
	getComponent : function(componentId, componentNamespace) {
		var component = Ext.state.Manager.get(componentNamespace + "." + componentId); // each component is registered under it's namespace
		if(!component || component == null) {
			throw "No component with ID " + componentNamespace + "." + componentId + " was registered";
			return;
		}
		return component;
	},
	
	registerComponent : function(component) {
		try {
			var existent = this.getComponent(component.id, component.namespace);
			throw "A component with ID " + existent.namespace + "." + existent.id + " was already registered: " + existent.title;
			return;
		} catch(err) {
			// no component exception
			Ext.state.Manager.set(component.namespace + "." + component.id, component); // each component is registered under it's namespace
		}
	},
	
	updateComponent : function(component) {
		var existent = this.getComponent(component.id, component.namespace);
		// if component exists
		Ext.state.Manager.set(component.namespace + "." + component.id, component); // each component is registered under it's namespace
	},
	
	getUIWidget : function(widgetId) {
		var widget = Ext.getCmp(widgetId); // in ExtJS each UI widget must have an unique id
		if(!widget || widget == null) {
			throw "No UI widget with ID " + widgetId + " was registered";
			return;
		}
		return widget;
	},
	
	/* reisters all features using perspective */
	register : function() {
		// register itself
		this.registerPlugin(this);
		// cascade to children
		var plugins = DoCASU.App.PerspectiveManager.getPerspective().plugins;
		for(i in plugins) {
			var config = plugins[i];
			if(typeof config != "function") {
				var plugin = this.createPlugin(config);
				plugin.register();
			}
		}
	},
	
	createPlugin : function(config) {
		var createPluginString = "new " + config.namespace + "." + config.id + "( " + Ext.util.JSON.encode(config) + ");";
		var plugin = eval(createPluginString);
		return plugin;
	},
	
	createComponent : function(config) {
		var createComponentString = "new " + config.namespace + "." + config.id + "( " + Ext.util.JSON.encode(config) + ");";
		var component = eval(createComponentString);
		return component;
	}

}); // eo DoCASU.App.PluginManager

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


// DoCASUComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App");

/* constructor */
DoCASU.App.Component = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Component.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Component, Ext.util.Observable, {
	// configuration options
	id			:	"Component",
	title		:	"Component",
	file		:	"../../docasu/lib/docasu/DoCASUComponent.js", // JS source file
	pluginId	:	"", // parent plugin id - this should be parent plugin and not target plugin
	disabled	:	false, // disabled : true only if the plugin should not be used and it is not required
	required	:	false, // required : true only if there are other plugins/components that depend on the features of this plugin
	// UI config
	uiClass		:	"", // the ExtJS object(widget)  to create - ie Ext.Viewport
	getUIConfig : function() {
		var uiConfig = {};
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	closable	:	false, // closable : true only if the UI allows this component to be closed
	closed		:	false, // closed : true if this component should be closed and it's allowed to be closed
	minimizable	:	false, // minimizable : true only if the UI allows this component to be minimized
	minimized	:	false, // minimized : true if this component should be minimized and it's allowed to be minimized
	// state
	components	:	[], // children components
	
	register : function() {
		var pluginManager = DoCASU.App.PluginManager.getPluginManager();
		pluginManager.registerComponent(this);
		// cascade to children
		for(i in this.components) {
			var config = this.components[i];
			if(typeof config != "function") {
				var component = pluginManager.createComponent(config);
				component.register();
			}
		}
	},
	
	init : function() {
		var pluginManager = DoCASU.App.PluginManager.getPluginManager();
		// do custom init if parent plugin enabled
		var parentPlugin = pluginManager.getPlugin(this.pluginId, this.namespace);
		if(!parentPlugin.required && parentPlugin.disabled) {
			return;
		}
		// do custom init if component enabled
		if(!this.required && this.disabled) {
			return;
		}
		// cascade to children
		for(i in this.components) {
			var config = this.components[i];
			if(typeof config != "function") {
				var component = pluginManager.getComponent(config.id, config.namespace);
				component.init();
			}
		}
		// init UI if existent
		if(!this.uiClass || this.uiClass == null || this.uiClass.indexOf("Ext") < 0) {
			return;
		}
		// create UI object(component) if not closed
		if(this.closable && this.closed) {
			return;
		}
		// add UI children to this UI widget 
		var uiConfig = this.getUIConfig();
		if(!uiConfig.items) {
			uiConfig.items = []; // add container capabilities
		}
		for(i in this.components) {
			var component = this.components[i];
			if(typeof component != 'function') {
				try {
					var uiWidgetChild = pluginManager.getUIWidget(component.id);
					uiConfig.items.push(uiWidgetChild);
				} catch(err) {
					// widget was not created because: widget is not enabled, is closed or parent plugin is not enabled
				}
			}
		}
		if(uiConfig.items.length <= 0) {
			uiConfig.items = undefined; // the widget should not be a container
		}
		var createUIComponentString = "new "+ this.uiClass + "();";
		var uiWidget = eval(createUIComponentString); // create the UI object without the configuration first
		// apply configuration to UI widget
		uiWidget.constructor.call(uiWidget, uiConfig); // at this point, the component is registered in Ext.getCmp(this.id);
		// check if minimized
		if(this.minimizable && this.minimized) {
			// TODO: minimize ExtJS Window
		}
		uiWidget.doLayout(); // make changes visible
	}
}); // eo DoCASU.App.Component
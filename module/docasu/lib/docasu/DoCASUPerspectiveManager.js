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

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App");

DoCASU.App.PerspectiveManager = new Object({

	namespace	:	"DoCASU.App.Perspectives",

	loadDefaultPerspective : function() {
		return DoCASU.App.Perspectives.DoCASUPerspective.getPerspective();
	},
	
	getPerspective : function() {
		var perspective = Ext.state.Manager.get(this.namespace + ".perspective");
		if(!perspective || perspective == null) {
			// load default perspective
			perspective = this.loadDefaultPerspective();
			this.savePerspective(perspective);
		}
		return perspective;
	},
	
	savePerspective : function(perspective) {
		Ext.state.Manager.set(this.namespace + ".perspective", perspective);
	},
	
	getScriptFilesFromPerspective : function() {
		var perspective = this.getPerspective();
		var files = [];
		files.push(perspective.pluginManager.file);
		var plugins = perspective.plugins;
		if(plugins && plugins != null) {
			for(i in plugins) {
				if(typeof plugins[i] != "function") {
					this.getScriptFilesFromConfig(plugins[i], files);
				}
			}
		}
		return files;
	},
	
	getScriptFilesFromConfig : function(config, files) {
		if(!files || files == null) {
			files = [];
		}
		var plugins = config.plugins;
		if(plugins && plugins != null) {
			for(i in plugins) {
				if(typeof plugins[i] != "function") {
					this.getScriptFilesFromConfig(plugins[i], files);
				}
			}
		}
		var components = config.components;
		if(components && components != null) {
			for(i in components) {
				if(typeof components[i] != "function") {
					this.getScriptFilesFromConfig(components[i], files);
				}
			}
		}
		files.push(config.file);
		return files;
	}
	
}); // eo DoCASU.App.PerspectiveManager


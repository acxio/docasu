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

// cookieProvider to save selected perspective by id
var cookieProvider = new Ext.state.CookieProvider();

DoCASU.App.PerspectiveManager = new Object({

	namespace	:	"DoCASU.App.Perspectives",

	switchToPerspectiveById : function(newPerspectiveId) {
		// 1. we need to save the new perspective id...
		this.savePerspectiveId(newPerspectiveId);
		// 2. reload the application
		this.reloadApplicationByPerspectiveId(newPerspectiveId);
	},

	/* We have to assure that the new perspective has been successfully 
	 * saved to a cookie before we can actually reload the application, 
	 * (by looped timer pattern) otherwise we'll only end up reloading 
	 * the current perspective.
	 */	
	reloadApplicationByPerspectiveId : function(newPerspectiveId) {
		var savedPerspectiveId = this.loadPerspectiveId();
		if(!savedPerspectiveId || savedPerspectiveId == null || savedPerspectiveId != newPerspectiveId) {
			this.reloadApplicationByPerspectiveId(newPerspectiveId);
		} else {
			// reload the application...
			DoCASU.App.ApplicationManager.getApplication().reload();
		}
		timer = setTimeout("this.reloadApplicationByPerspectiveId("+newPerspectiveId+")",1000);		
	},
	
	getPerspective : function() {
		//var perspective = Ext.state.Manager.get(this.namespace + ".perspective");
		var perspective = this.loadPerspectiveById(this.loadPerspectiveId());
		if(!perspective || perspective == null) {
			// load default perspective
			perspective = this.loadDefaultPerspective();
			this.savePerspectiveId(perspective.id);
		}
		return perspective;
	},
	
	loadDefaultPerspective : function() {
		return DoCASU.App.Perspectives.DoCASUPerspective.getPerspective();
		//return DoCASU.App.Perspectives.DoCASUCategoriesPerspective.getPerspective();
	},
	
	loadPerspectiveById : function(perspectiveId) {
		var perspective = null;
		
		if(!perspectiveId || perspectiveId == null || perspectiveId == "") {
			// if we don't have a id load default perspective
			perspective = this.loadDefaultPerspective();
		} else {
			try {
				// we try to load the perspective by id
				var perspectiveEval = "DoCASU.App.Perspectives."+perspectiveId+".getPerspective()";
				perspective = eval( "(" + perspectiveEval + ")" );
			} catch(err) {
				console.error("DoCASU.App.PerspectiveManager.loadPerspectiveById: "+err);
			}
			if(!perspective || perspective == null) {
				// load default perspective
				perspective = this.loadDefaultPerspective();
			}		
		}
		return perspective;
	},
	
	loadPerspectiveId : function() {
		return cookieProvider.get(this.namespace + ".perspective");
	},
	
	savePerspectiveId : function(perspectiveId) {
		cookieProvider.set(this.namespace + ".perspective", perspectiveId);
	},
	
	savePerspective : function(perspective) {
		//Ext.state.Manager.set(this.namespace + ".perspective", perspective);
		this.savePerspectiveId(perspective.id);
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


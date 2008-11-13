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


// PasteAllAction

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.PasteAllAction = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.PasteAllAction.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
		"beforepaste",
		"afterpaste",
		"fail"
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.PasteAllAction, DoCASU.App.Component, {
	// configuration options
	id			:	"PasteAllAction",
	title		:	"Paste All Action",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	
	paste : function(folderId) {
		// fire beforepaste event
		this.fireEvent("beforepaste", this);
		var items = DoCASU.App.PluginManager.getPluginManager().getComponent("ClipboardComponent", "DoCASU.App.Core").getAll();
		var c = "";
		for (var i=0; i < items.length; i++) {
			var iArr = (items[i] + "").split(";");
			if (iArr.length == 3) {
				c += DoCASU.App.Utils.trim(iArr[2]) + ",";
			}
		}
		c = c.substr(0, c.length -1); // removing trailing comma
		Ext.Ajax.request({
			url: 'ui/folder/paste/' + folderId,
			method: 'POST',
			params: {c : c},
			success: function(response, options) {
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("PasteAllAction", "DoCASU.App.Core");
				// check response for errors
				if(DoCASU.App.Error.checkHandleErrors("Failed to paste clipboard", response)) {
					// fire fail event
					component.fireEvent("fail", component, response);
				} else {
					// fire afterpaste event
					component.fireEvent("afterpaste", component, response);
				}
			}, 
			failure: function(response, options) {
				DoCASU.App.Error.handleFailureMessage("Failed to paste clipboard", response);
				// fire fail event
				var component = DoCASU.App.PluginManager.getPluginManager().getComponent("PasteAllAction", "DoCASU.App.Core");
				component.fireEvent("fail", component, response);
			}
		});
	}

}); // eo DoCASU.App.Core.PasteAllAction

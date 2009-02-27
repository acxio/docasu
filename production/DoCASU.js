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


// DoCASU main - everything begins here


/* entry point to DoCASU */
Ext.onReady( function() {
	// custom config
	Ext.BLANK_IMAGE_URL = "../../docasu/lib/extjs/resources/images/default/s.gif";
	Ext.QuickTips.init();
	// DON'T USE COOKIES TO STORE DATA - MAXIMUM WAS REACHED
	/*Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
		path		:	"/DoCASUApp/",
		expires		:	new Date(new Date().getTime()+(1000*60*60*24*30)) //30 days
	}));*/
	document.oncontextmenu = function(e) {
		// remove default context menu
		if(!e) {e = window.event;}
		if(e.returnValue) {e.returnValue = false;}
		if(e.preventDefault) {e.preventDefault();}
		return false;
	};

	DoCASU.App.onReady();
});

/* runs when all the resources are loaded */
DoCASU.App.onReady = function() {
	DoCASU.App.PluginManager.register();
	var pluginManager = DoCASU.App.PluginManager.getPluginManager();
	
	var docasuCorePlugin = pluginManager.getPlugin("DoCASUCorePlugin", "DoCASU.App.Core");
	docasuCorePlugin.init();
	
	var docasuHelpPlugin = pluginManager.getPlugin("DoCASUHelpPlugin", "DoCASU.App.Help");
	docasuHelpPlugin.init();
	
	new Ext.LoadMask(Ext.getBody()).hide();
}

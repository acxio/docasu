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


// SecondaryScreenComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.SecondaryScreenComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.SecondaryScreenComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.SecondaryScreenComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"SecondaryScreenComponent",
	title		:	"Secondary Screen Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	disabled	:	true,
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		var uiConfig	=	{
								// config
								id			:	this.id,
								// look
								title		:	"Secondary Screen",
								region		:	"south",
								height		:	350,
								layout		:	"fit",
								split		:	true,
								collapsible	:	true,
								collapsed	:	true,
								collapseMode:	"mini",
								hideCollapseTool	:	true,
								header		:	true,
								border		:	true
							}; // the config to construct the UI object(widget)
		return uiConfig;
	} // the config to construct the UI object(widget) - use function for better control on building the JSON configuration		

}); // eo DoCASU.App.Core.SecondaryScreenComponent

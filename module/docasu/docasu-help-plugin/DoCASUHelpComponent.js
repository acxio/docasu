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
 

// DoCASUHelpComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Help");

/* constructor */
DoCASU.App.Help.DoCASUHelpComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Help.DoCASUHelpComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Help.DoCASUHelpComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"DoCASUHelpComponent",
	title		:	"DoCASU Help Component",
	namespace	:	"DoCASU.App.Help", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		var uiConfig	=	{
								id			:	this.id,
								title		:	"Help",
								width		:	720,
								height		:	650,
								resizable	:	true,
								draggable	:	true,
								border		:	false,
								x			:	50,
								y			:	50,
								iconCls		:	"icon-grid",
								animCollapse:	false,
								items		:	[{
											        xtype			:	"tabpanel",
											        deferredRender	:	false,
											        defaults		:	{autoScroll:true},
											        defaultType		:	"iframepanel",
											        activeTab		:	0,
											        items			:	[
											        						{
												        						title	:	"Alfresco",
																                id		:	"alfresco-help",
																				html	:	"<a target=\"_blank\" href=\"http://www.alfresco.com/help/webclient\">Alfresco Help</a>",
																				height	:	380
																			},
																			{
															                   title	:	"DoCASU",
															                   id		:	"docasu-help", 
																			   html		:	"<div>Coming soon</div>",
															                   height	:	380
											               					}
											               				]
						          				}] // eo Help items
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration
	
	show : function() {
		this.init();
		DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id).show();
	} // eo show

}); // eo DoCASU.App.Help.DoCASUHelpComponent

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
Ext.namespace("DoCASU.App.Perspectives");

DoCASU.App.Perspectives.DoCASUPerspective = new Object({

	getPerspective : function() {
		var docasuCorePluginConfig = this.getDoCASUCorePluginConfig();
		var docasuHelpPluginConfig = this.getDoCASUHelpPluginConfig();
		return	{	// DoCASUPerspective
				id				:	"DoCASUPerspective",
				title			:	"DoCASU Perspective",
				pluginManager	:	{	// DoCASUPluginManager
										id			:	"DoCASUPluginManager",
										file		:	"../../docasu/lib/docasu/DoCASUPluginManager.js",
										namespace	:	"DoCASU.App", // each plugin is stored under a specified namespace - must be different than any class name
									}, // eo DoCASUPluginManager
				plugins			:	[	// configure plugins
										docasuCorePluginConfig,
										docasuHelpPluginConfig
									] // eo configure plugins
			}; // eo  DoCASU Perspective
	}, // eo getPerspective
	
	getDoCASUCorePluginConfig : function() {
		var docasuLayoutComponentConfig = this.getDoCASULayoutComponentConfig();
		return 	{	// DoCASUCorePlugin
					id			:	"DoCASUCorePlugin",
					file		:	"../../docasu/docasu-core-plugin/DoCASUCorePlugin.js",
					namespace	:	"DoCASU.App.Core", // each plugin is stored under a specified namespace - must be different than any class name
					components	:	[ // DoCASUCorePlugin components
										docasuLayoutComponentConfig,
										{	// LogoutAction
											id			:	'LogoutAction',
											file		:	"../../docasu/docasu-core-plugin/actions/LogoutAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo // LogoutAction
									] // eo DoCASUCorePlugin components
				}; // eo DoCASUCorePlugin
	}, // eo getDoCASUCorePluginConfig
	
	getDoCASULayoutComponentConfig : function() {
		var docasuHeaderComponentConfig = this.getDoCASUHeaderComponentConfig();
		var docasuWestComponentConfig = this.getDoCASUWestComponentConfig();
		var docasuCenterComponentConfig = this.getDoCASUCenterComponentConfig();
		var docasuEastComponentConfig = this.getDoCASUEastComponentConfig();
		var docasuFooterComponentConfig = this.getDoCASUFooterComponentConfig();
		return	{	// DoCASULayoutComponent
					id			:	'DoCASULayoutComponent',
					file		:	"../../docasu/docasu-core-plugin/DoCASULayoutComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ // DoCASULayoutComponent components
										docasuHeaderComponentConfig,
										docasuWestComponentConfig,
										docasuCenterComponentConfig,
										docasuEastComponentConfig,
										docasuFooterComponentConfig
									] // eo DoCASULayoutComponent components
				}; // eo DoCASULayoutComponent
	}, // eo getDoCASULayoutComponentConfig
	
	getDoCASUHeaderComponentConfig : function() {
		return	{	// DoCASUHeaderComponent
					id			:	'DoCASUHeaderComponent',
					file		:	"../../docasu/docasu-core-plugin/header/DoCASUHeaderComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ 
										{	// DoCASULogoComponent
											id			:	'DoCASULogoComponent',
											file		:	"../../docasu/docasu-core-plugin/header/DoCASULogoComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugi
										}, // eo DoCASULogoComponent
										{	// CenterHeaderComponent
											id			:	'CenterHeaderComponent',
											file		:	"../../docasu/docasu-core-plugin/header/CenterHeaderComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo CenterHeaderComponent
										{	// SearchFormComponent
											id			:	'SearchFormComponent',
											file		:	"../../docasu/docasu-core-plugin/header/SearchFormComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo SearchFormComponent
									] // eo DoCASUHeaderComponent components
				}; // eo DoCASUHeaderComponent
	}, // eo getDoCASUHeaderComponentConfig
	
	getDoCASUWestComponentConfig : function() {
		return	{	// DoCASUWestComponent
					id			:	'DoCASUWestComponent',
					file		:	"../../docasu/docasu-core-plugin/west/DoCASUWestComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[	// DoCASUWestComponent components
										{	// CompanyHomeTreeComponent
											id			:	'CompanyHomeTreeComponent',
											file		:	"../../docasu/docasu-core-plugin/west/CompanyHomeTreeComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo CompanyHomeTreeComponent
										{	// FavoritesComponent
											id			:	'FavoritesComponent',
											file		:	"../../docasu/docasu-core-plugin/west/FavoritesComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo FavoritesComponent
										{	// ClipboardComponent
											id			:	'ClipboardComponent',
											file		:	"../../docasu/docasu-core-plugin/west/ClipboardComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo ClipboardComponent
									] // eo DoCASUWestComponent components
				}; // eo DoCASUWestComponent
	}, // eo getDoCASUWestComponentConfig
	
	getDoCASUCenterComponentConfig : function() {
		return	{	// DoCASUCenterComponent
					id			:	'DoCASUCenterComponent',
					file		:	"../../docasu/docasu-core-plugin/center/DoCASUCenterComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
				}; // eo DoCASUCenterComponent
	}, // eo getDoCASUCenterComponentConfig
	
	getDoCASUEastComponentConfig : function() {
		return	{	// DoCASUEastComponent
					id			:	'DoCASUEastComponent',
					file		:	"../../docasu/docasu-core-plugin/east/DoCASUEastComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
				}; // eo DoCASUEastComponent
	}, // eo getDoCASUEastComponentConfig
	
	getDoCASUFooterComponentConfig : function() {
		return	{	// DoCASUFooterComponent
					id			:	'DoCASUFooterComponent',
					file		:	"../../docasu/docasu-core-plugin/footer/DoCASUFooterComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
				}; // eo DoCASUFooterComponent
	}, // eo getDoCASUFooterComponentConfig
	
	getDoCASUHelpPluginConfig : function() {
		return 	{	// DoCASUHelpPlugin
					id			:	"DoCASUHelpPlugin",
					file		:	"../../docasu/docasu-help-plugin/DoCASUHelpPlugin.js",
					namespace	:	"DoCASU.App.Help", // each plugin is stored under a specified namespace - must be different than any class name
					components	:	[ // DoCASUHelpPlugin components
										{	// DoCASUHelpComponent
											id			:	'DoCASUHelpComponent',
											file		:	"../../docasu/docasu-help-plugin/DoCASUHelpComponent.js",
											pluginId	:	"DoCASUHelpPlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Help" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo // DoCASUHelpComponent
									] // eo DoCASUHelpPlugin components
				}; // eo DoCASUHelpPlugin
	}, // eo getDoCASUHelpPluginConfig
	
}); // eo DoCASU.App.Perspectives.DoCASUPerspective
 
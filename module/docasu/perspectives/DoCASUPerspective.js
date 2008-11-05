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
		return	{	// DoCASUPerspective
				id				:	"DoCASUPerspective",
				title			:	"DoCASU Perspective",
				pluginManager	:	{	// DoCASUPluginManager
										id			:	"DoCASUPluginManager",
										file		:	"../../docasu/lib/docasu/DoCASUPluginManager.js",
										namespace	:	"DoCASU.App", // each plugin is stored under a specified namespace - must be different than any class name
									}, // eo DoCASUPluginManager
				plugins			:	[	// configure plugins
										docasuCorePluginConfig
									] // eo configure plugins
			}; // eo  DoCASU Perspective
	},
	
	getDoCASUCorePluginConfig : function() {
		return 	{	// DoCASUCorePlugin
					id			:	"DoCASUCorePlugin",
					file		:	"../../docasu/docasu-core-plugin/DoCASUCorePlugin.js",
					namespace	:	"DoCASU.App.Core", // each plugin is stored under a specified namespace - must be different than any class name
					components	:	[ // DoCASUCorePlugin components
										{	// DoCASULayoutComponent
											id			:	'DoCASULayoutComponent',
											file		:	"../../docasu/docasu-core-plugin/DoCASULayoutComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
											components	:	[ 
																{	// TopBarComponent
																	id			:	'TopBarComponent',
																	file		:	"../../docasu/docasu-core-plugin/TopBarComponent.js",
																	pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
																	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
																	components	:	[ 
																						{	// DoCASULogoComponent
																							id			:	'DoCASULogoComponent',
																							file		:	"../../docasu/docasu-core-plugin/DoCASULogoComponent.js",
																							pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
																							namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugi
																						}, // eo DoCASULogoComponent
																						{	// CenterHeaderComponent
																							id			:	'CenterHeaderComponent',
																							file		:	"../../docasu/docasu-core-plugin/CenterHeaderComponent.js",
																							pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
																							namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
																						}, // eo CenterHeaderComponent
																						{	// SearchFormComponent
																							id			:	'SearchFormComponent',
																							file		:	"../../docasu/docasu-core-plugin/SearchFormComponent.js",
																							pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
																							namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
																						} // eo SearchFormComponent
																					] // eo TopBarComponent components
																} // eo TopBarComponent
															] // eo DoCASULayoutComponent components
										} // eo DoCASULayoutComponent
									] // eo DoCASUCorePlugin components
				}; // eo DoCASUCorePlugin
	}
}); // eo DoCASU.App.Perspectives.DoCASUPerspective
 
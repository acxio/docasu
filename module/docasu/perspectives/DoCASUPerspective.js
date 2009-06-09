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
		var docasuAirPluginConfig = this.getDoCASUAirPluginConfig();
		var docasuSharePluginConfig = this.getDoCASUSharePluginConfig();

		return	{	// DoCASUPerspective
				id				:	"DoCASUPerspective",
				title			:	"DoCASU Perspective",
				pluginManager	:	{	// DoCASUPluginManager
										id			:	"DoCASUPluginManager",
										file		:	getContextBase() + "/docasu/lib/docasu/DoCASUPluginManager.js",
										namespace	:	"DoCASU.App" // each plugin is stored under a specified namespace - must be different than any class name
									}, // eo DoCASUPluginManager
				plugins			:	[	// configure plugins
										docasuCorePluginConfig,
										docasuHelpPluginConfig,
										docasuAirPluginConfig,
										docasuSharePluginConfig
									] // eo configure plugins
			}; // eo  DoCASU Perspective
	}, // eo getPerspective
	
	getDoCASUCorePluginConfig : function() {
		var docasuLayoutComponentConfig = this.getDoCASULayoutComponentConfig();
		var docasuActionContainerConfig = this.getDoCASUActionContainerConfig();
		var fileDetailsComponentConfig = this.getFileDetailsComponentConfig();
		var advancedSearchComponentConfig = this.getAdvancedSearchComponentConfig();
		return 	{	// DoCASUCorePlugin
					id			:	"DoCASUCorePlugin",
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/DoCASUCorePlugin.js",
					namespace	:	"DoCASU.App.Core", // each plugin is stored under a specified namespace - must be different than any class name
					components	:	[ // DoCASUCorePlugin components
										docasuLayoutComponentConfig,
										docasuActionContainerConfig,
										fileDetailsComponentConfig,
										advancedSearchComponentConfig,
										{	// UpdateFileComponent
											id			:	"UpdateFileComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/file/UpdateFileComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo UpdateFileComponent
										{	// UploadFilesComponent
											id			:	"UploadFilesComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/file/UploadFilesComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo UploadFilesComponent
										{	// FolderDetailsComponent
											id			:	"FolderDetailsComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/folder/FolderDetailsComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo FolderDetailsComponent
										{	// CreateFolderComponent
											id			:	"CreateFolderComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/folder/CreateFolderComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo CreateFolderComponent
										{	// DeleteFolderComponent
											id			:	"DeleteFolderComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/folder/DeleteFolderComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo DeleteFolderComponent
										{	// CopyFolderComponent
											id			:	"CopyFolderComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/folder/CopyFolderComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo CopyFolderComponent
										{	// RenameFolderComponent
											id			:	"RenameFolderComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/folder/RenameFolderComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo RenameFolderComponent
										{	// EditContentComponent
											id			:	"EditContentComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/file/EditContentComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo EditContentComponent
										{	// CreateContentComponent
											id			:	"CreateContentComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/file/CreateContentComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo CreateContentComponent
									] // eo DoCASUCorePlugin components
				}; // eo DoCASUCorePlugin
	}, // eo getDoCASUCorePluginConfig
	
	getFileDetailsComponentConfig : function() {
		return	{	// FileDetailsComponent
					id			:	"FileDetailsComponent",
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/file/FileDetailsComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ // FileDetailsComponent components
									] // eo FileDetailsComponent components
				}; // eo FileDetailsComponent
	}, // eo getFileDetailsComponentConfig
	
	getAdvancedSearchComponentConfig : function() {
		return	{	// AdvancedSearchComponent
					id			:	"AdvancedSearchComponent",
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/advanced-search/AdvancedSearchComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ // AdvancedSearchComponent components
									] // eo AdvancedSearchComponent components
				}; // eo AdvancedSearchComponent
	}, // eo getAdvancedSearchComponentConfig	
	
	getDoCASUActionContainerConfig : function() {
		return	{	// DoCASUActionContainer
					id			:	"DoCASUActionContainer",
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/DoCASUActionContainer.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ // DoCASUActionContainer actions
										{	// AddFavoriteAction
											id			:	"AddFavoriteAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/AddFavoriteAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // AddFavoriteAction
										{	// LoadFavoritesAction
											id			:	"LoadFavoritesAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/LoadFavoritesAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // LoadFavoritesAction
										{	// LoadRecentDocumentsAction
											id			:	"LoadRecentDocumentsAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/LoadRecentDocumentsAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // LoadRecentDocumentsAction
										{	// RemoveFavoritesAction
											id			:	"RemoveFavoriteAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/RemoveFavoriteAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // RemoveFavoriteAction
										{	// DeleteNodeAction
											id			:	"DeleteNodeAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/DeleteNodeAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // DeleteNodeAction
										{	// PasteAllAction
											id			:	"PasteAllAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/PasteAllAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // PasteAllAction
										{	// CheckinFileAction
											id			:	"CheckinFileAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/CheckinFileAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // CheckinFileAction
										{	// CheckoutFileAction
											id			:	"CheckoutFileAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/CheckoutFileAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // CheckoutFileAction
										{	// UndoCheckoutFileAction
											id			:	"UndoCheckoutFileAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/UndoCheckoutFileAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // UndoCheckoutFileAction
										{	// GetFileContentAction
											id			:	"GetFileContentAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/GetFileContentAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // GetFileContentAction
										{	// UpdateFileContentAction
											id			:	"UpdateFileContentAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/UpdateFileContentAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // UpdateFileContentAction
										{	// CreateFileContentAction
											id			:	"CreateFileContentAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/CreateFileContentAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // CreateFileContentAction
										{	// LoadFolderAction
											id			:	"LoadFolderAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/LoadFolderAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // LoadFolderAction
										{	// CreateFolderAction
											id			:	"CreateFolderAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/CreateFolderAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // CreateFolderAction
										{	// RenameFolderAction
											id			:	"RenameFolderAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/RenameFolderAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // RenameFolderAction
										{	// SearchAction
											id			:	'SearchAction',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/SearchAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // SearchAction										
										{	// LoadFolderPermissionsAction
											id			:	"LoadFolderPermissionsAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/LoadFolderPermissionsAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // LoadFolderPermissionsAction
										{	// LoadFolderPropertiesAction
											id			:	"LoadFolderPropertiesAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/LoadFolderPropertiesAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // LoadFolderPropertiesAction
										{	// LogoutAction
											id			:	"LogoutAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/LogoutAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // SaveDocumentPropertiesAction
										{	// SaveDocumentPropertiesAction
											id			:	"SaveDocumentPropertiesAction",
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/actions/SaveDocumentPropertiesAction.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo // SaveDocumentPropertiesAction
									] // eo DoCASUActionContainer actions
				};
	}, // eo getDoCASUActionContainerConfig
	
	getDoCASULayoutComponentConfig : function() {
		var docasuHeaderComponentConfig = this.getDoCASUHeaderComponentConfig();
		var docasuWestComponentConfig = this.getDoCASUWestComponentConfig();
		var docasuCenterComponentConfig = this.getDoCASUCenterComponentConfig();
		var docasuEastComponentConfig = this.getDoCASUEastComponentConfig();
		var docasuFooterComponentConfig = this.getDoCASUFooterComponentConfig();
		return	{	// DoCASULayoutComponent
					id			:	'DoCASULayoutComponent',
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/DoCASULayoutComponent.js",
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
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/DoCASUHeaderComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ 
										{	// DoCASULogoComponent
											id			:	'DoCASULogoComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/DoCASULogoComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugi
										}, // eo DoCASULogoComponent
										{	// CenterHeaderComponent
											id			:	'CenterHeaderComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/CenterHeaderComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo CenterHeaderComponent
										{	// StandardAlfrescoClientButtonComponent
											id			:	'StandardAlfrescoClientButtonComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/StandardAlfrescoClientButtonComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo StandardAlfrescoClientButtonComponent
										{	// SearchFormComponent
											id			:	'SearchFormComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/SearchFormComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo SearchFormComponent
										{	// PerspectiveSelectComponent
											id			:	'PerspectiveSelectComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/PerspectiveSelectComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo PerspectiveSelectComponent
										{	// HelpButtonComponent
											id			:	'HelpButtonComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/HelpButtonComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo HelpButtonComponent
										{	// LogoutButtonComponent
											id			:	'LogoutButtonComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/header/LogoutButtonComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo LogoutButtonComponent
									] // eo DoCASUHeaderComponent components
				}; // eo DoCASUHeaderComponent
	}, // eo getDoCASUHeaderComponentConfig
	
	getDoCASUWestComponentConfig : function() {
		return	{	// DoCASUWestComponent
					id			:	'DoCASUWestComponent',
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/west/DoCASUWestComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[	// DoCASUWestComponent components
										{	// CompanyHomeTreeComponent
											id			:	'CompanyHomeTreeComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/west/CompanyHomeTreeComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo CompanyHomeTreeComponent
										{	// RecentDocumentsComponent
											id			:	'RecentDocumentsComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/west/RecentDocumentsComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo RecentDocumentsComponent
										{	// FavoritesComponent
											id			:	'FavoritesComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/west/FavoritesComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo FavoritesComponent
										{	// ClipboardComponent
											id			:	'ClipboardComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/west/ClipboardComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo ClipboardComponent
										{	// MyHomeTreeComponent
											id			:	'MyHomeTreeComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/west/MyHomeTreeComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo MyHomeTreeComponent
									] // eo DoCASUWestComponent components
				}; // eo DoCASUWestComponent
	}, // eo getDoCASUWestComponentConfig
	
	getDoCASUCenterComponentConfig : function() {
		var mainScreenComponentConfig = this.getMainScreenComponentConfig();
		return	{	// DoCASUCenterComponent
					id			:	'DoCASUCenterComponent',
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/center/DoCASUCenterComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ // DoCASUCenterComponent components
										mainScreenComponentConfig, // eo MainScreenComponent
										{	// SecondaryScreenComponent
											id			:	'SecondaryScreenComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/center/secondary/SecondaryScreenComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo // SecondaryScreenComponent
									] // eo DoCASUCenterComponent components
				}; // eo DoCASUCenterComponent
	}, // eo getDoCASUCenterComponentConfig
	
	getMainScreenComponentConfig : function() {
		return	{ // MainScreenComponent
					id			:	'MainScreenComponent',
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/center/main/MainScreenComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ // MainScreenComponent components
										{	// MainScreenHeaderComponent
											id			:	'MainScreenHeaderComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/center/main/MainScreenHeaderComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // MainScreenHeaderComponent
										{	// CenterViewComponent
											id			:	'CenterViewComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/center/main/CenterViewComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										}, // eo // CenterViewComponent											
									] // eo MainScreenComponent components
				}; // eo MainScreenComponent
	}, // eo getMainScreenComponentConfig
	
	getDoCASUEastComponentConfig : function() {
		return	{	// DoCASUEastComponent
					id			:	'DoCASUEastComponent',
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/east/DoCASUEastComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
					components	:	[ // DoCASUEastComponent components
										{	// GeneralInfoComponent
											id			:	'GeneralInfoComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/east/GeneralInfoComponent.js",
											pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo // GeneralInfoComponent
									] // eo DoCASUEastComponent components
				}; // eo DoCASUEastComponent
	}, // eo getDoCASUEastComponentConfig
	
	getDoCASUFooterComponentConfig : function() {
		return	{	// DoCASUFooterComponent
					id			:	'DoCASUFooterComponent',
					file		:	getContextBase() + "/docasu/plugins/docasu-core-plugin/footer/DoCASUFooterComponent.js",
					pluginId	:	"DoCASUCorePlugin", // parent plugin id - this should be parent plugin and not target plugin
					namespace	:	"DoCASU.App.Core" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
				}; // eo DoCASUFooterComponent
	}, // eo getDoCASUFooterComponentConfig
	
	getDoCASUHelpPluginConfig : function() {
		return 	{	// DoCASUHelpPlugin
					id			:	"DoCASUHelpPlugin",
					file		:	getContextBase() + "/docasu/plugins/docasu-help-plugin/DoCASUHelpPlugin.js",
					namespace	:	"DoCASU.App.Help", // each plugin is stored under a specified namespace - must be different than any class name
					components	:	[ // DoCASUHelpPlugin components
										{	// DoCASUHelpComponent
											id			:	'DoCASUHelpComponent',
											file		:	getContextBase() + "/docasu/plugins/docasu-help-plugin/DoCASUHelpComponent.js",
											pluginId	:	"DoCASUHelpPlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Help" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
										} // eo // DoCASUHelpComponent
									] // eo DoCASUHelpPlugin components
				}; // eo DoCASUHelpPlugin
	}, // eo getDoCASUHelpPluginConfig
	

	getDoCASUAirPluginConfig : function() {
		return 	{	// DoCASUAirPlugin
					id			:	"DoCASUAirPlugin",
					file		:	getContextBase() + "/docasu/plugins/docasu-air-plugin/DoCASUAirPlugin.js",
					namespace	:	"DoCASU.App.Air", // each plugin is stored under a specified namespace - must be different than any class name
					components: [
									{
											id			:	"UploadFilesComponent",
											file		:	getContextBase() + "/docasu/plugins/docasu-air-plugin/UploadFilesComponent.js",
											pluginId	:	"DoCASUAirPlugin", // parent plugin id - this should be parent plugin and not target plugin
											namespace	:	"DoCASU.App.Air" // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
									}
								]
				}; // eo DoCASUHelpPlugin
	}, // eo getDoCASUAirPluginConfig
	
	getDoCASUSharePluginConfig : function() {
		return 	{	// DoCASUSharePlugin
					id			:	"DoCASUSharePlugin",
					file		:	getContextBase() + "/docasu/plugins/docasu-share-plugin/DoCASUSharePlugin.js",
					namespace	:	"DoCASU.App.Share", // each plugin is stored under a specified namespace - must be different than any class name
					components: [
									
								]
				}; // eo DoCASUHelpPlugin
	} // eo getDoCASUAirPluginConfig

}); // eo DoCASU.App.Perspectives.DoCASUPerspective
 
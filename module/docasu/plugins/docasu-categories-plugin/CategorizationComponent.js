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
 

// FileDetailsComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Categories");

/* constructor */
DoCASU.App.Categories.CategorizationComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Categories.CategorizationComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Categories.CategorizationComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"CategorizationComponent",
	title		:	"Categorization Component",
	namespace	:	"DoCASU.App.Categories", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Window",
	getUIConfig : function() {
		var categoriesGrid = new Ext.grid.GridPanel({
			id				:	"categoriesGrid",
			width			:	700,
			height			:	400,
			deferredRender	:	false,
			store : new Ext.data.Store({
				// set proxy before load
				reader : new Ext.data.JsonReader({
					root			:	"rows",
					totalProperty	:	"total",
					id				:	"nodeId",
					fields			:	[
									         {name: "id", type:"string"},
									         {name: "text", type:"string"}
								        ]
				})
			}),
			columns			:	[
							         {header: "Category", width: 200, sortable: true, dataIndex: "text"},
							         {header: "Actions", width: 100, sortable: false, dataIndex: "actions", renderer: this.categoryActionsRenderer}
			          			],
	        sm				:	new Ext.grid.RowSelectionModel({singleSelect:true}),
	        frame			:	false
		});
		var categoriesPanel = new Ext.Panel({
			id			:	"categoriesPanel",
			title		:	"View Categories",
			frame		:	false,
			baseCls		:	"x-plain",
			labelWidth	:	75,
			bodyStyle	:	"padding: 0px",
			layout		:	"fit",
			items		:	[categoriesGrid],
			listeners	:	{
								activate : function() { 
									Ext.getCmp("addCategoryButton").hide();
								}
							}
		});
		// tree for add category window
		var addCategoryTreeLoader = new Ext.tree.TreeLoader({
			dataUrl: "ui/categories",
			requestMethod: "GET"
		});
		addCategoryTreeLoader.on("loadexception", function(treeLoader, node, response) {
			// check for session expiration
			if(DoCASU.App.Session.isSessionExpired(response)) {
				// reload docasu
				DoCASU.App.ApplicationManager.getApplication().reload();
				return;
			}
			DoCASU.App.Error.handleFailureMessage("Failed to load sub-categories", response);
		});
		var addCategoryTree = new Ext.tree.TreePanel({
			border			:	false,
			frame			:	false,				
			enableDD		:	false, // Allow tree nodes to be moved (dragged and dropped)
			autoScroll		:	true,
			containerScroll	:	true,
			deferredRender	:	false,
			loader			:	addCategoryTreeLoader,
			// this adds a root node to the tree and tells it to expand when it is rendered
			root			:	new Ext.tree.AsyncTreeNode({
									id			:	"cm:generalclassifiable", // default classification
									text		:	"Categories",
									draggable	:	false,
									expanded	:	true
								}),
			rootVisible		:	false
		});
		addCategoryTree.on("beforecollapsenode", function (node, deep, anim) {	
			node.loaded = false;
		});		
		addCategoryTree.addListener("click", function (node, event) {
			var categorizationComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CategorizationComponent", "DoCASU.App.Categories");
			categorizationComponent.setSelectedCategory(node.id);
		});
		var addCategoryPanel = new Ext.Panel({
			id				:	"addCategoryPanel",
			title			:	"Add Category",
			frame			:	false,
			baseCls			:	"x-plain",
			labelWidth		:	75,
			bodyStyle		:	"padding: 0px",
			layout			:	"fit",
			border			:	false,
			autoScroll		:	true,
			items			:	[addCategoryTree],
			listeners	:	{
								activate : function() { 
									Ext.getCmp("addCategoryButton").show();
								}
							}
		});
		var uiConfig	=	{
								id			:	this.id,
								title		:	"<b>Categorization</b>",
								width		:	500,
								height		:	500,
								layout		:	"fit",
								modal		:	true,
								resizable	:	false,
								draggable	:	true,
								buttonAlign	:	"center",
								items			:	[
														{
															xtype		:	"tabpanel",
															plain		:	true,
															activeTab	:	0,
															defaults	:	{bodyStyle:"padding:10px"},
															items		:	[
																				categoriesPanel, 
																				addCategoryPanel
																			]
														}
													], // eo items
								buttons		:	[
													{
														id		:	"addCategoryButton",
														text	:	"Add",
														handler : function() {
															// check if any category was selected
															var categorizationComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CategorizationComponent", "DoCASU.App.Categories");
															var categoryId = categorizationComponent.getSelectedCategory();
															categorizationComponent.setSelectedCategory(null);
															var documentId = categorizationComponent.getCurrentDocument();
															if(!categoryId || categoryId == null) {
																Ext.MessageBox.show({
																	title: "Error",
																	msg: "You must select a category first",
																	buttons: Ext.MessageBox.OK,
																	icon: Ext.MessageBox.ERROR
																});
																return false;
															}
															// add category to node
															var addCategoryAction = DoCASU.App.PluginManager.getPluginManager().getComponent("AddCategoryAction", "DoCASU.App.Categories");
															addCategoryAction.save(documentId, categoryId);
														}
													}, 
													{
														id		:	"cancelButton",
														text	:	"Cancel",
														handler : function() {DoCASU.App.PluginManager.getPluginManager().getUIWidget("CategorizationComponent").close();}
													}
												]
							}; // the config to construct the UI object(widget)
		return uiConfig;
	}, // the config to construct the UI object(widget) - use function for better control on building the JSON configuration	
	
	show : function(nodeId, writePermission) {
		// init the window
		this.init();
		var uiWidget;
		try {
			uiWidget = DoCASU.App.PluginManager.getPluginManager().getUIWidget(this.id);
		} catch(err) {
			// no UI widget was created thus component is disabled or closed
			return;
		}
		this.registerHandlers();
		var loadCategoriesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadCategoriesAction", "DoCASU.App.Categories");
		loadCategoriesAction.load(nodeId);
		this.setCurrentDocument(nodeId);
		this.setWritePermission(writePermission);
		this.setSelectedCategory(null);
		uiWidget.show();
	}, // eo show
	
	registerHandlers : function() {
		// register event handlers only once
		if(!this.getEventsRegistered()) {
		
			var loadCategoriesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadCategoriesAction", "DoCASU.App.Categories");
			loadCategoriesAction.on("beforeload", function(action) {
				new Ext.LoadMask(Ext.getBody()).show();
			});
			loadCategoriesAction.on("afterload", function(action, response) {
				new Ext.LoadMask(Ext.getBody()).hide();
			});
			loadCategoriesAction.on("fail", function(action) {
				new Ext.LoadMask(Ext.getBody()).hide();
			});
			
			var addCategoryAction = DoCASU.App.PluginManager.getPluginManager().getComponent("AddCategoryAction", "DoCASU.App.Categories");
			addCategoryAction.on("beforesave", function(action) {
				new Ext.LoadMask(Ext.getBody()).show();
			});
			addCategoryAction.on("aftersave", function(action, response) {
				new Ext.LoadMask(Ext.getBody()).hide();
				Ext.Msg.alert("Status", "Category added successfully");
				DoCASU.App.PluginManager.getPluginManager().getComponent("CategorizationComponent", "DoCASU.App.Categories").reload();
			});
			addCategoryAction.on("fail", function(action) {
				new Ext.LoadMask(Ext.getBody()).hide();
			});
			
			var removeCategoryAction = DoCASU.App.PluginManager.getPluginManager().getComponent("RemoveCategoryAction", "DoCASU.App.Categories");
			removeCategoryAction.on("beforeremove", function(action) {
				new Ext.LoadMask(Ext.getBody()).show();
			});
			removeCategoryAction.on("afterremove", function(action, response) {
				new Ext.LoadMask(Ext.getBody()).hide();
				DoCASU.App.PluginManager.getPluginManager().getComponent("CategorizationComponent", "DoCASU.App.Categories").reload();
			});
			removeCategoryAction.on("fail", function(action) {
				new Ext.LoadMask(Ext.getBody()).hide();
			});
			
			this.setEventsRegistered(true);
		}
	}, // eo registerHandlers
	
	reload : function() {
		var loadCategoriesAction = DoCASU.App.PluginManager.getPluginManager().getComponent("LoadCategoriesAction", "DoCASU.App.Categories");
		loadCategoriesAction.load(this.getCurrentDocument());
	}, // eo reload
	
	categoryActionsRenderer : function(value, column, record) {
		// check if user can perform actions
		var categorizationComponent = DoCASU.App.PluginManager.getPluginManager().getComponent("CategorizationComponent", "DoCASU.App.Categories");
		var retHtml = "";
		if(categorizationComponent.getWritePermission()) {
			retHtml += "<a href=\"#\" onclick=\"DoCASU.App.PluginManager.getPluginManager().getComponent('RemoveCategoryAction', 'DoCASU.App.Categories').remove('"+categorizationComponent.getCurrentDocument()+"','"+record.get("id")+"'); return false;\">";
			retHtml +=   "<img title=\"Remove Category\" class=\"actionIcon\" src=\"" + getContextBase() +"/docasu/images/delete.gif\"/>";
			retHtml += "</a>";
		}
		return retHtml;
	}, // eo categoryActionsRenderer
	
	getCurrentDocument : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".currentDocument");
	}, // eo getCurrentDocument
	
	setCurrentDocument : function(currentDocument) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".currentDocument", currentDocument);
	}, // eo setCurrentDocument
	
	getWritePermission : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".writePermission", false);
	}, // eo getWritePermission
	
	setWritePermission : function(writePermission) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".writePermission", writePermission);
	}, // eo setWritePermission
	
	getSelectedCategory : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".selectedCategory");
	}, // eo getSelectedCategory
	
	setSelectedCategory : function(selectedCategory) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".selectedCategory", selectedCategory);
	}, // eo setSelectedCategory
	
	getEventsRegistered : function() {
		return Ext.state.Manager.get(this.namespace + "." + this.id + ".eventsRegistered", false);
	}, // eo getEventsRegistered
	
	setEventsRegistered : function(eventsRegistered) {
		Ext.state.Manager.set(this.namespace + "." + this.id + ".eventsRegistered", eventsRegistered);
	} // eo setSelectedCategory

}); // eo DoCASU.App.Categories.CategorizationComponent

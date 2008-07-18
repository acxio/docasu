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

var SEARCH_FIELD_WIDTH = 150;
var advSearchWindow;

var gridStore;
var fileSelectionModel;
var simpleSearchQuery = "";
var advancedSearchQuery = "";
var recentDocsStore;

function getCompanyHomeTree() {
	return Ext.getCmp('companyHomeTree');
}

function getMyHomeTree() {
	return Ext.getCmp('myHomeTree');
}

function getToolTip() {
	return Ext.getCmp('toolTip');
}

function getNavigator() {
	return Ext.getCmp('navigator');
}

function preventMe(e) {
	if(!e) e=window.event;
	if(e.returnValue) e.returnValue = false;
	if(e.preventDefault) e.preventDefault();
	return false;
};

document.oncontextmenu = preventMe; 

function setManualStyles() {
//	var navigator = getNavigator();
//	var cssClass = navigator.getEl().dom.firstChild.className;
//	navigator.getEl().dom.firstChild.className = cssClass + ' black-header';
	
	var cmp = Ext.getCmp('east-panel');
	var cssClass = cmp.getEl().dom.firstChild.className;
	cmp.getEl().dom.firstChild.className = cssClass + ' black-header';
	
	cmp = Ext.getCmp('folderPathTitle');
	cssClass = cmp.getEl().dom.firstChild.className;
	cmp.getEl().dom.firstChild.className = cssClass + ' black-header';
	cmp.getEl().dom.lastChild.firstChild.style.height = '50px';
	cmp.getEl().dom.style.width = '100%';
	
	cmp = Ext.getCmp('center-header');
	cmp.getEl().dom.parentNode.style.width = '100%';
	
	cmp = Ext.getCmp('center-action');
	cmp.getEl().dom.parentNode.style.width = '100%';
	
	cmp = Ext.getCmp('top-bar');
	cssClass = cmp.getEl().dom.firstChild.firstChild.className;
	cmp.getEl().dom.firstChild.firstChild.className = cssClass + ' gray-bgnd';
	
	var cmp = Ext.getCmp('docInfoPanel');
	var cssClass = cmp.getEl().dom.firstChild.className;
	cmp.getEl().dom.firstChild.className = cssClass + ' gray-header';
}

function mailLink(name, link) {
	parent.location='mailto:?subject=mailing:%20'+name+'&body=' + escape('<a href="'+location.protocol + '//' + location.host + link+'">'+name+'</a>');		
}

Ext.onReady(function(){

	Ext.BLANK_IMAGE_URL = '../../docasu/lib/extjs/resources/images/default/s.gif';
	Ext.QuickTips.init();
	
	// You have to init TinyMCE manually if you plan to render Ext.ux.TinyMCE in the Ext.onReady handler.
	//Ext.ux.TinyMCE.initTinyMCE();
	
	// Set up state manager using Cookie provider
	var cp = new Ext.state.CookieProvider({
	   path: "/",
	   expires: new Date(new Date().getTime()+(1000*60*60*24*30)) //30 days
	});
	Ext.state.Manager.setProvider(cp);
	// Use Ext.state.Manager.set("key", 'value'); to store values
	// Initialize values
	Ext.state.Manager.set("currentFolder", 'null');
	
	// current user
	Ext.Ajax.request({
		url: 'ui/user',
		method: 'GET',
		success: _init,
		failure: function(result, request){
			//Ext.MessageBox.alert('Must have been 4xx or a 5xx http status code');
			Ext.MessageBox.alert('Failed', 'Failed on user login. \n\r\n\r' + result.responseText);
		}
	});
	
	Ext.Ajax.request({
		url: 'ui/datamodel',
		method: 'GET',
		success: _loadDataModel,
		failure: function(result, request){
			//Ext.MessageBox.alert('Must have been 4xx or a 5xx http status code');
			Ext.MessageBox.alert('Failed', 'Failed to load Data Model. \n\r\n\r' + result.responseText);
		}
	});
		
				//shortcut Node
	//alert('create Short cut node 1!');
	//createShortcutNode();
});

function _loadDataModel(result, request) {
	var modelData = eval(result.responseText);
	Ext.state.Manager.set('cifsHost', modelData.cifsServer);
}

function _init(result, request) {
	
	var user = eval(result.responseText);
	
    // Set the companyHome folder
    Ext.state.Manager.set('companyHomeId', user.companyHome);
    Ext.state.Manager.set('userHomeId', user.userHome);
    Ext.state.Manager.set('userHomeName', user.userHomeName);
    
    _initBreadcrumbs();
	_initNavigator();
  
    
	/* FILE GRID */
	// STORAGE
	/* Data store for the file grid in the main content section */
	gridStore = new Ext.data.Store({
		remoteSort: true,
		
		proxy: new Ext.data.HttpProxy({
			url: 'ui/docs',
			method: 'GET'
		}),
		
        reader: new Ext.data.JsonReader({
            root: 'rows',
            totalProperty: 'total',
            id: 'nodeId',
			fields: [
				{name: 'created', type:'string'},
				{name: 'author', type:'string'},
				{name: 'creator', type:'string'},
				{name: 'description', mapping:'description'},
				{name: 'filePath', type:'string'},
				{name: 'mimetype', type:'string'},
				{name: 'url', type:'string'},
				{name: 'downloadUrl', type:'string'},
				{name: 'modified', type:'string'},
				{name: 'modifier', type:'string'},
				{name: 'name', type:'string'},
				{name: 'nodeId', type:'string'},
				{name: 'link', type: 'string'},
				{name: 'size', type:'int'},
				{name: 'title', type:'string'},
				{name: 'version', type:'string'},
				{name: 'versionable', type:'boolean'},
				{name: 'writePermission', type:'boolean'},
				{name: 'createPermission', type:'boolean'},
				{name: 'deletePermission', type:'boolean'},
				{name: 'locked', type:'boolean'},
				{name: 'editable', type:'boolean'},
				{name: 'isWorkingCopy', type:'boolean'},
				{name: 'iconUrl', type:'string'},
				{name: 'icon32Url', type:'string'},
				{name: 'icon64Url', type:'string'},
				{name: 'isFolder', type:'boolean'},
            ]
		})
	});

	gridStore.on("load", function() {

		var folderName = gridStore.reader.jsonData.folderName;
		var folderId = gridStore.reader.jsonData.folderId;

		updateCurrentFolder(folderId);
		updateBreadcrumbs(folderName, folderId);

		//create folder icon, name and CIFS path
		var folderPath = gridStore.reader.jsonData.path;
		folderPath = '\\Alfresco' + folderPath.substr(13).replace('/', '\\');
		var name = folderName.substr(0, 21);
		var elem = '<a target="new" href="file:///\\\\' +
		Ext.state.Manager.get('cifsHost') +
		folderPath +
		'"><div style="position:relative;top:10px;left:10px;"><img src="../../docasu/images/folder.gif" /></div><div class="folderLogo" style="overflow:hidden;position:relative;top:-20px;left:45px;">' +
		name +
		'</div></a>'

		Ext.get('cifsLink').update(elem);
	});
	
	// SELECTION
	// TODO remove this, seems to be unused!
	var selectionModel = new Ext.grid.CellSelectionModel();

	// globally visible SelectionModel, can (and should!) be used to 
	// determine the currently selected file in the grid
	fileSelectionModel = new Ext.grid.RowSelectionModel({singleSelect:true});

	// GRID	
    var gridList = new Ext.grid.GridPanel({
        id: 'fileGrid',
		region: 'center',
		store: gridStore,
		border: false,
	    columns: [
	        {id:'nodeId', header: "Name", width: 110, sortable: true, dataIndex: 'name', renderer: fileNameRenderer},
	        {header: "Size", width: 20, sortable: true, dataIndex: 'size', renderer: Ext.util.Format.fileSize}, 
	        {header: "Changed", width: 60, sortable: true, dataIndex: 'modified', renderer: timeZoneAwareRenderer},
	        {header: "Created", width: 60, sortable: true, dataIndex: 'created', renderer: timeZoneAwareRenderer},
			{header: "Creator", width: 60, sortable: true, dataIndex: 'creator'},
	        {header: "Action",  sortable: false, dataIndex: 'nodeId', renderer: actionRenderer}
	    ],
	    viewConfig: {
	        forceFit: true
	    },
		bbar: new Ext.PagingToolbar({
            pageSize: 50,
            store: gridStore,
            displayInfo: true,
            displayMsg: 'Displaying file(s) {0} - {1} of {2}',
            emptyMsg: "No files to display"
        }),
	    // sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
	    sm: fileSelectionModel,
	    frame:true,
	    iconCls:'icon-grid'
	});
    
    gridList.on('rowclick', function (grid, rowIndex) {
    	// this event fires when a new row = document is selected in the grid
    	// => update the docinfo panel!
        updateDocumentInfoPane();
    });

	// prevent the default browser context menu for the grid
	gridList.on('contextmenu', function(e){
        e.preventDefault();
        
		if (advancedSearchQuery == '' && simpleSearchQuery == '') {
			this.contextMenu = getFolderContextMenu(Ext.state.Manager.get('currentFolder'));
        
			var xy = e.getXY();
			this.contextMenu.showAt(xy);
		}
    });

    gridList.on('rowcontextmenu', function (grid, rowIndex, e) {
    	e.preventDefault();
    	
        var record = grid.getStore().getAt(rowIndex);
		
        if (record.get('isFolder')) {
        	this.contextMenu = getFolderContextMenu(record.get('nodeId'));
        }
        else {
        	this.contextMenu = getFileContextMenu(record);
        }
        
        var xy = e.getXY();
		this.contextMenu.showAt(xy);
    });

	
    
    gridList.on("mouseover", function(e, t){

    	var rowIndex = this.getView().findRowIndex(t);
//    	console.log("rowIndex " + rowIndex);
    	if (rowIndex === false) {
        	hideToolTip();
    	}
    	else {
    		showToolTip(this.store.getAt(rowIndex));
    	}

    });

 
	// Set sorting for file name, ascending
	gridStore.setDefaultSort('name', 'asc');
	// Load data into grid
	gridStore.load();
	
	/* SEARCH */
	var searchCombo = new Ext.form.ComboBox({
		colspan: 1,
		hiddenName: 't',
		width: 100,
		store: new Ext.data.SimpleStore({
			fields: ['code', 'label'],
			data: [
				['', 'All items'],
				['content', 'Documents'],
				['filename', 'File names'],
				['space', 'Spaces']
			]}),
		displayField: 'label',
		valueField: 'code',
		mode: 'local',
		value: '',
		triggerAction: 'all',
		selectOnFocus: true,
		editable: false
	});
	
	var searchField = new Ext.form.TextField({
		colspan: 1,
		style: 'margin-left: 4px',
		name: 'q',
		hideLabel: true
		});
	searchField.on('specialkey', function(f, event) {
		if(event.getKey() == event.ENTER) {
    		searchForm.form.submit();
		}
	}, this);
	
	var simpleSearchImg = new Ext.Button({
		text: 'Go',
		minWidth: 40,
		handler: handleAddFavorite = function() {
			Ext.getCmp('search-panel').form.submit();
		}
	});
	

	
	var searchForm = new Ext.form.FormPanel({
		id: 'search-panel',
		name: 'searchPanel',
		bodyStyle: 'padding: 4px;margin-top:5px;',
		region: 'east',
		border: false,
		frame: false,
		width: 500,
		layout: 'table',
		items: [{html: '<span class="search-title">Search:</span>', colspan: 1, bodyStyle: 'margin-right: 4px; border-style:none'},
				searchCombo,
				searchField,
				simpleSearchImg,
				{html: '<a href="#" class="header" onclick="showAdvancedSearch();">Advanced&nbsp;Search</a>', border: false, colspan: 1}],
		url: 'ui/ss',
		method: 'GET',	
		listeners: {
			actioncomplete: function(form, action){
				var responseObj = Ext.util.JSON.decode(action.response.responseText);
				
				simpleSearchQuery = searchField.getValue();
				advancedSearchQuery = "";
				
				showSearchResults(responseObj);
			},
			actionfailure: function(form, action){
				Ext.MessageBox.alert('An error occurred while searching.');
			}	
		}
	});
	
	var actionComboBoxStore = new Ext.data.SimpleStore({
		id: 'actionComboBoxStore',
		fields: ['code', 'label'],
		data: [
		    ['createFolder', 'Create Folder'],
			['renameFolder', 'Rename Folder'],
			['deleteFolder', 'Delete Folder'],
			['viewDetails',  'View Details'],
			['pasteAll',     'Paste All'],
			['text', 		 'Create Text File'],
	        ['html', 		 'Create HTML File'],
			['uploadFile', 	 'Upload File']
		]
	});

	var actionComboBox = new Ext.form.ComboBox({
		name: 'actionComboBox',
		id: 'actionComboBox',
	    hiddenName: 't',
		width: 150,
		style: 'margin-left: 12px',
		typeAhead: true,
		emptyText:'View details',
		store: actionComboBoxStore,
		displayField: 'label',
		valueField: 'code',
		mode: 'local',
		value: '',
		triggerAction: 'all',
		selectOnFocus: true,
		editable: false,
		listeners: {
			select: function(f, n, o) {
				if (f.getValue() == 'pasteAll'){
					pasteAll(Ext.state.Manager.get('currentFolder'));
				}else if (f.getValue() == 'deleteFolder'){
					deleteFolder(Ext.state.Manager.get('currentFolder'));
				}else if (f.getValue() == 'viewDetails'){
					showFolderDetailsWindow(Ext.state.Manager.get('currentFolder'));
				}else if (f.getValue() == 'createFolder'){
					createFolder(Ext.state.Manager.get('currentFolder'));
				}else if (f.getValue() == 'copyFolder'){
					copyFolder();
				}else if (f.getValue() == 'renameFolder'){
					renameFolder(Ext.state.Manager.get('currentFolder'));
				}else if (f.getValue() == 'text'){
					createContent('text', Ext.state.Manager.get('currentFolder'));
				}else if (f.getValue() == 'html'){
					createContent('HTML', Ext.state.Manager.get('currentFolder'));
				}else if (f.getValue() == 'uploadFile'){
					showUploadFile(Ext.state.Manager.get('currentFolder'));
				}else{
					Ext.MessageBox.alert('There is no action defined for ' +f.getValue());
				}
			}
		}
	});
	
	/** FORM FIELDS */
	var comboBoxTable = new Ext.Panel({
	    layout:'table',
		border: false,
		id:'actionTable',
		height: 50,
		layoutConfig: {columns: 3},
		bodyStyle:'background: #f1f1f1;width:100%;',
		cls: 'wideTable',
	    items: [{html: '<div id="cifsLink" />', id:'cifsLink', border: false, width: 220, bodyStyle: 'background: none;'},
				{id: 'center-action', border:false, html: '<div />'},
				{html: '<div id="actions" />', id:'actions', layout: 'table', width: 290, border:false, cls:'no-bgnd', items:[
					{html: '<span>Folder actions:</span>', border: false, bodyStyle: 'font-weight:bold;margin-left:20px;width: 100px;'},
					actionComboBox]}
				]
	});	

	var dataview = new Ext.DataView({
		id: 'docInfoDataView',
		//autoHeight:true,
		minHeight: 100,
		autoScroll: true,
		store: new Ext.data.Store({
			fields: ['creator', 'description', 'creator', 'modifier']
		}),
		tpl: new Ext.XTemplate(
				'<tpl for=".">',
				'<table id="infoTable" class="docInfoTable">',
				'<tr valign="top">',
				'<td colspan="4" class="docInfoListItem">',
				'<tpl if="this.isImage(mimetype)">',
				'<img height="64" src="{link}" alt="{title}"/>',
				'</tpl>',
				'<tpl if="!this.isImage(mimetype)">',
				'<img height="32" src="{icon32Url}" alt="{title}"/>',
				'</tpl>',
				'</td>',
				'</tr>',
				'<tr valign="top">',    
				'<td><b>Title:</b></td><td colspan="3">{title}</td>',
				'</tr>',
				'<tr valign="top">',    
				'<td><b>Description:</b></td><td colspan="3">{description}</td>',
				'</tr>',
				'<tr valign="top">',
				'<td><b>Version:</b></td><td colspan="3">{version}</td>',
				'</tr>',
				'<tr valign="top">',    
				'<td><b>Author:</b></td><td colspan="3">{author}</td>',
				'</tr>',
				'<tr valign="top">',    
				'<td><b>Creator:</b></td><td colspan="3">{creator}</td>',
				'</tr>',
				'<tr valign="top">',    
				'<td><b>Modifier:</b></td><td colspan="3">{modifier}</td>',
				'</tr>',
				'<tr valign="top">',
				'<td><b>MIME:</b></td><td colspan="3">{mimetype}</td>',
				'</tr>',
				'<tr valign="top">',
				'<td><b>Size:</b></td><td colspan="3">{[Ext.util.Format.fileSize(values.size)]}</td>',
				'</tr>',
				'<tr valign="top">',
				'<td><b>Created:</b></td><td colspan="3">{[timeZoneAwareRenderer(values.created)]}</td>',
				'</tr>',
				'<tr valign="top">',
				'<td><b>Modified:</b></td><td colspan="3">{[timeZoneAwareRenderer(values.modified)]}</td>',
				'</tr>',
				'</table>',
				'</tpl>',{
					isImage: function(mimetype){
					return mimetype.indexOf("image") == 0;
				}
				}
		),
		itemSelector: 'div.item-selector'
	});

	var header = new Ext.Panel({ 
		region:'north',
		id: "top-bar",
		contentEl: 'north',
		height: 40,
		layout: 'table',
		layoutConfig: {columns: 3 },
		cls: 'header-bar',
		itemCls: 'no-bgnd',
		margins: '5',
		items: [{
			id: 'logo',
			region: 'west',
			width: 205,
			margins: '0 2 0 0',
			border: false,
			html: "<img src='../../docasu/images/logo.gif' alt='Alfresco ECMS' style='margin-top:3px;margin-left:3px;'/>"
		},{
			id: 'center-header',
			region: 'center',
			margins: '0 2 0 2',
			border: false,
			html:'<span class="search-title" style="margin-right:20px;margin-top:5px;">Welcome ' + user.firstName + ' ' + user.lastName + '</span> <a target="_blank" href="../../faces/jsp/browse/browse.jsp" class="header">Standard Alfresco Client</a> <a href="#" onClick="showHelp();" class="header" >Help</a> <a href="#" id="logoutLink" onClick="doLogout();" class="header" >Logout</a>'  
		}, searchForm]
	});

	var center = new Ext.Panel({
	    region:'center',
		border: false,
		contentEl: 'main-center',
	    layout: 'border',
		margins: '0 0 5 0',
		id: 'northPanel',
		items: [{
	        id: 'folderPathTitle',
			height: 70,
			region: 'north',
            title: '',
			header: true,
			items:[comboBoxTable]},
	    	gridList
		]
	});
		
		
	var east = new Ext.Panel({
		region: 'east',
	    id: 'east-panel',
		title: 'Document Info',
		border: true,
		contentEl: 'east',
		split: true,
		collapsible: true,
		collapseMode: 'mini',
		width: 200,
	    minSize: 175,
	    maxSize: 400,
	    layout: 'border',
		margins: '0 5 5 0',	
		items: [{
                id: 'docInfoPanel',
    			name: 'docInfo',
    		    border: false,
				autoScroll: true,
				region: 'center',
                items: [dataview]
	    	}
		]
	});

	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [
			header,
			getNavigator(),
			center,
			east
		]
	});

	var tooltip = new Ext.ToolTip({
		target: 'fileGrid',
		id: 'toolTip',
		trackMouse: true,
		showDelay: 500,
		hideDelay: 0,
		dismissDelay: 5000
	});
	// to prevent strange js errors;
	tooltip.render(document.body);

	// disable tooltip on empty rows
	tooltip.on("beforeshow", function(e, t){
//		console.log('tt no data ' + getToolTip().noData);
		if (getToolTip().noData) {
			return false;
		}
    });
	
	setManualStyles();
	updateFavorites();
	clipboard.update();	
	checkPermissions(null);

}

function _initNavigator() {
	
	var navigator = new Ext.Panel({
		region: 'west', // position in viewport
		contentEl: 'west',
		id: 'navigator',
		title: 'Navigator',
		width: 200,
		minSize: 175,
		maxSize: 400,
		split: true,
		collapsible: true,
		collapseMode: 'mini',
		margins: '0 0 5 5',
		layout: 'accordion',
		layoutConfig: {
			hideCollapseTool: true,
			titleCollapse: true,
			animate: false
		}
	});

	var companyHomeTree = _initCompanyHome();
	var myHomeTree = _initMyHome();
	var recentDocs = _initRencentDocs();
	var favorites = new Ext.Panel({
 		id: 'favoritesPanel',
 		title: 'My Favorites',
 	    html: '<div id="favorites">No favorites defined.<div>',
 	    border: false,
 	    iconCls: 'settings'
	});
	var clipboard = new Ext.Panel({
	    title: 'Clipboard',
	    html: '<div id="clipboard">No items on clipboard.</div>',
	    border: false,
	    iconCls: 'settings'
	});
	
	companyHomeTree.on('beforeexpand', function (panel) {
//		console.log('before expand company home');
		getNavigator().activeTab = 'companyHomeTree';
	});
	companyHomeTree.on('beforecollapse', function (panel) {
//		console.log('before collapse company home');
		if (getNavigator().activeTab == 'companyHomeTree') {
			return false;
		}
	});

	myHomeTree.on('beforeexpand', function (panel) {
//		console.log('before expand my home');
		getNavigator().activeTab = 'myHomeTree';
	});
	myHomeTree.on('beforecollapse', function (panel) {
//		console.log('before collapse my home');
		if (getNavigator().activeTab == 'myHomeTree') {
			return false;
		}
	});

	recentDocs.on('beforeexpand', function (panel) {
//		console.log('before expand recent docs');
		getNavigator().activeTab = 'recentDocs';
	});
	recentDocs.on('beforecollapse', function (panel) {
//		console.log('before collapse recent docs');
		if (getNavigator().activeTab == 'recentDocs') {
			return false;
		}
	});

	favorites.on('beforeexpand', function (panel) {
//		console.log('before expand favorites');
		getNavigator().activeTab = 'favorites';
	});
	favorites.on('beforecollapse', function (panel) {
//		console.log('before collapse favorites');
		if (getNavigator().activeTab == 'favorites') {
			return false;
		}
	});

	clipboard.on('beforeexpand', function (panel) {
//		console.log('before expand clipboard');
		getNavigator().activeTab = 'clipboard';
	});
	clipboard.on('beforecollapse', function (panel) {
//		console.log('before collapse clipboard');
		if (getNavigator().activeTab == 'clipboard') {
			return false;
		}
	});
	
	navigator.add(companyHomeTree);
 	navigator.add(recentDocs);
 	navigator.add(favorites);
 	navigator.add(clipboard);
 	navigator.add(myHomeTree);
 	navigator.doLayout();
 	
 	navigator.activeTab = 'companyHomeTree';
}

function _initCompanyHome() {

	// Tree loader for global directory tree
	var companyHomeTreeLoader = new Ext.tree.TreeLoader({
		dataUrl: 'ui/folders',
		requestMethod: 'GET'
	});

	companyHomeTreeLoader.on("load", function(treeLoader, node) {
		var path = Ext.state.Manager.get('nextActiveFolder');
		if (path != null) {
			// Expand the active folder in the tree structure
			getCompanyHomeTree().expandPath(path);
			Ext.state.Manager.set('nextActiveFolder', null);
		}
	}, this);

	var companyHomeTree = new Ext.tree.TreePanel({
		id: 'companyHomeTree',
		title: '<b>Company Home</b>',
		split: true,
		width: 200,
		minSize: 175,
		maxSize: 400,
		margins: '35 0 5 5',
		cmargins: '35 5 5 5',
		frame: false,
	    border: false,
		// these are the config options for the tree itself				
		autoScroll: true,
		enableDD: false, // Allow tree nodes to be moved (dragged and dropped)
		containerScroll: true,
		loader: companyHomeTreeLoader,
		// this adds a root node to the tree and tells it to expand when it is rendered
		root: new Ext.tree.AsyncTreeNode({
			id: Ext.state.Manager.get('companyHomeId'),
			text: 'Company Home',
			draggable: false,
			expanded: true
		}),
		rootVisible: false
	});

	// Add click listener on header.
	companyHomeTree.on('render', function (panel) {
		if (!('headerClickListener' in panel)) {
			panel.headerClickListener = true;
//			console.log('adding listener to companyHomeTree header');
			panel.header.on('click', function () {
//				console.log('click companyHomeTree header');
				loadFolder(Ext.state.Manager.get('companyHomeId'));
			});
		}
	});

	// in case the tree is modfied via the standard Alfresco GUI, 
	// it needs to be reloaded
	companyHomeTree.on('beforecollapsenode', function (node, deep, anim){	
		node.loaded = false;
	});	

	// Tree event handlers 	
	companyHomeTree.addListener('click', function (node, event){

		// TODO is this used?
		simpleSearchQuery = "";
		advancedSearchQuery = "";

		loadFolder(node.id);
		return false;
	});

	// Custom context menu.
	companyHomeTree.on('contextmenu', function(node, e){
		e.preventDefault();

		this.contextMenu = getFolderContextMenu(node.id);

		var xy = e.getXY();
		this.contextMenu.showAt(xy);
	});

	return companyHomeTree;
}

function _initMyHome() {
	
    // Tree loader for global directory tree
	var myHomeTreeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'ui/folders',
        requestMethod: 'GET'
    });
    
    var myHomeTree = new Ext.tree.TreePanel({
        id: 'myHomeTree',
        title: '<b>My Home</b> ',
        minSize: 175,
        maxSize: 400,
        collapsible: false,
        margins: '35 0 5 5',
        cmargins: '35 5 5 5',
	    border: false,
        frame: false,
        // these are the config options for the tree itself				
        autoScroll: true,
        animate: true,
        enableDD: false,
        containerScroll: true,
        loader: myHomeTreeLoader,
        // this adds a root node to the tree and tells it to expand when it is rendered
        root: new Ext.tree.AsyncTreeNode({
            id: Ext.state.Manager.get('userHomeId'),
            text: Ext.state.Manager.get('userHomeName'),
            draggable: false,
            expanded: true,
            iconCls: "folder"
        }),
		rootVisible: false
    });
	
	// Add click listener on header.
    myHomeTree.on('render', function (panel) {
		if (!('headerClickListener' in panel)) {
			panel.headerClickListener = true;
//			console.log('adding listener to myHomeTree header');
			panel.header.on('click', function () {
//				console.log('click');
				loadFolder(Ext.state.Manager.get('userHomeId'));
			});
		}
	});

	// Tree event handlers 	
    myHomeTree.addListener('click', function (node, event) {

		// TODO is this used?
		simpleSearchQuery = "";
		advancedSearchQuery = "";

		loadFolder(node.id);
		return false;
	});    

	// Custom context menu.
    myHomeTree.on('contextmenu', function(node, e){
		e.preventDefault();
        
		this.contextMenu = getFolderContextMenu(node.id);
	
		var xy = e.getXY();
		this.contextMenu.showAt(xy);
	});

    return myHomeTree;
}

function _initRencentDocs() {

	recentDocsStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'ui/recentdocs',
			method: 'GET'
		}),
		reader: new Ext.data.JsonReader({
			id: 'recentReader',
			root: 'rows',
			fields: [
			         {name: 'name', type:'string'},
			         {name: 'nameIcon', type:'string'},
			         {name: 'path', type:'string'},
			         {name: 'modified', type:'string'}
			         ]
		})
	});

	recentDocsStore.load();

	var recentDocsPanel = new Ext.grid.GridPanel({
		id: 'recentDocsGrid',
		store: recentDocsStore,
		border: false,
		// hideHeaders: true, // hide grid (column) headers
		//layout: 'fit',
		columns: [{id: 'name',dataIndex: 'nameIcon'}
		//{id: 'path', header: "Path", sortable:true, dataIndex: 'path'},
		//{id: 'modified', dataIndex: 'modified'}
		],
		viewConfig: {forceFit: true},
//		sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
		title: 'Latest Documents',
		iconCls: 'settings'
	});

	return recentDocsPanel;
}

function _initBreadcrumbs() {
	Ext.state.Manager.set('breadcrumb3Name', null);
	Ext.state.Manager.set('breadcrumb2Name', null);
	Ext.state.Manager.set('breadcrumb1Name', null);
}

function updateCurrentFolder(folderId){
	Ext.state.Manager.set("currentFolder", folderId);
}

function updateBreadcrumbs(folderName, folderId){
	if (folderId != Ext.state.Manager.get('breadcrumb1Id')) {
		var breadcrumbs = '';
		var tempName = Ext.state.Manager.get('breadcrumb3Name');
		var tempId = Ext.state.Manager.get('breadcrumb3Id');
		if (typeof tempName != 'undefined') {
			breadcrumbs = '<a href="#" class="breadcrumb" onclick="loadFolder(\'' + tempId + '\'); return false;">' + tempName + '</a> &gt; ';
		}
		tempName = Ext.state.Manager.get('breadcrumb2Name');
		tempId = Ext.state.Manager.get('breadcrumb2Id');
		if (typeof tempName != 'undefined') {
			breadcrumbs += '<a href="#" class="breadcrumb" onclick="loadFolder(\'' + tempId + '\'); return false;">' + tempName + '</a> &gt; ';
			Ext.state.Manager.set('breadcrumb3Name', tempName);
			Ext.state.Manager.set('breadcrumb3Id', tempId);
		}
		tempName = Ext.state.Manager.get('breadcrumb1Name');
		tempId = Ext.state.Manager.get('breadcrumb1Id');
		if (typeof tempName != 'undefined') {
			breadcrumbs += '<a href="#" class="breadcrumb" onclick="loadFolder(\'' + tempId + '\'); return false;">' + tempName + '</a> &gt; ';
			Ext.state.Manager.set('breadcrumb2Name', tempName);
			Ext.state.Manager.set('breadcrumb2Id', tempId);
		}
		breadcrumbs += '<a href="#" class="breadcrumb" onclick="loadFolder(\'' + folderId + '\'); return false;">' + folderName + '</a>';
		Ext.state.Manager.set('breadcrumb1Name', folderName);
		Ext.state.Manager.set('breadcrumb1Id', folderId);
	
		Ext.getCmp('folderPathTitle').setTitle(breadcrumbs);
	}
}

function getFileContextMenu(record) {
	var contextMenu = new Ext.menu.Menu({
		id: 'gridCtxMenu',
		items: createActionItems(record)[0],
		listeners: {
			click: function(menu, menuItem, e){
				menu.hide();
			}
		}
	});

	contextMenu.add(
	    {
	    	text: 'View in Browser',
	    	handler: function() {window.open(record.get('link'), '', '')}
	    }, {
	    	text: 'Download File/ Open with...',
	    	handler: function() {window.open(record.get('downloadUrl'), '', '')}
	    }, {
	    	text: 'Add to Favorites',
	    	handler: function() {addFavorite(record.get('nodeId'))}
	    }, {
	    	text: 'Mail Link',
	    	handler: function() {mailLink(record.get('name'), record.get('link'))}
	    }, {
	    	text: 'Copy File Path to System Clipboard',
	    	handler: function() {copyTextToSystemClipboard(record.get('filePath'))}
	    }, {
	    	text: 'Copy File Url To System Clipboard',
	    	handler: function() {copyTextToSystemClipboard(location.protocol + '//' + location.host + record.get('link'))}
	    }
	);
	
	return contextMenu;
}

function getFolderContextMenu(id) {
	var contextMenu = new Ext.menu.Menu({
		id: 'folderCtxMenu',
		items: createActionItemsForFolder(id)[0],
		listeners: {
			click: function(menu, menuItem, e){
				menu.hide();
			}
		}
	});
	
	contextMenu.add(
		    {
		    	text: 'Add to Favorites',
		    	handler: function() {addFavorite(id);}
		    }
		);

	return contextMenu;
}

function showToolTip(row) {
	var size = row.get('size');	
	size = Ext.util.Format.fileSize(size);
	var created = row.get('created');	
	created = timeZoneAwareRenderer(created);
	var modified = row.get('modified');	
	modified = timeZoneAwareRenderer(modified);

	var data = {
			name: row.get('name'),
			title: row.get('title'),
			mimetype: row.get('mimetype'),
			description: row.get('description'),
			path: row.get('path'),
			author: row.get('author'),
			version: row.get('version'),
			size: size,
			creator: row.get('creator'),
			created: created,
			modifier: row.get('modifier'),
			modified: modified
	};
	

	var tooltip = getToolTip();
	
	var tpl = new Ext.Template(
			'<b>{name}</b><br/>'+
			'Title: {title}<br/>'+
			'Description: {description}<br/>'+
			'Version: {version}<br/>'+
			'Author: {author}<br/>'+
			'Creator: {creator}<br/>'+
			'Modifier: {modifier}<br/>'+
			'MIME: {mimetype}<br/>'+
			'Size: {size}<br/>'+
			'Created: {created}<br/>'+
			'Modified: {modified}<br/>');
	tpl.overwrite(tooltip.body, data);
	
	tooltip.noData = false;

	// reset the counter for dismissDelay to 0
	tooltip.show();
}

function hideToolTip() {
	var tooltip = getToolTip();
	tooltip.noData = true;
	tooltip.hide();
}

function createActionItemsForFolder(id) {
	var result = new Array();
	var html = '';
	
	html += '<a href="#" onClick="showFolderDetailsWindow(\''+id+'\');">'+
			'<img title="View details" class="actionIcon" src="../../docasu/images/info.gif"/>'+
			'</a>';
	result.push({
		text: 'View details',
		icon: '../../docasu/images/info.gif',
		handler: function() {showFolderDetailsWindow(id)}}
	);
	
	
	result.push({
		text: 'Create folder',
		handler: function() {createFolder(id)}}
	);
	result.push({
		text: 'Delete folder',
		handler: function() {deleteFolder(id)}}
	);
	result.push({
		text: 'Rename folder',
		handler: function() {renameFolder(id)}}
	);
	result.push({
		text: 'Paste all',
		handler: function() {pasteAll(id)}}
	);
	result.push({
		text: 'Create HTML content',
		handler: function() {createContent('HTML', id)}}
	);
	result.push({
		text: 'Create text content',
		handler: function() {createContent('text', id)}}
	);	
	result.push({
		text: 'Upload file',
		handler: function() {showUploadFile(id)}}
	);	
		
	var returnValue = new Array(result, html);
	return returnValue;
}

function createActionItems(record) {
	var result = new Array();
	var html = '';

	result.push({
		 text: 'Show infos',
		 icon: '../../docasu/images/info.gif',
		 handler: function() {showFileInfos(record.get('nodeId'), record.get('writePermission'))}}
	);
	html += 
		'<a href="#" onclick="showFileInfos(\''+record.get('nodeId')+'\','+record.get('writePermission')+')">'+
			'<img title="Show infos" class="actionIcon" src="../../docasu/images/info.gif"/>'+
		'</a>';
	
	if (!record.get('locked')) {
		if (record.get('writePermission')) {
			if (record.get('editable')) {
				result.push({
					 text: 'Edit',
					 icon: '../../docasu/images/edit.gif',
					 handler: function() {editContent(record.get('name'), record.get('nodeId'))}}
				);
				html += 
					'<a href="#" onclick="editContent(\''+record.get('name')+'\',\''+record.get('nodeId')+'\')">'+
						'<img title="Edit" class="actionIcon" src="../../docasu/images/edit.gif"/>'+
					'</a>';
			}
	   		if (record.get('createPermission')) {
	   			if (record.get('isWorkingCopy')) {
	   				result.push({
	   					 text: 'Checkin',
	   					 icon: '../../docasu/images/checkin.gif',
	   					 handler: function() {checkinFile(record.get('nodeId'))}}
		    		);
					html += 
						'<a href="#" onclick="checkinFile(\''+record.get('nodeId')+'\')">'+
							'<img title="Checkin" class="actionIcon" src="../../docasu/images/checkin.gif"/>'+
						'</a>';
	   				result.push({
	   					 text: 'Undo checkout',
	   					 icon: '../../docasu/images/undo_checkout.gif',
	   					 handler: function() {undoCheckout(record.get('nodeId'))}}
		    		);
					html += 
						'<a href="#" onclick="undoCheckout(\''+record.get('nodeId')+'\')">'+
							'<img title="Undo checkout" class="actionIcon" src="../../docasu/images/undo_checkout.gif"/>'+
						'</a>';
	   			}
	   			else {
	   				result.push({
	   					 text: 'Checkout',
	   					 icon: '../../docasu/images/checkout.gif',
	   					 handler: function() {checkoutFile(record.get('nodeId'))}}
		    		);
	   				html += 
						'<a href="#" onclick="checkoutFile(\''+record.get('nodeId')+'\')">'+
							'<img title="Checkout" class="actionIcon" src="../../docasu/images/checkout.gif"/>'+
						'</a>';
	   				if (record.get('deletePermission')) {
	   					result.push({
	    					 text: 'Delete',
	    					 icon: '../../docasu/images/delete.gif',
	    					 handler: function() {deleteFile(record.get('name'), record.get('nodeId'))}}
		    			);
	   					html += 
   							'<a href="#" onclick="deleteFile(\''+record.get('name')+'\',\''+record.get('nodeId')+'\')">'+
   								'<img title="Delete" class="actionIcon" src="../../docasu/images/delete.gif"/>'+
   							'</a>';
	   				}
	   			}
	   		}
	   		result.push({
				 text: 'Update',
				 icon: '../../docasu/images/update.gif',
				 handler: function() {updateFile(record.get('name'), record.get('nodeId'))}}
			);
	   		html += 
				'<a href="#" onclick="updateFile(\''+record.get('name')+'\',\''+record.get('nodeId')+'\')">'+
					'<img title="Update" class="actionIcon" src="../../docasu/images/update.gif"/>'+
				'</a>';
		}
	   	result.push({
			 text: 'Copy',
			 icon: '../../docasu/images/copy.gif',
			 handler: function() {copyLink(record.get('copyLink'), record.get('name'), record.get('nodeId'))}}
		);
	   	html += 
			'<a href="#" onclick="copyLink(\''+record.get('copyLink')+'\', \''+record.get('name')+'\',\''+record.get('nodeId')+'\')">'+
				'<img title="Copy" class="actionIcon" src="../../docasu/images/copy.gif"/>'+
			'</a>';
   }
	
	var returnValue = new Array(result, html);
   return returnValue;
}

/* ACTIONS */
function loadFolder(folderId) {
	gridStore.baseParams.nodeId = folderId;
	clearDocumentInfoPane();
	checkPermissions(folderId);
	gridStore.load();
	// TODO update all panels !! (search box ?)
}

 function checkPermissions(nodeId) {
	
	Ext.Ajax.request({
		url: 'ui/node/getPermission',
		method: 'GET',
		params: {nodeId : nodeId},
		fileUpload: true,
		//form: Ext.getCmp('filePropertiesForm').getForm().getEl(),
		success: function(response, options){	
			var jsonData = eval("(" + response.responseText + ")" );		
			_addActionItems(jsonData);
	    }, 
		failure: function(){
			Ext.MessageBox.alert('Failed to check permissions.');
		}
	});
}


/**
 * Construct the action dropdown
 * @param {json} jsonData
 */
function _addActionItems(jsonData) {
	
	var store = Ext.getCmp('actionComboBox').store;
	// We first remove all items from the list
	store.removeAll();
	
	var newRec = Ext.data.Record.create([
	    {name: 'code', mapping: 'code'},
	    {name: 'label', mapping: 'label'}
    ]);
	var nbRows = jsonData.total;
	var item = jsonData.rows;
	for (var i=0;i<nbRows;i++) {		
		var myNewRecord = new newRec({
		    code: item[i].code,
		    label: item[i].label
	    });
		store.add(myNewRecord);
	}
}

/**
 * File renderer used in file grid to enable sorting while displaying file icons
 * for the first column.
 * @param {Object} value
 * @param {Object} column
 * @param {Object} record
 */
function fileNameRenderer(value, column, record) {
	var html = '';
	/* 
	<input type='hidden' value='${child[0].name}'/>
	<div style='float:left;'>
		<a href='${url.context}${child[0].url}' target='_blank'>
			<img src='${url.context}${child[0].icon16}' alt='${child[0].name}' />
		</a>
	</div>
	<div>&nbsp;${child[0].name}</div> 
	*/    	 
	
	if (record.get('isFolder') == true) {
		html += '<a href="#" onClick="loadFolder(\''+record.get('nodeId')+'\'); return false;">';
	} else {
		html += '<a href="'+record.get('downloadUrl')+'">';
	}
	html += '<div style="float:left">';
	
	if (record.get('isFolder') == true) {
		html += '<img src="../../docasu/lib/extjs/resources/images/default/tree/folder.gif"';
	} else {
		html += '<img src="'+record.get('iconUrl')+'"';
	}

	html += ' alt="'+record.get('name')+'"';
	html += '</div>';
	html += '<span>&nbsp;'+record.get('name')+'</span>';
	html += '</a>';
	
    return html;
}

function actionRenderer(value, column, record) {
	if (record.get('isFolder')) {
		return createActionItemsForFolder(record.get('nodeId'))[1];
	}
	else {
		return createActionItems(record)[1];
	}
}

// TODO replace this renderer with an anonymous function
/**
 * Renderer that converts dates & times from the JSON response to the
 * user's time zone
 * @param {Object} value
 * @param {Object} column
 * @param {Object} record
 */
function timeZoneAwareRenderer(value, column, record) {
	return convertTimezone(value);
}

// TODO add documentation string!
function convertTimezone(value) {
	// we're using ExtJs's version of the "Date" class here!
	// See http://extjs.com/deploy/dev/docs/?class=Date
	// All we do is parse the date with the given timezone and
	// then return a formatted version of the date which uses
	// the local (= browser's) timezone...
	var dateValue = Date.parseDate(value, "Y-m-d H:i O");
	var formattedDate = Ext.util.Format.date(dateValue, "Y-m-d H:i");
	return formattedDate;
}

/*
 * Reload the global tree and my space tree. If autoExpand is true
 * the tree will be expanded to the path contained in
 * Ext.state.Manager('nextActiveFolder');
 * @param {Boolean} autoExpand
 */
function reloadTree(autoExpand) {
    getCompanyHomeTree().root.reload();
    getMyHomeTree().root.reload();
    loadFolder(Ext.state.Manager.get('currentFolder'));
    if (autoExpand) {
        // The active folder is the one which will be selected after the
        // tree has been reloaded
        var treeNode = getCompanyHomeTree().getNodeById(Ext.state.Manager.get('currentFolder'));
		if (treeNode != undefined) {
        	Ext.state.Manager.set('nextActiveFolder', treeNode.getPath());
        }
        getCompanyHomeTree().root.reload();
    }
}


/*
 * Logout
 */
function doRedirectToUrl(url) {
       window.location = url;
}

function doLogout() {
        Ext.MessageBox.show({
           msg: 'Logout',
           progressText: 'Processing...',
           width:200,
           wait:true,
           waitConfig: {interval:200},
           icon: Ext.MessageBox.INFO
       });
        setTimeout(function(){
           //This simulates a short delay for better
           //readability of the message dialog.
	       Ext.Ajax.request({
	       	url: 'ui/logout',
	       	method: 'GET',
	       	success: function(response, options){
	       		// Decodes (parses) a JSON string to an object. If the JSON is invalid,
	       		// this function throws a SyntaxError.
	       		var responseObj = Ext.util.JSON.decode(response.responseText);
	       		//Must have been 2xx http status code
				Ext.MessageBox.hide();				
				doRedirectToUrl(responseObj.logout.redirect_url + '?' + ((new Date()).getTime()));
				}, 
			failure: function(){
				//Must have been 4xx or a 5xx http status code
				Ext.MessageBox.hide();
				Ext.Msg.show({
					title:'Logout failed!',
					msg: 'Please try again!', 
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR});}
			});
	        }, 1000);
}


/* 
 * Clear the "documentInfoPane", i.e. show no file / doc information.
 * Call this, e.g. when no file is selected or after a folder has been changed.
 */
function clearDocumentInfoPane() {
	var store = Ext.getCmp('docInfoDataView').store;
	store.removeAll();
}

/*
 * Update the document info pane with info about the currently selected doc.
 */
function updateDocumentInfoPane() {
	clearDocumentInfoPane();
	var newRecord = fileSelectionModel.getSelected();
	var store = Ext.getCmp('docInfoDataView').store;
	if (newRecord) {
		store.add([newRecord]);
	}
}



/* This script and many more are available free online at
The JavaScript Source :: http://javascript.internet.com/forms/clipboard-copy.html
Created by: Mark O'Sullivan :: http://lussumo.com/
 Jeff Larson :: http://www.jeffothy.com/
 Mark Percival :: http://webchicanery.com/
Licensed under: GNU Lesser General Public License */
function copyTextToSystemClipboard(text2copy) {
  if (window.clipboardData) {
    window.clipboardData.setData("Text",text2copy);
  } else {
    var flashcopier = 'flashcopier';
    if(!document.getElementById(flashcopier)) {
      var divholder = document.createElement('div');
      divholder.id = flashcopier;
      document.body.appendChild(divholder);
    }
    document.getElementById(flashcopier).innerHTML = '';
    var divinfo = '<embed src="../../docasu/swf/_clipboard.swf" FlashVars="clipboard='+escape(text2copy)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    document.getElementById(flashcopier).innerHTML = divinfo;
  }

}
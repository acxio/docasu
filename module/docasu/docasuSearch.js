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
var SEARCH_PAGE_SIZE = 50;

function _initSearchResultsView() {
	
	var searchProxy = new Ext.data.HttpProxy({
		url: 'ui/s',
		method: 'GET'
	});
	
	var searchResultsStore = new Ext.data.Store({
		remoteSort: true,

		proxy: searchProxy,

		reader: new Ext.data.JsonReader({
			root: 'rows',
			totalProperty: 'total',
			id: 'nodeId',
			fields: [
						{name: 'created', type:'string'},
						{name: 'author', type:'string'},
						{name: 'creator', type:'string'},
						{name: 'description', mapping:'description'},
						{name: 'parentId', type:'string'},
						{name: 'parentPath', type:'string'},
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
						{name: 'isFolder', type:'boolean'}
			         ]
		})
	});
	
	var searchResultsPanel = new Ext.grid.GridPanel({
		id: 'searchResultsView',
		region: 'center',
		store: searchResultsStore,
		columns: [
		          {id:'nodeId', header: "Name", width: 100, sortable: true, dataIndex: 'name', renderer: fileNameRenderer},
		          {header: "Path",  width: 180, sortable: false, renderer: parentPathRenderer},
		          {header: "Size", width: 20, sortable: true, dataIndex: 'size', renderer: Ext.util.Format.fileSize}, 
		          {header: "Changed", width: 60, sortable: true, dataIndex: 'modified', renderer: timeZoneAwareRenderer},
		          {header: "Created", width: 60, sortable: true, dataIndex: 'created', renderer: timeZoneAwareRenderer},
		          {header: "Creator", width: 50, sortable: true, dataIndex: 'creator'},
		          {header: "Action",  width: 70, sortable: false, dataIndex: 'nodeId', renderer: actionRenderer}
		          ],
		viewConfig: {
			forceFit: true
		},
		bbar: new Ext.PagingToolbar({
			pageSize: SEARCH_PAGE_SIZE,
			store: searchResultsStore,
			displayInfo: true,
			displayMsg: 'Displaying file(s) {0} - {1} of {2}',
			emptyMsg: "No files to display"
		})
	});

	searchResultsStore.on('beforeload', function(store, options) {
		// add missing params for paging
		for (var param in store.params) {
			options.params[param] = store.params[param];
		}
	});
	
	searchResultsStore.on('load', function() {
		Ext.MessageBox.hide();
		showSearchResultsView();
	});

	searchProxy.on('loadexception', function(proxy, options, response, error) {
		// TODO handle errors !
		Ext.MessageBox.hide();
		Ext.MessageBox.alert('Communication Error', 'Please try again!');
		// console.error('loadexception in search:' + error);
	});

	return searchResultsPanel;
}

function parentPathRenderer(value, metadata, record, rowIndex, collIndex, store) {
	return '<a href="#" onclick="loadFolder(\''+ record.data.parentId +'\'); return false;">' + record.data.parentPath + '</a>';
}

function loadSearchResults(data) {
	Ext.getCmp('searchResultsView').getStore().loadData(data);
}

function _createSearchTypeComboBox(width) {

	var store = new Ext.data.SimpleStore({
		fields: ['code', 'label'],
		data: [['', 'All items'],
		       ['content', 'Documents'],
		       ['file', 'File names'],
		       ['folder', 'Folder names']]
	});

	return new Ext.form.ComboBox({
		fieldLabel: "Search for",
		hiddenName: 't',
		store: store,
		displayField: 'label',
		valueField: 'code',
		mode: 'local',
		value: '',
		width: width,
		triggerAction: 'all',
		readOnly: true,
		editable: false
	});
}

function validateSearchParameters(params) {
	var createdFrom = null;
	var createdTo = null;
	var modifiedFrom = null;
	var modifiedTo = null;
	if (params.createdFrom != undefined && params.createdFrom.length > 0) {
		createdFrom = Date.parse(params.createdFrom);
	}
	if (params.createdTo != undefined && params.createdTo.length > 0) {
		createdTo = Date.parse(params.createdTo);
	}
	if (params.modFrom != undefined && params.modFrom.length > 0) {
		modifiedFrom = Date.parse(params.modFrom);
	}
	if (params.modTo != undefined && params.modTo.length > 0) {
		modifiedTo = Date.parse(params.modTo);
	}
	//alert("dates:"+createdFrom+","+createdTo+","+modifiedFrom+","+modifiedTo+";");
	if(createdFrom != null &&  createdTo != null && createdTo < createdFrom) {
		// if createdTo is before createdFrom 
		return "'Created Before' date cannot be set before 'Created After' date!";
	}
	if(modifiedFrom != null &&  modifiedTo != null && modifiedTo < modifiedFrom) {
		// if modifiedTo is before modifiedFrom 
		return "'Modified Before' date cannot be set before 'Modified After' date!";
	}
	if(createdFrom != null &&  modifiedTo != null && modifiedTo < createdFrom) {
		// if modifiedTo is before createdFrom 
		return "'Modified Before' date cannot be set before 'Created After' date!";
	}

	return "";
}

function searchFormListener(form, action) {
	// validate search parameters	
	var message = validateSearchParameters(form.getValues(false));
	if(message.length > 0) {
		// invalid search parameters
		Ext.MessageBox.show({
			title: 'Invalid search parameters',
			msg: message,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.ERROR
		});
		return false;
	}

	// default timeout for ajax calls is 30 sec.
	// this messagebox is set to load in 35 seconds.
	Ext.MessageBox.show({
		msg: 'Search',
		progressText: 'Processing...',
		width:200,
		wait:true,
		waitConfig: {interval:3500},
		icon: Ext.MessageBox.INFO
	});
	
	var options = new Object();
	options.params = form.getValues(false);
	options.params.start = 0;
	options.params.limit = SEARCH_PAGE_SIZE;

	var store = Ext.getCmp('searchResultsView').getStore();
	store.params = form.getValues(false);
	store.load(options);
	
	// hide the message box on store.load() call
	//Ext.MessageBox.hide();
	
	return false;
}

function showAdvancedSearch() {

	var searchField = new Ext.form.TextField({
		fieldLabel: 'Query',
		name: 'q',
		width: SEARCH_FIELD_WIDTH
	});
	
	var typeCombo = _createSearchTypeComboBox(SEARCH_FIELD_WIDTH);
	
	var createdFrom = new Ext.form.DateField({
		fieldLabel: 'Created After',
		name: 'createdFrom',
		format: 'Y/m/d',
		width: SEARCH_FIELD_WIDTH
	});
	
	var createdTo = new Ext.form.DateField({
		fieldLabel: 'Created Before',
		name: 'createdTo',
		format: 'Y/m/d',
		width: SEARCH_FIELD_WIDTH
	});
	
	var modifiedFrom = new Ext.form.DateField({
		fieldLabel: 'Modified After',
		name: 'modFrom',
		format: 'Y/m/d',
		width: SEARCH_FIELD_WIDTH
	});
	
	var modifiedTo = new Ext.form.DateField({
		fieldLabel: 'Modified Before',
		name: 'modTo',
		format: 'Y/m/d',
		width: SEARCH_FIELD_WIDTH
	});
	
	var lookInCombo = new Ext.form.ComboBox({
		fieldLabel: 'Look in',
		width: SEARCH_FIELD_WIDTH,
		hiddenName: 'nodeId',
		store: new Ext.data.SimpleStore({
			fields: ['code', 'label'],
			data: [[Ext.state.Manager.get('currentFolder'), 'Current Folder'], ['', 'All Folders']]
		}),
		displayField: 'label',
		valueField: 'code',
		mode: 'local',
		selectOnFocus: true,
		triggerAction: 'all',
		editable: false
	});
		
	var advSearchForm = new Ext.form.FormPanel({
		id: 'advSearchForm',
		width: 600,
		height: 160,
		frame: false,
		bodyStyle: 'border: none',
		keys: [{
			key: Ext.EventObject.ENTER,
			handler: advSearchSubmit
		}],
		layout: 'column',
		layoutConfig: {
			itemCls: 'pad-children'
		},
		items: [new Ext.Panel({
			width: 280,
			layout: 'form',
			border: false,
			style: 'margin:8px 4px 4px 4px',
			items: [searchField, typeCombo, lookInCombo]
		}), new Ext.Panel({
			width: 280,
			layout: 'form',
			border: false,
			style: 'margin:8px 4px 4px 4px',
			items: [createdFrom, createdTo, modifiedFrom, modifiedTo]
		})],
		buttons: [new Ext.Button({
			text: 'Search',
			handler: advSearchSubmit
		})]
	});

	 	
	  advSearchWindow = new Ext.Window({
		id: 'advSearchWindow',
		title: 'Advanced Search',
		width: 580,
		height: 200,
		resizable: false,
		draggable: true,
		border: false,
		x: 50,
		y: 50,
		iconCls: 'icon-grid',
		animCollapse: false,
		items: [advSearchForm],
		modal: true
	});

	advSearchWindow.show();

}

function advSearchSubmit() {
	searchFormListener(Ext.getCmp('advSearchForm').form);

	// close has to come last because it destroys the form -> use hide
	//FIXME latestAdvSearchForm (use show and hide not new and close)
	Ext.getCmp('advSearchWindow').close();

	return false;
}



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

function showAdvancedSearch() {

	var searchField = new Ext.form.TextField({
		fieldLabel: 'Query',
		name: 'searchText',
		width: SEARCH_FIELD_WIDTH
	});
	
	var store = new Ext.data.SimpleStore({
		fields: ['code', 'label'],
		data: [['', 'All items'], ['content', 'Documents'], ['filename', 'File names'], ['space', 'Spaces']]
	});
	
	var typeCombo = new Ext.form.ComboBox({
		fieldLabel: "Search for",
		width: SEARCH_FIELD_WIDTH,
		hiddenName: 'searchType',
		store: store,
		displayField: 'label',
		valueField: 'code',
		mode: 'local',
		value: '',
		triggerAction: 'all',
		selectOnFocus: true,
		editable: false
	});
	
	var createdFrom = new Ext.form.DateField({
		fieldLabel: 'Created After',
		name: 'createdFrom',
		format: 'm/d/Y',
		width: SEARCH_FIELD_WIDTH
	});
	
	var createdTo = new Ext.form.DateField({
		fieldLabel: 'Created Before',
		name: 'createdTo',
		format: 'm/d/Y',
		width: SEARCH_FIELD_WIDTH
	});
	
	var modifiedFrom = new Ext.form.DateField({
		fieldLabel: 'Modified After',
		name: 'modifiedFrom',
		format: 'm/d/Y',
		width: SEARCH_FIELD_WIDTH
	});
	
	var modifiedTo = new Ext.form.DateField({
		fieldLabel: 'Modified Before',
		name: 'modifiedTo',
		format: 'm/d/Y',
		width: SEARCH_FIELD_WIDTH
	});
	
	var archivedDate = new Ext.form.DateField({
		fieldLabel: 'Archived Date',
		name: 'archivedDate',
		format: 'm/d/Y',
		width: SEARCH_FIELD_WIDTH
	});
	
	var validDate = new Ext.form.DateField({
		fieldLabel: 'Valid Until',
		name: 'validDate',
		format: 'm/d/Y',
		width: SEARCH_FIELD_WIDTH
	});
	
	var lookInCombo = new Ext.form.ComboBox({
		fieldLabel: 'Look in',
		width: SEARCH_FIELD_WIDTH,
		hiddenName: 'lookIn',
		store: new Ext.data.SimpleStore({
			fields: ['code', 'label'],
			data: [['currentFolder', 'Current Folder'], ['allFolders', 'All Folders']]
		}),
		displayField: 'label',
		valueField: 'code',
		mode: 'local',
		selectOnFocus: true,
		triggerAction: 'all',
		editable: false
	});
	
	var currentFolderField = new Ext.form.TextField({
		fieldLabel: 'Current Folder',
		name: 'currentFolder',
		width: SEARCH_FIELD_WIDTH,
		value: Ext.state.Manager.get('currentFolder'),
		hidden: true,
		hideLabel: true
	});
	
	var advSearchForm = new Ext.form.FormPanel({
		id: 'advSearchForm',
		width: 600,
		height: 160,
		frame: false,
		bodyStyle: 'border: none',
		url: 'ui/as',
		method: 'GET',
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
			items: [createdFrom, createdTo, modifiedFrom, modifiedTo, currentFolderField]
		})],
		buttons: [new Ext.Button({
			text: 'Search',
			handler: advSearchSubmit
		})],
		listeners: {
			actioncomplete: function(form, action){
				advSearchWindow.close();
				var responseObj = Ext.util.JSON.decode(action.response.responseText);
				showSearchResults(responseObj);
			},
			actionfailure: function(form, action){
				Ext.MessageBox.alert('An error occurred while searching.');
			}
		}
	});

	 	
	  advSearchWindow = new Ext.Window({
		id: 'advSearch',
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

	function advSearchSubmit() {	
		advancedSearchQuery = advSearchForm.getForm().getValues(true);
		simpleSearchQuery = "";
		//FIXME latestAdvSearchForm
		advSearchForm.form.submit();
	}
}

/* search results are shown in main grid */
function showSearchResults(data){
	
	/* load search results into grid */
	gridStore.loadData(data);
	
	/* clear the document info panel */
	clearDocumentInfoPane();
	
	/* no breadcrumb displayed */
	Ext.getCmp('folderPathTitle').setTitle('');	
	
	/* Set the title to "Search results" */
	var elem = '<div class="searchResults">Search Results</div>';
	Ext.get('cifsLink').update(elem);
	
	/* Set variables */
	Ext.state.Manager.set("currentFolderName", '');
	Ext.state.Manager.set("previousFolderName", '');
	Ext.state.Manager.set("previousPreviousFolder", '');
 
}
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

function updateFavorites() {

	Ext.Ajax.request({
		url: 'ui/shortcuts',
		method: 'GET',
		success: function(response, options){
			//Ext.MessageBox.alert('Must have been 2xx http status code');
			_updateFavorites(response.responseText);
		}, 
		failure: function(){
			Ext.MessageBox.alert('Failed to load favorites.');
		}
	});
}


function _updateFavorites(responseText) {
	var favHtml = '<table style="width:100%;">';
	
	var favorites = eval(responseText).rows;
	
	var i;
	for (i = 0; i < favorites.length; i++) {
		var f = favorites[i];
		favHtml += '<tr>';
		if (f.isFile) {
			favHtml += '<td><img src=\"' + f.icon + '\" /></td>';
			favHtml += '<td><a target="_blank" href="' + f.url + '"> ' + f.name + '</a></td>';
			favHtml += '<td style="text-align:right;">';
			favHtml +=     '<a href="#" onclick="loadFolder(\'' + f.parentId + '\'); return false;" title="Open in Folder"><img src="../../docasu/lib/extjs/resources/images/default/tree/folder.gif"/></a>';
			favHtml +=     '&nbsp;';
			favHtml +=     '<a href="#" onclick="removeFavorite(\'' + f.id + '\')"><img src="../../docasu/images/delete.gif" /></a>';
			favHtml += '</td>';
		}
		else {
			favHtml += '<td><img src="../../docasu/lib/extjs/resources/images/default/tree/folder.gif"/></td>';
			favHtml += '<td><a href="#" onclick="loadFolder(\'' + f.id + '\'); return false;">' + f.name + '</a></td>';
			favHtml += '<td style="text-align:right;"><a href="#" onclick="removeFavorite(\'' + f.id + '\')"><img src="../../docasu/images/delete.gif" /></a></td>';
		}
			
		favHtml += '</tr>';
	}
	
	favHtml += '</table>';
	var favoritesEl = Ext.get('favorites');
	favoritesEl.update(favHtml);
	
}

function removeFavorite(nodeId) {
	Ext.Ajax.request({
		url: 'ui/removeshortcut',
		method: 'GET',
		params: 'nodeId=' + nodeId,
		success: function(response, options){
			//Ext.MessageBox.alert('Must have been 2xx http status code');
			_removeFavorite(response.responseText);
		}, 
		failure: function(){
			Ext.MessageBox.alert('Failed to delete favorite.');
		}
	});
}

function _removeFavorite() {
	updateFavorites();
}

function addFavorite(nodeId) {
	if (typeof nodeId != 'undefined') {
		Ext.Ajax.request({
			url: 'ui/addshortcut',
			method: 'GET',
			params: 'nodeId=' + nodeId,
			success: function(response, options){
			//Ext.MessageBox.alert('Must have been 2xx http status code');
			_addFavorite(response.responseText);
		}, 
		failure: function(){
			Ext.MessageBox.alert('Failed to add favorite.');
		}
		});

		Ext.getCmp('favoritesPanel').expand();
	}
	else {
		console.log('Warning, trying to add undefined node');
	}
}

function _addFavorite() {
	updateFavorites();
}
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

/**
 * Add favorite
 */
function addFavorite(nodeId) {
	Ext.Ajax.request({
		url: 'ui/shortcut/'+nodeId,
		method: 'PUT',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to add favorite', response)) {
				return;
			}
			updateFavorites();
		}, 
		failure: function(response, options) {
			handleFailureMessage('Failed to add favorite', response);
		}
	});
	Ext.getCmp('favoritesPanel').expand();
}

/**
 * Remove favorite
 */
function removeFavorite(nodeId) {
	Ext.Ajax.request({
		url: 'ui/shortcut/' + nodeId,
		method: 'DELETE',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to remove favorite', response)) {
				return;
			}
			updateFavorites();
		}, 
		failure: function(response, options) {
			handleFailureMessage('Failed to remove favorite', response);
		}
	});
}

/**
 * Load favorites
 */
function updateFavorites() {
	Ext.Ajax.request({
		url: 'ui/shortcuts',
		method: 'GET',
		success: function(response, options) {
			// check response for errors
			if(checkHandleErrors('Failed to load favorites', response)) {
				return;
			}
			_updateFavorites(response.responseText);
		}, 
		failure: function(response, options) {
			handleFailureMessage('Failed to load favorites', response);
		}
	});
}

/**
 * Update favorites display
 */
function _updateFavorites(responseText) {
	var favHtml = '<table style="width:100%;">';
	var favorites = Ext.util.JSON.decode(responseText).rows;
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

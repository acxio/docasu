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

var clipboard = new Object();
clipboard.put = function(icon, name, nodeId) {
	var c = this.getAll();
	// TODO handle duplicates
	c.push([icon, name, nodeId].join(';'));

	Ext.state.Manager.set('clipboard', c.join(','));
}

clipboard.getAll = function() {
	var s = Ext.state.Manager.get('clipboard', '');
	var c = s == '' ? new Array() : s.split(',');
	
	return c;
}

clipboard.update = function() {
	var nodes = this.getAll();
	
	var clipHtml = '<table>';
	
	var i;
	for (i = 0; i < nodes.length; i++) {
		var c = nodes[i].split(';');
		clipHtml += '<tr>'
		clipHtml += '<td><img src=\"' + c[0] + '\" /></td>';
		clipHtml += '<td>' + c[1] + '</td>';
		clipHtml += '<td><a href="#" onclick="clipboard.remove(\'' + c[2] + '\')">' +
			'<img src="../../docasu/images/delete.gif" /></a></td>';
			
		clipHtml += '</tr>'
	}
	
	clipHtml += '</table>';
	var clipboardEl = Ext.get('clipboard');
	clipboardEl.update(clipHtml);

}

clipboard.remove = function(id) {
	var nodes = this.getAll();
	for (i=0; i<nodes.length; i++) {
		if (nodes[i].indexOf(id) != -1) {
			nodes.splice(i, 1);
			break;
		}
	}
	Ext.state.Manager.set('clipboard', nodes.join(','));
	clipboard.update();
}

clipboard.clear = function() {
	Ext.state.Manager.set('clipboard', null);
	this.update();
}

/**
 * paste all items on the clipboard
 * @param {String} folderId: the destination folder
 */
function pasteAll(folderId) {

	var items = clipboard.getAll();
	var c = '';
	
	for (i=0; i < items.length; i++) {

		var iArr = (items[i] + '').split(';');
		if (iArr.length == 3) {
			c += iArr[2] + ',';
		}
	}
	
	// removing trailing ,
	c = c.substr(0, c.length -1);
	
	Ext.Ajax.request({
		url: 'ui/paste',
		method: 'GET',
		params: 'c=' + c + '&folderId=' + folderId,
		success: function(response, options){
		// TODO update all panels !!
		// folder contents changed
			clipboard.clear();
			gridStore.load();
		}, 
		failure: function(){
			Ext.MessageBox.alert('Paste failed!');
		}
	});
		
}
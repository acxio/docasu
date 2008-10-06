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

var nodeId = url.extension;

function getPreferences() {
	return person.childAssocs["app:configurations"][0].children[0];
}

if (nodeId == undefined || nodeId == null) {
	status.code = 404;
   	status.message = "No nodeId supplied";
   	status.redirect = true;
}
// TODO check if node exists?

var preferences = getPreferences();

if (logger.isLoggingEnabled()) {
	logger.log("Adding shortcut to: " + nodeId);
}

var addShortcut = true;
for each (shortcut in preferences.properties["app:shortcuts"]) {
	if (shortcut == nodeId) {
		addShortcut = false;
	}
}
if (addShortcut) {
	var shortcutNodes = preferences.properties["app:shortcuts"].push(nodeId);
}

preferences.save();
model.msg = 'ok';
model.success = true;
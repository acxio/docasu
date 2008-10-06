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
if (url.service == url.serviceContext + "/docasu/ui") {
	// load the DoCASU client app.
	model.initialFolderId = args.nodeId ? args.nodeId : '';
	// TODO: remove the parameter from the url
} else {
	status.code = 301;
	status.redirect = true;
	model.redirectUrl = url.serviceContext + "/docasu/ui" + args.nodeId ? "?nodeId=" + args.nodeId : "";
}
 
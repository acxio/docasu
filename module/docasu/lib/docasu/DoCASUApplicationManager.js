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


// DoCASUApplicationManager

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App");



DoCASU.App.ApplicationManager = new Object({
	
	getApplication : function() {
		var application = Ext.state.Manager.get("DoCASU.App.ApplicationManager.application");
		if(!application || application == null) {
			application = new DoCASU.App.Application();
			this.setApplication(application);
		}
		return application;
	},
	
	setApplication : function(application) {
		Ext.state.Manager.set("DoCASU.App.ApplicationManager.application", application);
	}

}); // eo DoCASU.App.ApplicationManager

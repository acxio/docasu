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


// DoCASUCategoriesPlugin

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Categories");

/* constructor */
DoCASU.App.Categories.DoCASUCategoriesPlugin = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Categories.DoCASUCategoriesPlugin.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Categories.DoCASUCategoriesPlugin, DoCASU.App.Plugin, {
	// configuration options
	id			:	"DoCASUCategoriesPlugin",
	title		:	"DoCASU Categories Plugin",
	namespace	:	"DoCASU.App.Categories" // each plugin is stored under a specified namespace - must be different than any class name
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Plugin
	
}); // eo DoCASU.App.Categories.DoCASUCategoriesPlugin

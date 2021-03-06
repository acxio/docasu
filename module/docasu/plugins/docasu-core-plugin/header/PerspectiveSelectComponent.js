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


// PerspectiveSelectComponent

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App.Core");

/* constructor */
DoCASU.App.Core.PerspectiveSelectComponent = function(config) {
	Ext.apply(this, config);
	
	// call parent
	DoCASU.App.Core.PerspectiveSelectComponent.superclass.constructor.apply(this, arguments);
	
	// add events
	this.addEvents(
	);
	
} // eo constructor

Ext.extend(DoCASU.App.Core.PerspectiveSelectComponent, DoCASU.App.Component, {
	// configuration options
	id			:	"PerspectiveSelectComponent",
	title		:	"Perspective Select Component",
	namespace	:	"DoCASU.App.Core", // each component is stored under a specified namespace - must be different than any class name and should be the same as for parent plugin
	// this configuration is overwritten by the perspective 
	// configuration defaults are in DoCASU.App.Component
	// UI
	uiClass		:	"Ext.Panel",
	getUIConfig : function() {
		var perspectivesStore = new Ext.data.SimpleStore({
			id		: 	"perspectivesStore",
			fields	:	["code", "label"],
			data	:	[
							["DoCASUPerspective", "DoCASU"],
							["DoCASUCategoriesPerspective", "Categories"]
						]
		});
		var perspectiveCombo = new Ext.form.ComboBox({
			id				: 	"perspectivesSelect",
			store			:	perspectivesStore,
			displayField	:	"label",
			valueField		:	"code",
			mode			:	"local",
			value			:	"",
			width			:	90,
			triggerAction	:	"all",
			selectOnFocus	:	true,
			editable		:	false,
			readOnly		: 	true,
			listeners		:	{
									select : function(f, n, o) {
										DoCASU.App.PerspectiveManager.switchToPerspectiveById(f.getValue());
									}
								}
		});
		
		var perspectiveToogleBtn = new Ext.Toolbar.MenuButton({
			text: 'Perspective',
            tooltip: {text:'Change the user interface by perspective.', title:'Change Perspective'},
            icon: getContextBase() + '/docasu/images/btn-perspectives.gif',
			iconCls: 'x-btn-icon',
            menu: { // <-- submenu by nested config object
                items: [
                    '<b class="menu-title">Choose a Perspective</b>',
                    {
                        text: 'DoCASU',
						value: 'DoCASUPerspective',
                        checked: (DoCASU.App.PerspectiveManager.getPerspective().id == 'DoCASUPerspective' ? true : false),
                        group: 'perspective',
                        checkHandler: onPerspectiveItemCheck
                    }, {
                        text: 'Categories',
						value: 'DoCASUCategoriesPerspective',
                        checked: (DoCASU.App.PerspectiveManager.getPerspective().id == 'DoCASUCategoriesPerspective' ? true : false),
                        group: 'perspective',
                        checkHandler: onPerspectiveItemCheck
                    }
                ]
            }
        });
		
	    // functions to display feedback
		function onPerspectiveItemCheck(item, checked) {
			//Ext.MessageBox.alert('Perspective Item Check', 'You '+(checked ? 'checked' : 'unchecked')+' the "'+item.value+'" menu item.');
			DoCASU.App.PerspectiveManager.switchToPerspectiveById(item.value);
		};
		
		// set the selected value to reflect the current active perspective
		perspectiveCombo.on("beforerender", function(combo) {
			 combo.setValue(DoCASU.App.PerspectiveManager.getPerspective().id);
		});
		var uiConfig	=	{
								// config
								id			:	this.id,
								name		:	this.id,
								// look
								bodyStyle	:	"padding: 4px;margin-top:5px;",
								region		:	"east",
								border		:	false,
								frame		:	false,
								layout		:	"table",
								items		:	[
													perspectiveToogleBtn
													// {
													// 	html		:	"<span class=\"title\">Perspective:</span>",
													// 	colspan		:	1,
													// 	bodyStyle	:	"margin-right: 4px; border-style:none"
													// },
													// perspectiveCombo
												] // eo perspective form items
								}; // the config to construct the UI object(widget)
		return uiConfig;
	} // the config to construct the UI object(widget) - use function for better control on building the JSON configuration	
}); // eo DoCASU.App.Core.PerspectiveSelectComponent

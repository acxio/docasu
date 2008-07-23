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

function showHelp() {

	 	
	 var helpWindow = new Ext.Window({
		id: 'helpWindow',
		title: 'Help',
		width: 720,
		height: 650,
		resizable: true,
		draggable: true,
		border: false,
		x: 50,
		y: 50,
		iconCls: 'icon-grid',
		animCollapse: false,
		items:[{
        xtype:'tabpanel',
        deferredRender:false,
        defaults:{autoScroll: true},
        defaultType:"iframepanel",
        activeTab:0,
        items:[{  title:"Alfresco",
                  id:'alfresco-help',
                  //defaultSrc:'http://www.alfresco.com/help/webclient',
				  html:'<a target="_blank" href="http://www.alfresco.com/help/webclient">Alfresco Help</a>',
				  height: 380
               },{
                   title:"DoCASU",
                   id:'docasu-help', 
				   html:'<div>Coming soon</div>',
                   height: 380
               }]
          }]
	});

	helpWindow.show();

}

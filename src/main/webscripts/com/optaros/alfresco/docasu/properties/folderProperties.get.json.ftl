<#--

    Copyright (C) 2008 Optaros, Inc. All rights reserved.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
    
-->
({   "noredirect":true,
	 "success"	:true,
   	 "nodeId"	:"${folder.id}",
   	 "name"		:"${folder.name}",
  	 "size"		:"${folder.size}",
   	 "modified"	:"${folder.properties.modified?string("yyyy-MM-dd HH:mm Z")}",
   	 "created"	:"${folder.properties.created?string("yyyy-MM-dd HH:mm Z")}",
   	 "path"     :"${folder.displayPath}",
   	 "url"      :"${folder.url}",
   	 "creator"  :"${folder.properties.creator}",
   	 "icon"		:"${url.context}${folder.icon16}"
})

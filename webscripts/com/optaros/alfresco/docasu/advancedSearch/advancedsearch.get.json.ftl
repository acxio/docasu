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
	{ "success":true, "total" : ${total}, "path": "/", "folderName": "", "rows" : [
<#list entries as child>

	      
	       	{"nodeId"		:"${child.id}",
	       	 "name"	    	:"${child.name}",
	       	 "modified"		:"${child.properties.modified?string("yyyy-MM-dd HH:mm Z")}",
	       	 "created"		:"${child.properties.created?string("yyyy-MM-dd HH:mm Z")}",
	       	 "author"		:"<#if child.properties.author?exists>${child.properties.author}<#else></#if>",
	       	 "size"			: "${child.size?c}",
	       	 "creator"		: "${child.properties.creator}",
	       	 "description"	: "${(child.properties.description!)?js_string}",
	       	 "modifier"		: "${child.properties.modifier}",
	         "filePath"      :"",
	       	 "title"	   	:"<#if child.properties.title?exists>${child.properties.title}<#else></#if>",	 
	       	 "mimetype"		: "<#if child.mimetype?exists>${child.mimetype}<#else></#if>",
	       	 "link"         : "${url.context}${child.url}",
	       	 "downloadUrl"	: "${url.context}${child.downloadUrl}",
	       	 "versionable"	: "${(hasAspect(child, "cm:versionable") == 1)?string}",
	       	 <#if hasAspect(child, "cm:versionable") == 1>
	       	 "version"		: "<#if child.properties.versionLabel?exists>${child.properties.versionLabel}<#else>1.0</#if>",
	       	 <#else>
			 "version"		: "Versioning not enabled",
	         </#if>
	         "writePermission" : "${(hasPermission(child, "Write") == 1)?string}",
	         "createPermission": "${(hasPermission(child, "CreateChildren") == 1)?string}",
	         "deletePermission": "${(hasPermission(child, "Delete") == 1)?string}",
	         "locked"		: "${(child.isLocked)?string}",
	         "editable"		: "${(child[1])?string}",
	         "isWorkingCopy": "${(child.hasAspect("cm:workingcopy"))?string}",
	         "iconUrl"		: "${url.context}${child.icon16}",
	         "icon32Url"	: "${url.context}${child.icon32}",
	         "icon64Url"	: "${url.context}${child.icon64}",
	         "isFolder"     : "${child.isContainer?string}"
			}
	       
	       <#if child_has_next>,</#if>
</#list>
	  ]
	}
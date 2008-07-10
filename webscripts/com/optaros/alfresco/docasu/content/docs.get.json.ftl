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
	{ "total" : ${total}, "path": "${path}", "folderName": "${folderName}", "rows" : [
<#list entries as child>
	       	{
	       	 "nodeId"		:"${child[0].id}",
	       	 "name"	    	:"${child[0].name}",
	       	 "title"	   	:"<#if child[0].properties.title?exists>${child[0].properties.title}<#else></#if>",
	       	 "modified"		:"${child[0].properties.modified?string("yyyy-MM-dd HH:mm Z")}",
	       	 "created"		:"${child[0].properties.created?string("yyyy-MM-dd HH:mm Z")}",
	       	 "author"		:"<#if child[0].properties.author?exists>${child[0].properties.author}<#else></#if>",
	       	 "size"			: ${child[0].size?c},
	       	 "link"         : "${url.context}${child[0].url}?${randomNumber?string}",
	       	 "creator"		: "${child[0].properties.creator}",
	       	 "description"	: "${(child[0].properties.description!)?js_string}",
	       	 "filePath"		: "${path}/${child[0].name}",
	       	 "modifier"		: "${child[0].properties.modifier}",
	       	 "mimetype"		: "<#if child[0].mimetype?exists>${child[0].mimetype}<#else></#if>",
	       	 "downloadUrl"	: "${url.context}${child[0].downloadUrl}",
	       	 "versionable"	: "${(hasAspect(child[0], "cm:versionable") == 1)?string}",
	       	 <#if hasAspect(child[0], "cm:versionable") == 1>
	       	 "version"		: "<#if child[0].properties.versionLabel?exists>${child[0].properties.versionLabel}<#else>1.0</#if>",
	       	 <#else>
			 "version"		: "Versioning not enabled",
	         </#if>
	         "writePermission" : "${(hasPermission(child[0], "Write") == 1)?string}",
	         "createPermission": "${(hasPermission(child[0], "CreateChildren") == 1)?string}",
	         "deletePermission": "${(hasPermission(child[0], "Delete") == 1)?string}",
	         "locked"		: "${(child[0].isLocked)?string}",
	         "editable"		: "${(child[1])?string}",
	         "isWorkingCopy": "${(child[0].hasAspect("cm:workingcopy"))?string}",
	         "iconUrl"		: "${url.context}${child[0].icon16}",
	         "icon32Url"	: "${url.context}${child[0].icon32}",
	         "icon64Url"	: "${url.context}${child[0].icon64}",
	         "isFolder"     : "${child[0].isContainer?string}"
	       	}
	       <#if child_has_next>,</#if>
</#list>
	  ]
	}
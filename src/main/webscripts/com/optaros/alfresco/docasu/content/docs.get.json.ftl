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
{
	"noredirect": true,
	"success": true,
	"total" : ${total},
	"path": "${path}",
	"folderName": "${folderName}",
	"folderId": "${folderId}",
	"rows" : [
<#list rows as row>
		{
			"nodeId"			: "${row.nodeId}",
			"name"				: "${row.name}",
			"title"				: "${row.title}",
			"modified"			: "${row.modified?string("yyyy-MM-dd HH:mm Z")}",
			"created"			: "${row.created?string("yyyy-MM-dd HH:mm Z")}",
			"author"			: "${row.author}",
			"size"				: "${(row.size!0)?c}",
			"link"				: "${url.context}${row.url}?${randomNumber?string}",
			"creator"			: "${row.creator}",
			"description"		: "${row.description?js_string}",
			"parentId"			: "${folderId}",
			"parentPath"		: "${path}",
			"modifier"			: "${row.modifier}",
			"mimetype"			: "${row.mimetype!}",
			"downloadUrl"		: "${url.context}${row.downloadUrl}",
			"versionable"		: "${row.versionable?string}",
			"version"			: "${row.version}",
			"writePermission"	: "${row.writePermission?string}",
			"createPermission"	: "${row.createPermission?string}",
			"deletePermission"	: "${row.deletePermission?string}",
			"locked"			: "${row.locked?string}",
			"editable"			: "${row.editable?string}",
			"isWorkingCopy"	: "${row.isWorkingCopy?string}",
			"iconUrl"			: "${url.context}${row.icon16}",
			"icon32Url"		: "${url.context}${row.icon32}",
			"icon64Url"		: "${url.context}${row.icon64}",
			"isFolder"			: "${(row.isFolder!false)?string}"
		}<#if row_has_next>,</#if>
</#list>
		]
}

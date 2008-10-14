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
<#-- TreeLoader requires this response structure -->
[
	<#list rows?sort_by("name") as row>
			{
				"id"				:	"${row.nodeId}",
				"text"				:	"${row.name}",
				"name"				:	"${row.name}",
				"link"				:	"${url.context}${row.url}",
				"parentPath"		:	"${path}",
				"url"				:	"${url.context}/wcs/docasu/ui?nodeId=${row.nodeId}",
				"writePermission"	:	"${row.writePermission?string}",
				"createPermission"	:	"${row.createPermission?string}",
				"deletePermission"	:	"${row.deletePermission?string}"
			}<#if row_has_next>,</#if>
	</#list>
]
					
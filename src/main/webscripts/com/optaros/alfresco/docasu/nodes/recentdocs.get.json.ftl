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
	"success"	:	${success?string},
	"msg"		:	"${msg}",
	"rows"		:	[	
						<#list resultset as node>
							{
								"id"			:	"${node.id}",
								"name"			:	"${node.name}",
								"nameIcon"		:	"<div><div style='margin-bottom: 4px;width:170px;height:16px'><div style='float:left'><img src='${url.context}${node.icon16}' alt='${node.name}' /></div><div style='line-height:16px;float:right;font-size:80%;font-weight:lighter;'>${node.properties.modified?string("yyyy-MM-dd HH:mm Z")}</div></div><div><a href='${url.context}${node.url}' target='_blank'>${node.name}</a>&nbsp;<a href='#' onClick='loadFolder(\"${node.parent.id}\");' alt='Open in Folder'><img src='${url.context}${node.parent.icon16}'/></a></div></div>",
								"path"			:	"${node.displayPath}",
								"modified"		:	"${node.properties.modified?string("yyyy-MM-dd HH:mm Z")}",
								"parentId"		:	"${node.parent.id}",
								"parentIcon"	:	"${url.context}${node.parent.icon16}"
	 						}
	 						<#if node_has_next>,</#if>
	 					</#list>
					]
}
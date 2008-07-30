package com.optaros.alfresco.docasu.wcs;

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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.security.permissions.AccessDeniedException;
import org.alfresco.repo.template.TemplateNode;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.ContentData;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.TemplateImageResolver;
import org.alfresco.service.cmr.security.AccessStatus;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionService;
import org.alfresco.service.namespace.QName;
import org.alfresco.web.scripts.DeclarativeWebScript;
import org.alfresco.web.scripts.WebScriptRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class AbstractDocumentWebScript extends DeclarativeWebScript {

	private static final Log log = LogFactory.getLog(AbstractDocumentWebScript.class);

	private static final String EDITABLE_EXTENSION_REGEX = "txt|html?";
	
	protected static final String PARAM_START		= "start";
	protected static final String PARAM_LIMIT		= "limit";
	protected static final String PARAM_SORT		= "sort";
	protected static final String PARAM_DIR			= "dir";
	
	protected static final String KEYWORD_ROWS		= "rows";
	
	protected FileFolderService fileFolderService;
	protected NodeService nodeService;
	protected PermissionService permissionService;
	protected VersionService versionService;
	
	protected TemplateImageResolver imageResolver;

	protected void initServices() {
		fileFolderService = getServiceRegistry().getFileFolderService();
		nodeService = getServiceRegistry().getNodeService();
		permissionService = getServiceRegistry().getPermissionService();
		versionService = getServiceRegistry().getVersionService();
		imageResolver = getWebScriptRegistry().getTemplateImageResolver();
	}
	
	protected Map<String, String> readParams(WebScriptRequest req) {
		Map<String, String> params = new HashMap<String, String>();
		
		params.put(PARAM_START, req.getParameter(PARAM_START));
		params.put(PARAM_LIMIT, req.getParameter(PARAM_LIMIT));
		params.put(PARAM_SORT, req.getParameter(PARAM_SORT));
		params.put(PARAM_DIR, req.getParameter(PARAM_DIR));
		
		if (log.isDebugEnabled()) {
			log.debug("PARAM start = " + params.get(PARAM_START));
			log.debug("PARAM limit = " + params.get(PARAM_LIMIT));
			log.debug("PARAM sort = " + params.get(PARAM_SORT));
			log.debug("PARAM dir = " + params.get(PARAM_DIR));
		}
		
		return params;
	}
	
	protected List<FileInfo> toFileInfo(List<NodeRef> nodes) {
		List<FileInfo> result = new ArrayList<FileInfo>();
		for (NodeRef node : nodes) {
			try {
				result.add(fileFolderService.getFileInfo(node));
			}
			catch (AccessDeniedException ade) {/* Ignore node. */}
		}
		return result;
	}
	
	protected List<FileInfo> sort(List<FileInfo> nodes, Map<String, String> params) {
		if (params.get(PARAM_SORT) != null) {
			ColumnComparator comparator = new ColumnComparator(params.get(PARAM_SORT), !"DESC".equals(params.get(PARAM_DIR)));
			Collections.sort(nodes, comparator);
		}
		return nodes;
	}
	
	protected List<FileInfo> doPaging(List<FileInfo> nodes, Map<String, String> params) {
		int elementCount = nodes.size();
		if (params.get(PARAM_START) != null && params.get(PARAM_LIMIT) != null) {
			try {
				// Read and adapt fromIndex and toIndex
				int fromIndex = Integer.parseInt(params.get(PARAM_START));
				if (fromIndex < 0) fromIndex = 0;
				int count = Integer.parseInt(params.get(PARAM_LIMIT));
				int toIndex = fromIndex + count;
				if (toIndex > elementCount) toIndex = elementCount;
				if (fromIndex > toIndex) fromIndex = toIndex;
				// Apply
				nodes = nodes.subList(fromIndex, toIndex);
			}
			catch (NumberFormatException nfe) {
				log.info("invalid start or limit param");
			}
		}
		return nodes;
	}
	
	protected Map<String, Object> toModelRow(FileInfo fileInfo) {

		TemplateNode templateNode = new TemplateNode(fileInfo.getNodeRef(), getServiceRegistry(), imageResolver);
		Map<String, Object> row = new HashMap<String, Object>();
		row.put("nodeId", fileInfo.getNodeRef().getId());
		row.put("name", fileInfo.getName());
		row.put("title", getProperty(fileInfo, ContentModel.PROP_TITLE, ""));
		row.put("modified", fileInfo.getModifiedDate());
		row.put("created", fileInfo.getCreatedDate());
		row.put("author", getProperty(fileInfo, ContentModel.PROP_AUTHOR, ""));
		row.put("creator", getProperty(fileInfo, ContentModel.PROP_CREATOR, ""));
		row.put("description", getProperty(fileInfo, ContentModel.PROP_DESCRIPTION, ""));
		row.put("modifier", getProperty(fileInfo, ContentModel.PROP_MODIFIER, ""));
		Version currentVersion = versionService.getCurrentVersion(fileInfo.getNodeRef());
		if (currentVersion != null) {
			row.put("versionable", true);
			row.put("version", currentVersion.getVersionLabel());
		}
		else {
			row.put("versionable", false);
			row.put("version", "Versioning not enabled");
		}
		row.put("writePermission", AccessStatus.ALLOWED == permissionService.hasPermission(fileInfo.getNodeRef(), "Write"));
		row.put("createPermission", AccessStatus.ALLOWED == permissionService.hasPermission(fileInfo.getNodeRef(), "CreateChildren"));
		row.put("deletePermission", AccessStatus.ALLOWED == permissionService.hasPermission(fileInfo.getNodeRef(), "Delete"));
		row.put("locked", templateNode.getIsLocked());
		row.put("isWorkingCopy", nodeService.hasAspect(fileInfo.getNodeRef(), ContentModel.ASPECT_WORKING_COPY));
		row.put("url", templateNode.getUrl());
		row.put("downloadUrl", templateNode.getDownloadUrl());
		row.put("icon16", templateNode.getIcon16());
		row.put("icon32", templateNode.getIcon32());
		row.put("icon64", templateNode.getIcon64());
		row.put("editable", isEditable(fileInfo));
		if (fileInfo.isFolder()) {
			row.put("isFolder", true);
		}
		else {
			row.put("size", fileInfo.getContentData().getSize());
			row.put("mimetype", fileInfo.getContentData().getMimetype());
		}
		return row;
	}
	
	protected String generatePath(NodeRef nodeRef) {
		
		NodeService nodeService = getServiceRegistry().getNodeService();
		FileFolderService fileFolderService = getServiceRegistry().getFileFolderService();

		LinkedList<NodeRef> nodes = new LinkedList<NodeRef>();
		while (nodeRef != null) {
			nodes.add(0, nodeRef);
			nodeRef = nodeService.getPrimaryParent(nodeRef).getParentRef();
		}
		StringBuffer path = new StringBuffer();
		for (NodeRef pathElement : nodes) {
			FileInfo fileInfo = fileFolderService.getFileInfo(pathElement);
			// root has no fileInfo == null !
			if (fileInfo != null) {
				path.append("/");
				path.append(fileInfo.getName());
			}
		}
		return path.toString();
	}

	private boolean isEditable(FileInfo info) {
		String fileName = info.getName();
		String extension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length()).toLowerCase();
		if (extension.matches(EDITABLE_EXTENSION_REGEX)) {
			return true;
		} else {
			return false;
		}
	}

	private String getProperty(FileInfo info, QName property, String defaultValue) {
		if (info.getProperties().containsKey(property)) {
			Serializable serializable = info.getProperties().get(property);
			if (serializable != null) {
				return serializable.toString();
			}
			else {
				return defaultValue;
			}
		}
		else {
			return defaultValue;
		}
	}

	private class ColumnComparator implements Comparator<FileInfo>{

		private final String column;
		private final boolean ascending;
		
		public ColumnComparator(String column, boolean ascending) {
			this.column = column;
			this.ascending = ascending;
		}
		
		public int compare(FileInfo f1, FileInfo f2) {
			if (column.equals("name")) {
				String name1 = f1.getName().toLowerCase();
				String name2 = f2.getName().toLowerCase();
				return (ascending?name1.compareTo(name2):name2.compareTo(name1));
			}
			else if (column.equals("size")) {
				ContentData data1 = f1.getContentData();
				long size1 = (data1!=null?data1.getSize():0);
				ContentData data2 = f2.getContentData();
				long size2 = (data2!=null?data2.getSize():0);
				long diff = (ascending?size1-size2:size2-size1);
				if (diff > 0) return 1;
				else if (diff < 0) return -1;
				else return 0;
			}
			else if (column.equals("modified")) {
				Date date1 = f1.getModifiedDate();
				Date date2 = f2.getModifiedDate();
				return (ascending?date1.compareTo(date2):date2.compareTo(date1));
			}
			else if (column.equals("created")) {
				Date date1 = f1.getCreatedDate();
				Date date2 = f2.getCreatedDate();
				return (ascending?date1.compareTo(date2):date2.compareTo(date1));
			}
			else if (column.equals("creator")) {
				String creator1 = getProperty(f1, ContentModel.PROP_CREATOR, "").toLowerCase();
				String creator2 = getProperty(f2, ContentModel.PROP_CREATOR, "").toLowerCase();
				return (ascending?creator1.compareTo(creator2):creator2.compareTo(creator1));
			}
			else {
				log.error("Sorting not implemented for column = " + column);
				return 0;
			}
		}
	}
}

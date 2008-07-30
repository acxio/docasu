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

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.web.scripts.WebScriptRequest;
import org.alfresco.web.scripts.WebScriptStatus;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Browse extends AbstractDocumentWebScript {

	private static final Log log = LogFactory.getLog(Browse.class);

	private CustomFileFolderService customFileFolderService;
	
	private static final String PARAM_NODE_ID	= "nodeId";
	
	private boolean foldersOnly = false;

	public void setFoldersOnly(boolean foldersOnly) {
		this.foldersOnly = foldersOnly;
	}
	
	public void setCustomFileFolderService(
			CustomFileFolderService customFileFolderService) {
		this.customFileFolderService = customFileFolderService;
	}

	@Override
	protected Map<String, String> readParams(WebScriptRequest req) {
		
		Map<String, String> params = super.readParams(req);
		
		if (foldersOnly){
			params.put(PARAM_NODE_ID, req.getParameter("node"));
		}
		else{
			params.put(PARAM_NODE_ID, req.getParameter(PARAM_NODE_ID));
		}
		
		if (log.isDebugEnabled()) {
			log.debug("PARAM nodeId = " + params.get(PARAM_NODE_ID));
			log.debug("FOLDERS_ONLY = " + foldersOnly);
		}
		
		if (!foldersOnly) {
			// set default paging values.
			if (params.get(PARAM_START) == null) {
				// TODO
				log.warn("Setting start to 0 TODO refactor ui");
				params.put(PARAM_START, "0");
			}
			if (params.get(PARAM_LIMIT) == null) {
				// TODO
				log.warn("Setting limit to 50 TODO refactor ui");
				params.put(PARAM_LIMIT, "50");
			}
		}
		
		return params;
	}
	
	public Map<String, Object> executeImpl(WebScriptRequest req, WebScriptStatus status) {

		initServices();
		
		Map<String, String> params = readParams(req);
		
		StoreRef storeRef = new StoreRef("workspace://SpacesStore");
		NodeRef companyHome = getRepositoryContext().getCompanyHome();
		NodeRef baseNode = companyHome;

		if (params.get(PARAM_NODE_ID) != null) {
			baseNode = new NodeRef(storeRef, params.get(PARAM_NODE_ID));
		}
	
		FileInfo fileInfo = fileFolderService.getFileInfo(baseNode);
		String path = generatePath(nodeService, fileFolderService, baseNode);
		
		List<FileInfo> children = toFileInfo(customFileFolderService.list(baseNode, foldersOnly));
		
		if (log.isDebugEnabled()) {
			log.debug("node is folder = " + fileInfo.isFolder());
			log.debug("node name = " + fileInfo.getName());
			log.debug("node path = " + path);
			log.debug("node children count = " + children.size());
		}

		int total = children.size();
		children = sort(children, params);
		children = doPaging(children, params);

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("total", total);
		model.put("path", path);
		model.put("randomNumber", Math.random());
		model.put("folderName", fileInfo.getName());
		model.put("folderId", baseNode.getId());

		Object[] rows = new Object[children.size()]; 
		int i = 0;
		for (FileInfo info : children) {
			rows[i++] = toModelRow(info);
		}
		model.put(KEYWORD_ROWS, rows);

		return model;
	}

	private String generatePath(NodeService nodeService, FileFolderService fileFolderService, NodeRef nodeRef) {
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

}

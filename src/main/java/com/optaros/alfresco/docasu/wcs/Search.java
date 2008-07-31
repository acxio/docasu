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
import java.util.List;
import java.util.Map;

import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.web.scripts.WebScriptRequest;
import org.alfresco.web.scripts.WebScriptStatus;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.optaros.alfresco.docasu.wcs.CustomFileFolderService.SearchType;

/**
 * @author Jean-Luc Geering
 */
public class Search extends AbstractDocumentWebScript {

	private static final Log log = LogFactory.getLog(Search.class);

	private static final String PARAM_QUERY			= "q";
	private static final String PARAM_SEARCH_TYPE	= "t";

	@Override
	protected Map<String, String> readParams(WebScriptRequest req) {

		Map<String, String> params = super.readParams(req);

		readParam(params, PARAM_QUERY, req.getParameter(PARAM_QUERY));
		readParam(params, PARAM_SEARCH_TYPE, req.getParameter(PARAM_SEARCH_TYPE));

		if (log.isDebugEnabled()) {
			log.debug("PARAM q = " + params.get(PARAM_QUERY));
			log.debug("PARAM t = " + params.get(PARAM_SEARCH_TYPE));
		}

		return params;
	}

	private boolean validParams(Map<String, String> params) {
		return params.containsKey(PARAM_QUERY);
	}

	private boolean isSimpleSearch(Map<String, String> params) {
		return true;
	}

	@Override
	public Map<String, Object> executeImpl(WebScriptRequest req, WebScriptStatus status) {

		initServices();

		Map<String, String> params = readParams(req);
		Map<String, Object> model = new HashMap<String, Object>();

		if (!validParams(params)) {
			status.setCode(400);
			status.setMessage("Search term has not been provided.");
			status.setRedirect(true);
		}
		else {
			String searchTypeParam = params.get(PARAM_SEARCH_TYPE);
			SearchType searchType;
			if ("file".equals(searchTypeParam)) {
				searchType = SearchType.FILE_NAME;
			}
			else if ("folder".equals(searchTypeParam)) {
				searchType = SearchType.FOLDER_NAME;
			}
			else if ("content".equals(searchTypeParam)) {
				searchType = SearchType.CONTENT;
			}
			else {
				searchType = SearchType.ALL;
			}

			List<FileInfo> nodes;
			if (isSimpleSearch(params)) {
				nodes = toFileInfo(customFileFolderService.search(storeRef, params.get(PARAM_QUERY), searchType));
			}
			else {
				nodes = toFileInfo(customFileFolderService.search(storeRef, params.get(PARAM_QUERY), searchType, null, null, null, null, null));
			}

			int total = nodes.size();
			nodes = sort(nodes, params);
			nodes = doPaging(nodes, params);

			model.put("total", total);

			Object[] rows = new Object[nodes.size()];
			model.put("randomNumber", Math.random());

			int i = 0;
			for (FileInfo info : nodes) {
				Map<String, Object> row = toModelRow(info);
				NodeRef parentRef = nodeService.getPrimaryParent(info.getNodeRef()).getParentRef();
				if (parentRef != null) {
					row.put("parentId", parentRef.getId());
					row.put("parentPath", generatePath(parentRef));
				}
				rows[i++] = row;
			}
			model.put(KEYWORD_ROWS, rows);
		}
		return model;
	}
}

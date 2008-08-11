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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.repo.security.permissions.AccessDeniedException;
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

	// simple search
	private static final String PARAM_QUERY			= "q";
	private static final String PARAM_SEARCH_TYPE	= "t";

	// advanced search
	private static final String PARAM_CREATED_FROM	= "createdFrom";
	private static final String PARAM_CREATED_TO	= "createdTo";
	private static final String PARAM_MODIFIED_FROM	= "modFrom";
	private static final String PARAM_MODIFIED_TO	= "modTo";

	private static final String DATE_FORMAT			= "yyyy/MM/dd";

	private final SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);

	@Override
	protected Map<String, String> readParams(WebScriptRequest req) {

		Map<String, String> params = super.readParams(req);

		readParam(params, PARAM_QUERY, req.getParameter(PARAM_QUERY));
		readParam(params, PARAM_SEARCH_TYPE, req.getParameter(PARAM_SEARCH_TYPE));
		readParam(params, PARAM_CREATED_FROM, req.getParameter(PARAM_CREATED_FROM));
		readParam(params, PARAM_CREATED_TO, req.getParameter(PARAM_CREATED_TO));
		readParam(params, PARAM_MODIFIED_FROM, req.getParameter(PARAM_MODIFIED_FROM));
		readParam(params, PARAM_MODIFIED_TO, req.getParameter(PARAM_MODIFIED_TO));


		if (log.isDebugEnabled()) {
			log.debug("PARAM q = " + params.get(PARAM_QUERY));
			log.debug("PARAM t = " + params.get(PARAM_SEARCH_TYPE));
			log.debug("PARAM createdFrom = " + params.get(PARAM_CREATED_FROM));
			log.debug("PARAM createdTo = " + params.get(PARAM_CREATED_TO));
			log.debug("PARAM modFrom = " + params.get(PARAM_MODIFIED_FROM));
			log.debug("PARAM modTo = " + params.get(PARAM_MODIFIED_TO));
		}

		return params;
	}

	private boolean validParams(Map<String, String> params) {
		return params.containsKey(PARAM_QUERY) || isAdvancedSearch(params);
	}

	private boolean isAdvancedSearch(Map<String, String> params) {
		return (params.containsKey(PARAM_NODE_ID)
				|| params.containsKey(PARAM_CREATED_FROM)
				|| params.containsKey(PARAM_CREATED_TO)
				|| params.containsKey(PARAM_MODIFIED_FROM)
				|| params.containsKey(PARAM_MODIFIED_TO));
	}

	@Override
	public Map<String, Object> executeImpl(WebScriptRequest req, WebScriptStatus status) {
		log.debug("*** Enter search request handler ***");
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
			if (!isAdvancedSearch(params)) {
				nodes = toFileInfo(customFileFolderService.search(storeRef, params.get(PARAM_QUERY), searchType));
			}
			else {
				NodeRef lookInFolder = null;
				if (params.containsKey(PARAM_NODE_ID)) {
					lookInFolder = new NodeRef(storeRef, params.get(PARAM_NODE_ID));
				}
				Date createdFrom = null, createdTo = null, modifiedFrom = null, modifiedTo = null;
				if (params.containsKey(PARAM_CREATED_FROM)) {
					try {
						// TODO transform user timezone to server timezone
						createdFrom = dateFormat.parse(params.get(PARAM_CREATED_FROM));
					} catch (ParseException e) {/* TODO ignore? */}
				}
				if (params.containsKey(PARAM_CREATED_TO)) {
					try {
						// TODO transform user timezone to server timezone
						createdTo = dateFormat.parse(params.get(PARAM_CREATED_TO));
					} catch (ParseException e) {/* TODO ignore? */}
				}
				if (params.containsKey(PARAM_MODIFIED_FROM)) {
					try {
						// TODO transform user timezone to server timezone
						modifiedFrom = dateFormat.parse(params.get(PARAM_MODIFIED_FROM));
					} catch (ParseException e) {/* TODO ignore? */}
				}
				if (params.containsKey(PARAM_MODIFIED_TO)) {
					try {
						// TODO transform user timezone to server timezone
						modifiedTo = dateFormat.parse(params.get(PARAM_MODIFIED_TO));
					} catch (ParseException e) {/* TODO ignore? */}
				}

				nodes = toFileInfo(customFileFolderService.search(
						storeRef,
						params.get(PARAM_QUERY),
						searchType,
						lookInFolder,
						createdFrom, createdTo,
						modifiedFrom, modifiedTo));
			}

			int total = nodes.size();
			nodes = sort(nodes, params);
			nodes = doPaging(nodes, params);

			model.put("total", total);

			Object[] rows = new Object[nodes.size()];
			model.put("randomNumber", Math.random());

			int i = 0;
			for (FileInfo info : nodes) {
				try {
					Map<String, Object> row = toModelRow(info);
					NodeRef parentRef = nodeService.getPrimaryParent(info.getNodeRef()).getParentRef();
					if (parentRef != null) {
						row.put("parentId", parentRef.getId());
						row.put("parentPath", generatePath(parentRef));
					}
					rows[i++] = row;
				}
				catch (AccessDeniedException ade) {/* Ignore node. */}
			}
			model.put(KEYWORD_ROWS, rows);
		}
		log.debug("*** Exit search request handler ***");
		return model;
	}
}

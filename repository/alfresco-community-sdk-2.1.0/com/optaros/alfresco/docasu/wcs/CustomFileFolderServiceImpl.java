package com.optaros.alfresco.docasu.wcs;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.search.impl.lucene.QueryParser;
import org.alfresco.service.cmr.dictionary.DataTypeDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.ResultSetRow;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @author Thomas Verin, Jean-Luc Geering
 * @see org.alfresco.repo.model.filefolder.FileFolderServiceImpl (copied from)
 */
public class CustomFileFolderServiceImpl implements CustomFileFolderService {

	private static Log logger = LogFactory.getLog(CustomFileFolderServiceImpl.class);

	private static final String LUCENE_BASE_QUERY = "-TYPE:\"" + ContentModel.TYPE_SYSTEM_FOLDER + "\"";

	private static final String MIN_DATE 			= "1970\\-01\\-01T00:00:00";
	private static final String MAX_DATE			= "3000\\-12\\-31T00:00:00";

	private static final String LUCENE_DATE_FORMAT	= "yyyy\\-MM\\-dd'T00:00:00'";
	private final SimpleDateFormat dateFormat = new SimpleDateFormat(LUCENE_DATE_FORMAT);

	// Class not found in alfresco-enterprise-2.1.1 !
	// private TenantService tenantService;
	private DictionaryService dictionaryService;
	private SearchService searchService;
	private Properties blacklist;
	private Properties whitelist;
	private DataTypeDefinition dataTypeNodeRef;

	public void init() {
		dataTypeNodeRef = dictionaryService.getDataType(DataTypeDefinition.NODE_REF);
	}

	/**
	 * Construct a filtered query with the values from blacklist.properties and whitelist.properties
	 */
	@SuppressWarnings("unchecked")
	public StringBuffer prepareQuery(StringBuffer query) {
		//get all the values in blacklist.properties to build the filtered query
		// Exclude all from blacklist (AND)
		for (Iterator iterator = blacklist.values().iterator(); iterator.hasNext();) {
			String value = (String) iterator.next();
			query.append(" -TYPE:\"" + value + "\"");
		}
		// Include (at least) one form whitelist (OR)
		query.append(" +(");
		for (Iterator iterator = whitelist.values().iterator(); iterator.hasNext();) {
			String value = (String) iterator.next();
			query.append(" TYPE:\"" + value + "\"");
		}
		query.append(" )");
		return query;
	}

//	public void setTenantService(TenantService tenantService) {
//		this.tenantService = tenantService;
//	}

	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	public void setSearchService(SearchService searchService) {
		this.searchService = searchService;
	}

	public void setBlacklist(Properties blacklist) {
		this.blacklist = blacklist;
	}

	public void setWhitelist(Properties whitelist) {
		this.whitelist = whitelist;
	}

	private List<NodeRef> toNodeRef(ResultSet rs) {
		List<NodeRef> nodeRefs = new ArrayList<NodeRef>(rs.length());
		try {
			for (ResultSetRow row : rs) {
				nodeRefs.add(row.getNodeRef());
			}
		}
		finally {
			rs.close();
		}

		return nodeRefs;
	}

	public List<NodeRef> list(NodeRef contextNodeRef, boolean foldersOnly) {

		// contextNodeRef = tenantService.getName(contextNodeRef);

		SearchParameters params = new SearchParameters();
		params.setLanguage(SearchService.LANGUAGE_LUCENE);
		params.addStore(contextNodeRef.getStoreRef());
		StringBuffer query = prepareQuery(new StringBuffer(LUCENE_BASE_QUERY));
		query.append(" +PARENT:\"" + contextNodeRef.toString() + "\"");
		if(foldersOnly){
			query.append(" -TYPE:\"" + ContentModel.TYPE_CONTENT + "\"");
		}
		if (logger.isDebugEnabled()) {
			logger.debug("List query = '" + query + "'");
		}
		params.setQuery(query.toString());
		return toNodeRef(searchService.query(params));
	}

	public List<NodeRef> search(StoreRef store, String query, SearchType type) {
		return search(store, query, type, null, null, null, null, null);
	}

	public List<NodeRef> search(StoreRef store, String query, SearchType type, NodeRef lookInFolder,
			Date createdFrom, Date createdTo,
			Date modifiedFrom, Date modifiedTo) {

		if (logger.isDebugEnabled()) {
			logger.debug("SEARCH PARAM store = " + store);
			logger.debug("SEARCH PARAM query = " + query);
			logger.debug("SEARCH PARAM type = " + type);
			logger.debug("SEARCH PARAM lookInFolder = " + lookInFolder);
			logger.debug("SEARCH PARAM createdFrom = " + createdFrom);
			logger.debug("SEARCH PARAM createdTo = " + createdTo);
			logger.debug("SEARCH PARAM modifiedFrom = " + modifiedFrom);
			logger.debug("SEARCH PARAM modifiedTo = " + modifiedTo);
		}

		SearchParameters params = new SearchParameters();
		params.setLanguage(SearchService.LANGUAGE_LUCENE);
		params.addStore(store);

		StringBuffer luceneQuery = prepareQuery(new StringBuffer(LUCENE_BASE_QUERY));

		if (query != null && query.length() > 0) {
			// Escape Lucene characters.
			query = QueryParser.escape(query);
			if (type == SearchType.ALL) {
				luceneQuery.append(" +(TEXT:\"" + query + "\" @cm\\:name:\"" + query + "\")");
			}
			else if (type == SearchType.FILE_NAME || type == SearchType.FOLDER_NAME) {
				luceneQuery.append(" +@cm\\:name:\"" + query + "\"");
			}
			else if (type == SearchType.CONTENT) {
				luceneQuery.append(" +TEXT:\"" + query + "\"");
			}
		}
		if (type == SearchType.FILE_NAME) {
			luceneQuery.append(" +TYPE:\"" + ContentModel.TYPE_CONTENT + "\"");
		}
		else if (type == SearchType.FOLDER_NAME) {
			luceneQuery.append(" +TYPE:\"" + ContentModel.TYPE_FOLDER + "\"");
		}
		else if (type == SearchType.CONTENT) {
			luceneQuery.append(" +TYPE:\"" + ContentModel.TYPE_CONTENT + "\"");
		}

		if (lookInFolder != null) {
			luceneQuery.append(" +PARENT:\"" + lookInFolder.toString() + "\"");
		}

		if (createdFrom != null || createdTo != null) {
			writeDateRange(luceneQuery, "created", createdFrom, createdTo);
		}
		if (modifiedFrom != null || modifiedTo != null) {
			writeDateRange(luceneQuery, "modified", modifiedFrom, modifiedTo);
		}

		if (logger.isDebugEnabled()) {
			logger.debug("Search query = '" + luceneQuery + "'");
		}
		params.setQuery(luceneQuery.toString());
		return toNodeRef(searchService.query(params));
	}

	private void writeDateRange(StringBuffer luceneQuery, String field, Date fromDate, Date toDate) {
		String from, to;
		if (fromDate != null) {
			from = dateFormat.format(fromDate);
		}
		else {
			from = MIN_DATE;
		}
		if (toDate != null) {
			to = dateFormat.format(toDate);
		}
		else {
			to = MAX_DATE;
		}
		luceneQuery.append(" +@cm\\:" + field + ":[" + from + " TO " + to + "]");
	}
}

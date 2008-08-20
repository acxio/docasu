package com.optaros.alfresco.docasu.wcs;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.faces.context.FacesContext;
import javax.transaction.UserTransaction;

import org.alfresco.service.cmr.dictionary.DataTypeDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.ResultSetRow;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.web.bean.repository.Repository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.optaros.alfresco.docasu.wcs.helper.QueryManager;

/**
 * @author Thomas Verin, Jean-Luc Geering
 * @see org.alfresco.repo.model.filefolder.FileFolderServiceImpl (copied from)
 */
public class CustomFileFolderServiceImpl implements CustomFileFolderService {

	private static Log logger = LogFactory.getLog(CustomFileFolderServiceImpl.class);

	// Class not found in alfresco-enterprise-2.1.1 !
	// private TenantService tenantService;
	private DictionaryService dictionaryService;
	private SearchService searchService;
	private Properties blacklist;
	private Properties whitelist;
	// FIXME: remove this if no longer used
	@SuppressWarnings("unused")
	private DataTypeDefinition dataTypeNodeRef;

	public void init() {
		dataTypeNodeRef = dictionaryService.getDataType(DataTypeDefinition.NODE_REF);
	}

	// public void setTenantService(TenantService tenantService) {
	// this.tenantService = tenantService;
	// }

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
		} finally {
			rs.close();
		}

		return nodeRefs;
	}

	public List<NodeRef> list(NodeRef contextNodeRef, boolean foldersOnly) {

		// contextNodeRef = tenantService.getName(contextNodeRef);

		SearchParameters params = new SearchParameters();
		params.setLanguage(SearchService.LANGUAGE_LUCENE);
		params.addStore(contextNodeRef.getStoreRef());

		// add query
		String query = new QueryManager().createListQuery(contextNodeRef, foldersOnly, whitelist, blacklist);
		params.setQuery(query);

		// log4j.logger.org.alfresco.repo.search.impl.lucene.LuceneQueryParser=debug
		if (logger.isDebugEnabled()) {
			logger.debug("List query = '" + query + "'");
		}

		return searchLucene(params);
	}

	public List<NodeRef> search(StoreRef store, String query, SearchType type) {
		return search(store, query, type, null, null, null, null, null);
	}

	public List<NodeRef> search(StoreRef store, String query, SearchType type, NodeRef lookInFolder, Date createdFrom, Date createdTo, Date modifiedFrom,
			Date modifiedTo) {

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

		// add query
		String luceneQuery = new QueryManager().createSearchQuery(query, type, lookInFolder, createdFrom, createdTo, modifiedFrom, modifiedTo, whitelist,
				blacklist);

		// log4j.logger.org.alfresco.repo.search.impl.lucene.LuceneQueryParser=debug
		if (logger.isDebugEnabled()) {
			logger.debug("Search query = '" + luceneQuery + "'");
		}

		return searchLucene(params);
	}

	/**
	 * Performs the search against repository.
	 * 
	 * @param params
	 * @return
	 */
	private List<NodeRef> searchLucene(SearchParameters params) {
		// perform the search against the repository
		UserTransaction tx = null;
		List<NodeRef> results = new ArrayList<NodeRef>();

		try {
			tx = Repository.getUserTransaction(FacesContext.getCurrentInstance(), true);
			tx.begin();
			results = toNodeRef(searchService.query(params));
			tx.commit();
		} catch (Throwable e) {
			e.printStackTrace();
		}

		return results;
	}

}

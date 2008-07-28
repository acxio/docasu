package com.optaros.alfresco.docasu.wcs;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.search.QueryParameterDefImpl;
import org.alfresco.repo.tenant.TenantService;
import org.alfresco.service.cmr.dictionary.DataTypeDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.search.QueryParameterDefinition;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.ResultSetRow;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * 
 * @author Thomas Verin
 * @see org.alfresco.repo.model.filefolder.FileFolderServiceImpl (copied from)
 */
public class CustomFileFolderServiceImpl implements CustomFileFolderService {

	private static Log logger = LogFactory.getLog(CustomFileFolderServiceImpl.class);

	private static final String LUCENE_QUERY =
		"+PARENT:\"${cm:parent}\" " +
		"-TYPE:\"" + ContentModel.TYPE_SYSTEM_FOLDER + "\" ";
	
	private static final QName PARAM_QNAME_PARENT = QName.createQName(
			NamespaceService.CONTENT_MODEL_1_0_URI, "parent");

	// Class not found in alfresco-entreprise-2.1.1 !
//    private TenantService tenantService;
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
	 * @return
	 */
	public String constructQuery(boolean folders) {
		StringBuffer query = new StringBuffer(LUCENE_QUERY);
		//get all the values in blacklist.properties to build the filtered query
		// Exclude all from blacklist (AND)
		for (Iterator iterator = blacklist.values().iterator(); iterator.hasNext();) {
			String value = (String) iterator.next();
			query.append("-TYPE:\"" + value + "\" ");
		}
		if(folders){
			query.append("-TYPE:\"" + ContentModel.TYPE_CONTENT + "\" ");
		}
		// Include (at least) one form whitelist (OR)
		query.append("+(");
		for (Iterator iterator = whitelist.values().iterator(); iterator.hasNext();) {
			String value = (String) iterator.next();
			query.append("TYPE:\"" + value + "\" ");
		}
		query.append(")");
		logger.debug("QUERY: "+query.toString());
		return query.toString();
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

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.optaros.alfresco.docasu.wcs.CustomFileFolderImpl#list(org.alfresco.service.cmr.repository.NodeRef)
	 */
	public List<NodeRef> list(NodeRef contextNodeRef,boolean folders) {
		// execute the query
		List<NodeRef> nodeRefs = luceneSearch(contextNodeRef, folders, true);
		
		return nodeRefs;
	}

	private List<NodeRef> luceneSearch(NodeRef contextNodeRef, boolean folders,
			boolean files) {

//		contextNodeRef = tenantService.getName(contextNodeRef);

		SearchParameters params = new SearchParameters();
		params.setLanguage(SearchService.LANGUAGE_LUCENE);
		params.addStore(contextNodeRef.getStoreRef());
		// set the parent parameter
		QueryParameterDefinition parentParamDef = new QueryParameterDefImpl(
				PARAM_QNAME_PARENT,
				dataTypeNodeRef,
				true,
				contextNodeRef.toString());
		params.addQueryParameterDefinition(parentParamDef);
		params.setQuery(constructQuery(folders));

		ResultSet rs = searchService.query(params);
		int length = rs.length();
		List<NodeRef> nodeRefs = new ArrayList<NodeRef>(length);
		try {
			for (ResultSetRow row : rs) {
				nodeRefs.add(row.getNodeRef());
			}
		} finally {
			rs.close();
		}
		return nodeRefs;
	}

}

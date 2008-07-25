package com.optaros.alfresco.docasu.wcs;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.alfresco.error.AlfrescoRuntimeException;
import org.alfresco.model.ContentModel;
import org.alfresco.repo.search.QueryParameterDefImpl;
import org.alfresco.repo.tenant.TenantService;
import org.alfresco.service.cmr.dictionary.DataTypeDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
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
 * @author Tom
 * 
 */
public class CustomFileFolderServiceImpl implements CustomFileFolderService {
	
	private static Log logger = LogFactory
			.getLog(CustomFileFolderServiceImpl.class);

	private static final QName PARAM_QNAME_PARENT = QName.createQName(
			NamespaceService.CONTENT_MODEL_1_0_URI, "parent");

	private TenantService tenantService;
	private NodeService nodeService;
	private DictionaryService dictionaryService;
	private SearchService searchService;
	private Properties blacklist;
	private Properties whitelist;
	private DataTypeDefinition dataTypeNodeRef;

	public void init() {
		dataTypeNodeRef = dictionaryService
				.getDataType(DataTypeDefinition.NODE_REF);
	}

	/**
	 * Construct a filtered query with the values from blacklist.properties and whitelist.properties
	 * @return
	 */
	public String constructQuery() {
		StringBuffer query = new StringBuffer();
		query.append("+PARENT:\"${cm:parent}\"");
		query.append("-(");
		query.append("TYPE:\"" + ContentModel.TYPE_SYSTEM_FOLDER + "\" ");
		//get all the values in blacklist.properties to build the filtered query
		for (Iterator iterator = blacklist.values().iterator(); iterator.hasNext();) {
			String value = (String) iterator.next();
			query.append("TYPE:\"" + value + "\" ");
		}
		query.append(")");
		query.append("+(");
		for (Iterator iterator = whitelist.values().iterator(); iterator.hasNext();) {
			String value = (String) iterator.next();
			query.append("TYPE:\"" + value + "\" ");
		}
		query.append(")");
		logger.debug("QUERY: "+query.toString());
		return query.toString();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.optaros.alfresco.docasu.wcs.CustomFileFolderImpl#setTenantService(org.alfresco.repo.tenant.TenantService)
	 */
	public void setTenantService(TenantService tenantService) {
		this.tenantService = tenantService;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.optaros.alfresco.docasu.wcs.CustomFileFolderImpl#setNodeService(org.alfresco.service.cmr.repository.NodeService)
	 */
	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.optaros.alfresco.docasu.wcs.CustomFileFolderImpl#setDictionaryService(org.alfresco.service.cmr.dictionary.DictionaryService)
	 */
	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.optaros.alfresco.docasu.wcs.CustomFileFolderImpl#setSearchService(org.alfresco.service.cmr.search.SearchService)
	 */
	public void setSearchService(SearchService searchService) {
		this.searchService = searchService;
	}

	public void setBlacklist(Properties blacklist) {
		this.blacklist = blacklist;
	}
	
	public void setWhitelist(Properties whitelist) {
		this.whitelist = whitelist;
	}

	/**
	 * Exception when the type is not a valid File or Folder type
	 * 
	 * @see ContentModel#TYPE_CONTENT
	 * @see ContentModel#TYPE_FOLDER
	 * 
	 * @author Derek Hulley
	 */
	private static class InvalidTypeException extends RuntimeException {
		private static final long serialVersionUID = -310101369475434280L;

		public InvalidTypeException(String msg) {
			super(msg);
		}
	}

	/**
	 * Helper method to convert node reference instances to file info
	 * 
	 * @param nodeRefs
	 *            the node references
	 * @return Return a list of file info
	 * @throws InvalidTypeException
	 *             if the node is not a valid type
	 */
	private List<FileInfo> toFileInfo(List<NodeRef> nodeRefs)
			throws InvalidTypeException {
		List<FileInfo> results = new ArrayList<FileInfo>(nodeRefs.size());
		for (NodeRef nodeRef : nodeRefs) {
			if (nodeService.exists(nodeRef)) {
				FileInfo fileInfo = toFileInfo(nodeRef, true);
				results.add(fileInfo);
			}
		}
		return results;
	}

	/**
	 * Helper method to convert a node reference instance to a file info
	 */
	private FileInfo toFileInfo(NodeRef nodeRef, boolean addTranslations)
			throws InvalidTypeException {
		// Get the file attributes
		Map<QName, Serializable> properties = nodeService
				.getProperties(nodeRef);
		// Is it a folder
		QName typeQName = nodeService.getType(nodeRef);
		if (logger.isDebugEnabled()) {
			logger.debug("Qname: " + typeQName);
		}
		boolean isFolder = isFolder(typeQName);

		// Construct the file info and add to the results
		FileInfo fileInfo = new FileInfoImpl(nodeRef, isFolder, properties);
		// Done
		return fileInfo;
	}

	/**
	 * Checks the type for whether it is a file or folder. All invalid types
	 * lead to runtime exceptions.
	 * 
	 * @param typeQName
	 *            the type to check
	 * @return Returns true if the type is a valid folder type, false if it is a
	 *         file.
	 * @throws AlfrescoRuntimeException
	 *             if the type is not handled by this service
	 */
	private boolean isFolder(QName typeQName) throws InvalidTypeException {
		if (dictionaryService.isSubClass(typeQName, ContentModel.TYPE_FOLDER)) {
			if (dictionaryService.isSubClass(typeQName,
					ContentModel.TYPE_SYSTEM_FOLDER)) {
				throw new InvalidTypeException(
						"This service should ignore type "
								+ ContentModel.TYPE_SYSTEM_FOLDER);
			}
			return true;
		} else if (dictionaryService.isSubClass(typeQName,
				ContentModel.TYPE_CONTENT)
				|| dictionaryService.isSubClass(typeQName,
						ContentModel.TYPE_LINK)) {
			// it is a regular file
			return false;
		} else {
			// unhandled type
			throw new InvalidTypeException(
					"Type is not handled by this service: " + typeQName);
		}
	}

	//    
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.optaros.alfresco.docasu.wcs.CustomFileFolderImpl#list(org.alfresco.service.cmr.repository.NodeRef)
	 */
	public List<FileInfo> list(NodeRef contextNodeRef) {
		// execute the query
		List<NodeRef> nodeRefs = luceneSearch(contextNodeRef, true, true);
		// convert the noderefs
		List<FileInfo> results = toFileInfo(nodeRefs);
		// done
		if (logger.isDebugEnabled()) {
			logger.debug("Shallow search for files and folders: \n"
					+ "   context: " + contextNodeRef + "\n" + "   results: "
					+ results);
		}
		return results;
	}

	private List<NodeRef> luceneSearch(NodeRef contextNodeRef, boolean folders,
			boolean files) {

		contextNodeRef = tenantService.getName(contextNodeRef);

		SearchParameters params = new SearchParameters();
		params.setLanguage(SearchService.LANGUAGE_LUCENE);
		params.addStore(contextNodeRef.getStoreRef());
		// set the parent parameter
		QueryParameterDefinition parentParamDef = new QueryParameterDefImpl(
				PARAM_QNAME_PARENT, dataTypeNodeRef, true, contextNodeRef
						.toString());
		params.addQueryParameterDefinition(parentParamDef);
		
		if (folders && files) // search for both files and folders
		{
			params.setQuery(constructQuery());
		} else {
			throw new IllegalArgumentException(
					"Must search for either files or folders or both");
		}
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
		// done
		return nodeRefs;
	}

}

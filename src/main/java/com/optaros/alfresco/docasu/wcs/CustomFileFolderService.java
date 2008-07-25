package com.optaros.alfresco.docasu.wcs;

import java.util.List;
import java.util.Properties;

import org.alfresco.repo.tenant.TenantService;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.search.SearchService;

public interface CustomFileFolderService {

	public abstract void setTenantService(TenantService tenantService);

	public abstract void setNodeService(NodeService nodeService);

	public abstract void setDictionaryService(
			DictionaryService dictionaryService);

	public abstract void setSearchService(SearchService searchService);
	
	public abstract void setBlacklist(Properties blacklist);

	//    
	public abstract List<FileInfo> list(NodeRef contextNodeRef);

}
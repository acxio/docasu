package com.optaros.alfresco.docasu.wcs;

import java.util.Date;
import java.util.List;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;

public interface CustomFileFolderService {

	public enum SearchType {
		ALL, FILE_NAME, FOLDER_NAME, CONTENT;
	}

	public abstract List<NodeRef> list(NodeRef contextNodeRef, boolean folders);

	// Simple Search
	public abstract List<NodeRef> search(StoreRef store, String query, SearchType type);

	// Advanced Search
	public abstract List<NodeRef> search(StoreRef store, String query, SearchType type, NodeRef lookInFolder, Date createdFrom, Date createdTo,
			Date modifiedFrom, Date modifiedTo);

}
package com.optaros.alfresco.docasu.wcs;

import java.util.List;

import org.alfresco.service.cmr.repository.NodeRef;

public interface CustomFileFolderService {

	public abstract List<NodeRef> list(NodeRef contextNodeRef, boolean folders);

}
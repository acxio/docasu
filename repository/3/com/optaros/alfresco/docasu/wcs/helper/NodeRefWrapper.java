package com.optaros.alfresco.docasu.wcs.helper;

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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.alfresco.model.ContentModel;
import org.alfresco.service.cmr.repository.ContentData;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.datatype.DefaultTypeConverter;
import org.alfresco.service.namespace.QName;

/**
 * This class wraps a NodeRef object together with the sorting property. Use
 * this for sorting instead of FileInfo objects. This wrapper reads only the
 * sorting property from the repository instead of all properties as FileInfo
 * does, thus performs faster on large sets of data.
 * 
 * @author Viorel Andronic
 * 
 */
public class NodeRefWrapper {

	private NodeRef node;

	// sort properties
	private String name = "";
	private Long size = 0L;
	private Date modified = new Date();
	private Date created = new Date();
	private String creator = "";

	public NodeRefWrapper(NodeRef node, NodeService nodeService, QName property) {
		this.node = node;
		createWrapper(nodeService, property);
	}

	private void createWrapper(NodeService nodeService, QName property) {
		// read the sorting property into the wrapper
		if (ContentModel.PROP_NAME.equals(property)) {
			name = DefaultTypeConverter.INSTANCE.convert(String.class, getProperty(nodeService, property)).toLowerCase();
		} else if (ContentModel.PROP_CONTENT.equals(property)) {
			ContentData data = DefaultTypeConverter.INSTANCE.convert(ContentData.class, getProperty(nodeService, property));
			size = (data != null ? data.getSize() : 0);
		} else if (ContentModel.PROP_MODIFIED.equals(property)) {
			modified = DefaultTypeConverter.INSTANCE.convert(Date.class, getProperty(nodeService, property));
		} else if (ContentModel.PROP_CREATED.equals(property)) {
			created = DefaultTypeConverter.INSTANCE.convert(Date.class, getProperty(nodeService, property));
		} else if (ContentModel.PROP_CREATOR.equals(property)) {
			creator = DefaultTypeConverter.INSTANCE.convert(String.class, getProperty(nodeService, property)).toLowerCase();
		}
	}

	private Serializable getProperty(NodeService nodeService, QName property) {
		// TODO: find a faster way to retrieve the property
		return nodeService.getProperty(node, property);
	}

	public NodeRef getNodeRef() {
		return node;
	}

	public String getName() {
		return name;
	}

	public Long getSize() {
		return size;
	}

	public Date getModified() {
		return modified;
	}

	public Date getCreated() {
		return created;
	}

	public String getCreator() {
		return creator;
	}

	public static List<NodeRef> getNodeRefList(List<NodeRefWrapper> nodeRefWrapperList) {
		List<NodeRef> result = new ArrayList<NodeRef>();
		for (NodeRefWrapper nodeRefWrapper : nodeRefWrapperList)
			result.add(nodeRefWrapper.getNodeRef());
		return result;
	}

	public static List<NodeRefWrapper> createNodeRefWrappers(List<NodeRef> nodeRefList, NodeService nodeService, QName property) {
		List<NodeRefWrapper> result = new ArrayList<NodeRefWrapper>();
		for (NodeRef nodeRef : nodeRefList)
			result.add(new NodeRefWrapper(nodeRef, nodeService, property));
		return result;
	}

}

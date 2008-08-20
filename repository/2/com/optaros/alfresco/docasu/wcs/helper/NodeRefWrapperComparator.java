package com.optaros.alfresco.docasu.wcs.helper;

import java.util.Comparator;

import org.alfresco.model.ContentModel;
import org.alfresco.service.namespace.QName;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Use this class to sort NodeRefWrapper objects specifying a sorting property
 * and the direction.
 * 
 * @author Viorel Andronic
 * 
 */
public class NodeRefWrapperComparator implements Comparator<NodeRefWrapper> {

	private static final Log log = LogFactory.getLog(NodeRefWrapperComparator.class);

	private final QName property;
	private final boolean ascending;

	public NodeRefWrapperComparator(QName property, boolean ascending) {
		this.property = property;
		this.ascending = ascending;
	}

	public int compare(NodeRefWrapper n1, NodeRefWrapper n2) {
		if (ContentModel.PROP_NAME.equals(property)) {
			return (ascending ? n1.getName().compareTo(n2.getName()) : n2.getName().compareTo(n1.getName()));
		} else if (ContentModel.PROP_CONTENT.equals(property)) {
			long diff = (ascending ? n1.getSize() - n2.getSize() : n2.getSize() - n1.getSize());
			return diff > 0 ? 1 : diff < 0 ? -1 : 0;
		} else if (ContentModel.PROP_MODIFIED.equals(property)) {
			return (ascending ? n1.getModified().compareTo(n2.getModified()) : n2.getModified().compareTo(n1.getModified()));
		} else if (ContentModel.PROP_CREATED.equals(property)) {
			return (ascending ? n1.getCreated().compareTo(n2.getCreated()) : n2.getCreated().compareTo(n1.getCreated()));
		} else if (ContentModel.PROP_CREATOR.equals(property)) {
			return (ascending ? n1.getCreator().compareTo(n2.getCreator()) : n2.getCreator().compareTo(n1.getCreator()));
		}
		// otherwise
		log.error("Sorting not implemented for column = " + property.getLocalName());
		return 0;
	}
}
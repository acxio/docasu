/**
 * 
 */
package com.optaros.alfresco.docasu.wcs;

import org.alfresco.repo.processor.BaseProcessorExtension;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.repository.MimetypeService;
import org.alfresco.service.namespace.QName;

/**
 * Use this class to provide JavaScript access to different Alfresco Services.
 * 
 * @author Viorel Andronic
 * 
 */
public class ServiceRegistryProxy extends BaseProcessorExtension {

	private ServiceRegistry impl;

	public void setServiceRegistry(final ServiceRegistry impl) {
		this.impl = impl;
	}

	public MimetypeService getMimetypeService() {
		return impl.getMimetypeService();
	}

	public boolean isServiceProvided(final QName qname) {
		return impl.isServiceProvided(qname);
	}

}

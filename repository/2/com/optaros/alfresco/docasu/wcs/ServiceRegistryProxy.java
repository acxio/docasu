package com.optaros.alfresco.docasu.wcs;

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

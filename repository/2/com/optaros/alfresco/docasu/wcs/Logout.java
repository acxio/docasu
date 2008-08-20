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

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.alfresco.web.scripts.DeclarativeWebScript;
import org.alfresco.web.scripts.WebScriptRequest;
import org.alfresco.web.scripts.WebScriptStatus;
import org.alfresco.web.scripts.WebScriptServletRequest;
import org.apache.commons.logging.LogFactory;

public class Logout extends DeclarativeWebScript {
	private static final org.apache.commons.logging.Log log = LogFactory.getLog(Logout.class);

	public Map<String, Object> executeImpl(WebScriptRequest req, WebScriptStatus status) {

		// Only works for the Webscript Servlet Runtime

		if (!(req instanceof WebScriptServletRequest)) {
			throw new RuntimeException("Unexpected request type. Logout only works for Webclient authentication");
		}
		WebScriptServletRequest r = (WebScriptServletRequest) req;

		// invalidate the session
		r.getHttpServletRequest().getSession().invalidate();

		log.debug("Invalidating HTTP Session.");
		status.setRedirect(false);
		status.setCode(HttpServletResponse.SC_OK);

		return new HashMap<String, Object>();

	}

}

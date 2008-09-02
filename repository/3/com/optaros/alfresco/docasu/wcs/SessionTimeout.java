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

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.alfresco.web.scripts.DeclarativeWebScript;
import org.alfresco.web.scripts.WebScriptRequest;
import org.alfresco.web.scripts.servlet.WebScriptServletRequest;
import org.alfresco.web.scripts.Status;
import org.apache.commons.logging.LogFactory;

/**
 * Use this class to get session timeout interval.
 * 
 * @author Viorel Andronic
 * 
 */
public class SessionTimeout extends DeclarativeWebScript {
	private static final org.apache.commons.logging.Log log = LogFactory.getLog(SessionTimeout.class);

	public Map<String, Object> executeImpl(WebScriptRequest request, Status status) {
		// Only works for the Webscript Servlet Runtime
		if (!(request instanceof WebScriptServletRequest)) {
			throw new RuntimeException("Unexpected request type. SessionTimeout service only works for Webclient authentication");
		}
		WebScriptServletRequest wsRequest = (WebScriptServletRequest) request;

		// compute session timeout
		long lastAccessedTime = getLastAccessedTime(wsRequest.getHttpServletRequest().getSession());
		int maxInactiveInterval = wsRequest.getHttpServletRequest().getSession().getMaxInactiveInterval();
		int timeout = getSessionTimeout(lastAccessedTime, maxInactiveInterval);

		log.debug("session timeout = " + timeout);

		if (timeout == 1) {
			// session timed out - invalidate the session
			wsRequest.getHttpServletRequest().getSession().invalidate();
			log.debug("Session timed out. Invalidating HTTP Session.");
			status.setRedirect(false);
			status.setCode(HttpServletResponse.SC_OK);
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("timeout", "" + timeout);

		return result;
	}

	// this request should not influence last accessed time
	private long getLastAccessedTime(HttpSession session) {
		// last accessed time
		long lastAccessedTime = session.getLastAccessedTime();
		// last accessed time for this request
		Long sessionTimeoutRequestLastAccessedTime = (Long) session.getAttribute("str_lat");
		// last accessed time for any other request
		Long anotherRequestLastAccessedTime = (Long) session.getAttribute("ar_lat");
		if (sessionTimeoutRequestLastAccessedTime == null && anotherRequestLastAccessedTime == null) {
			// first request
			session.setAttribute("str_lat", new Long(new Date().getTime()));
			session.setAttribute("ar_lat", new Long(lastAccessedTime));
			return lastAccessedTime;
		}
		if (sessionTimeoutRequestLastAccessedTime != null && anotherRequestLastAccessedTime != null) {
			// any other request
			// if session.getLastAccessedTime() is 'close' to
			// sessionTimeoutRequestLastAccessedTime then consider it
			// sessionTimeoutRequestLastAccessedTime
			int acceptedDelay = (int) Math.abs(lastAccessedTime - sessionTimeoutRequestLastAccessedTime.longValue()); // milliseconds
			if (acceptedDelay < 1000) {
				// last accessed time COULD belong to this request
				session.setAttribute("str_lat", new Long(new Date().getTime()));
				return anotherRequestLastAccessedTime.longValue();
			} else {
				// last accessed time belongs to another request
				session.setAttribute("str_lat", new Long(new Date().getTime()));
				session.setAttribute("ar_lat", new Long(lastAccessedTime));
				return lastAccessedTime;
			}
		}
		// execution should never get to this point
		return lastAccessedTime;
	}

	private int getSessionTimeout(long lastAccessedTime, int maxInactiveInterval) {
		long currentTime = new Date().getTime(); // milliseconds
		int currentInterval = (int) (currentTime - lastAccessedTime) / 1000; // seconds
		int timeout = maxInactiveInterval - currentInterval; // seconds
		return timeout > 0 ? timeout : 1;
	}

}

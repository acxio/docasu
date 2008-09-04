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
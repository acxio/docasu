<#--

    Copyright (C) 2008 Optaros, Inc. All rights reserved.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
    
-->

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<title>DoCASU Web Client</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<script defer="defer" type="text/javascript">
			function getContextBase() {
				return "${url.context}";
			}
		</script>
		
		
		<!-- ExtJS Library and CSS files  -->
		<link rel="stylesheet" type="text/css" href="${url.context}/docasu/lib/extjs/resources/css/ext-all.css">
		<link rel="stylesheet" type="text/css" href="${url.context}/docasu/lib/extjs/resources/css/xtheme-gray.css">
		
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/extjs/adapter/ext/ext-base.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/extjs/ext-all.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/extjs-extensions/statictextfield.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/extjs/ux/miframe-min.js"></script>
		
		
		<!-- Ext.ux.UploadPanel and CSS files  -->
		<link rel="stylesheet" type="text/css" href="${url.context}/docasu/lib/Ext.ux.FileTree/css/filetree.css">
		<link rel="stylesheet" type="text/css" href="${url.context}/docasu/lib/Ext.ux.FileTree/css/filetype.css">
		<link rel="stylesheet" type="text/css" href="${url.context}/docasu/lib/Ext.ux.FileTree/css/icons.css">
		
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/Ext.ux.FileTree/js/Ext.ux.form.BrowseButton.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/Ext.ux.FileTree/js/Ext.ux.FileUploader.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/Ext.ux.FileTree/js/Ext.ux.UploadPanel.js"></script>
		
		
		<!-- DoCASU Library -->
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUUtils.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUSession.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUError.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUScriptLoader.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUPerspectiveManager.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUPlugin.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUComponent.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUApplication.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUApplicationManager.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUDataManager.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/lib/docasu/DoCASUActionManager.js"></script>
		
		
		<!-- Custom DoCASU Script and CSS files  -->
		<link rel="stylesheet" type="text/css" href="${url.context}/docasu/DoCASU.css">
		
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/DoCASU.js"></script>
		
		<!-- Perspectives -->
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/perspectives/DoCASUPerspective.js"></script>
		<script defer="defer" type="text/javascript" src="${url.context}/docasu/perspectives/DoCASUCategoriesPerspective.js"></script>	
		
		<!-- dinamically loaded source files go here -->
		
		
		
	</head>
	
	<body style="background: none !important">
		<input type="hidden" id="initialFolderId" value="${initialFolderId}" />
	</body>
</html>

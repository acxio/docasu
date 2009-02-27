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


// DoCASUActionManager

/* Ext.namespace will create these objects if they don't already exist */
Ext.namespace("DoCASU.App");


DoCASU.App.ActionManager = new Object({

	integerMax	:	9007199254740992, // hopefully the user clears cookies before this is reached

	getActions : function() {
		var actions = Ext.state.Manager.get("DoCASU.App.ActionManager.actions");
		if(!actions || actions == null) {
			actions = {};
			this.setActions(actions);
		}
		return actions;
	}, // eo getActions
	
	setActions : function(actions) {
		Ext.state.Manager.set("DoCASU.App.ActionManager.actions", actions);
	}, // eo setActions
	
	getActionCount : function(actionId) {
		var actions = this.getActions();
		var actionCount = actions[actionId];
		if(!actionCount || actionCount == null) {
			actionCount = 0;
			actions[actionId] = actionCount;
			this.setActions(actions);
		}
		return actionCount;
	}, // eo getActionCount
	
	setActionCount : function(actionId, actionCount) {
		var actions = this.getActions();
		actions[actionId] = actionCount;
		this.setActions(actions);
	}, // eo setActionCount
	
	registerAction : function(actionId) {
		var actionCount = this.getActionCount(actionId);
		this.setActionCount(actionId, ++actionCount);
	}, // eo registerAction
	
	/* get top n most used actions */
	getTopActions : function(n) {
		if(!n || n == null) {
			n = 5; // top 5 actions by default
		}
		var actions = this.getActions();
		if(n > actions.length) {
			n = actions.length; // if there are not n actions registered
		}
		var topActions = this.addNMax({}, n, integerMax);
		return topActions; // a map with action ids and action count
	}, // eo getTopActions
	
	/* add n actions to the result which have the count <= maxValue but allways pick the max count */
	addNMax : function(result, n, maxValue) {
		var actions = this.getActions();
		var maxAction = null;
		var localMax = 0;
		for(i in actions) {
			if(localMax < actions[i] && actions[i] <= maxValue) {
				// pick max count <= maxValue
				if(!result[i] || result[i] == null) {
					// ignore duplicate
					localMax = actions[i];
					maxAction = i;
				}
			}
		}
		// add max to result
		result[maxAction] = localMax;
		if(result.length < n) {
			return this.addNMax(result, n-1, localMax);
		} else {
			return result;
		}
	} // eo addNMax

}); // eo DoCASU.App.ActionManager

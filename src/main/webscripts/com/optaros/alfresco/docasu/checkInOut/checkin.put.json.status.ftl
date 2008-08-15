{
	"success": false,
	"msg"	 : "${status.message?j_string!""}",
	"status" :
	  {
	    "code" : ${status.code},
	    "name" : "${status.codeName}",
	    "description" : "${status.codeDescription}"
	  },
	  "message" : "${status.message?j_string!""}", 
	  "exception" : "<#if status.exception?exists>${status.exception.class.name?j_string}<#if status.exception.message?exists> - ${status.exception.message?j_string}</#if></#if>",
	  "server" : "Alfresco ${server.edition?xml} v${server.version?xml} schema ${server.schema?xml}",
	  "time" : "${date?datetime}"
}

{
	"success": false,
	"file"  : "json.status.ftl",
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


  "Caused by" : "<#if status.exception.cause?exists>${status.exception.cause}</#if>",
<@recursestack status.exception/>     
}

<#macro recursestack exception>
   <#if exception.cause?exists>
      <@recursestack exception=exception.cause/>
   </#if>
   <#if exception.cause?exists == false>
      <#list exception.stackTrace as element>
  "":"${element}",
      </#list>  
   <#else>
  "":"${exception.stackTrace[0]}",
   </#if>
</#macro>

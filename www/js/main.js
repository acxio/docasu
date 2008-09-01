

jQuery(document).ready(function($) {
 
  /* tab navigation */	
  $("a[rel*=tabs-menu]").each(function () {
  	  $(this).click(function(){
  	  	$("#tabs-content").html($("#load").html())
  	  	$.get(this.href, function(data) { 
  	  		$("#content3").html(data)
  	  	})
  	  	$(".active").removeClass("active").addClass("inactive")
  	  	$(".extra-large-active").removeClass("extra-large-active").addClass("inactive")
  	  	
	  	$(this).parents(".inactive:not(.extra-large)").removeClass("inactive").addClass("active")
	  	$(this).parents(".extra-large", ".inactive").removeClass("inactive").addClass("extra-large-active")

  	  	$(".active-tab-link").removeClass("active-tab-link").addClass("inactive-tab-link") 
  	  	$(this).removeClass("inactive-tab-link").addClass("active-tab-link")	 	
  	  	return false
  	  })
  })
  $("#tabs-content").html($("#load").html())
  $.get("productInfo.html", function(data) { 
	 $("#tabs-content").html(data)
  })
  
  
  /* demo screenshot using lightbox */
  $('a[rel*=lightbox]').lightbox(); 
  
  
  /* demo video */
  $('a[rel*=facebox]').facebox();

  /* FŸr Version mit Lightbox */
  /* $('.modal').lightbox(); */
 
})

  
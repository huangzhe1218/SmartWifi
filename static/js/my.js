$(document).ready(function(){ 

		   $.get('static/js/data.xml', function(d){   
			$(d).find('app').each(function(){   
						    var $app = $(this);     
						 var title = $app.find('title').text();   
							var val = $app.find('val').text();   
						    
						    if(val=="0"){  
   									$("#"+title).css('display','none');		
   									
    						}
			});
		})
	});  
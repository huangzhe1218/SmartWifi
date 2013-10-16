$(document).ready(function(){

//$(function(){
				
	$(".btn").click(function(){
				
              var pw=$("#input_password1").val();
			  //document.title = pw;
			  	
			  if (pw!="admin"){
			 
				 
				$(".errormsg").show();
				return false 
			  
			   
			    
			 }
    });
});
 

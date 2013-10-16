$( ".app3" ).click(function() {
bootbox.alert("请访问地址 http://192.168.42.1/remote", function() {

});
});
$( ".app4" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/4/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/4/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app5" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/5/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/5/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app6" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/6/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/6/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app7" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/7/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/7/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app8" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/8/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/8/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app9" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/9/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/9/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app10" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/10/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/10/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app11" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/11/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/11/0");  
    }
}, {
    "label" : "取消"
}]);
});
$( ".app12" ).click(function() {
	bootbox.dialog("应用配置", [{
    "label" : "安装",
    "class" : "btn-danger",
    "callback": function() {
        $.get("appstat/12/1");  
    }
}, {
    "label" : "卸载",
    "class" : "btn-inverse",
    "callback": function() {
       $.get("appstat/12/0");  
    }
}, {
    "label" : "取消"
}]);
});


					    var options = {};
	    var wizard = $("#some-wizard").wizard({buttons:{nextText:"前进",backText:"后退",submitText:"提交"}});
				$(".open-wizard").click(function() {
			wizard.show();
			});
			wizard.on("submit", function(wizard) {
				$.ajax({
		      url: "/getsongs",
		      type: "POST",
		      success: function(data) {
		    		wizard.trigger("success");
						wizard.hideButtons();
						wizard._submitting = false;
						wizard.showSubmitCard("success");
						
						for(var key in data){
							item ='<li>'+
              '<p>'+ data[key] +'</p>'+
            '</li>';
							$("#playlist").append(item);
						}
						
						
						
		      }
	 		 });
			
				wizard.el.find(".wizard-success .im-done").click(function() {
			wizard.reset().close();
		});
	
	wizard.el.find(".wizard-success .create-another-server").click(function() {
			wizard.reset();
		});
		
	});

$( "#readxml" ).click(function() {
			   $.get('static/js/data.xml', function(d){   
			$(d).find('app').each(function(){   
						    var $app = $(this);     
						 var title = $app.find('title').text();   
							var val = $app.find('val').text();   
						    if(val=="0"){  
   									$("#"+title).text("已关闭");		
   									
    						}else{
    								$("#"+title).text("已启动");		
    						}
			});
		})
});

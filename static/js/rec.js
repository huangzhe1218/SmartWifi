(function() {
    
var bar = $('.bar');
var percent = $('.percent');
var status = $('#status');
   
$('form').ajaxForm({
    beforeSend: function() {
        status.empty();
        var percentVal = '0%';
        bar.width(percentVal)
        percent.html(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        var percentVal = percentComplete + '%';
        bar.width(percentVal)
        percent.html(percentVal);
    },
    success: function(data,statusTex) {
        var percentVal = '100%';
        bar.width(percentVal)
        percent.html(percentVal);
        
        if(data.face.length!=0){
        	
        	var name1 = data.face[0].candidate[0].confidence
        	var name2 =  data.face[0].candidate[1].confidence
        	
        	if( name1>15 && name2<15 && name1-name2>5 ){
        	
        	var name = data.face[0].candidate[0].person_name
        	status.html("<h3>识别成功，您的用户名为: "+name+"</h3>");
        	
        	}
        	else{
        			status.html("<h3>没有您的数据，更换一张照片试试</h3>")
        	}
        	
        }else{
        		status.html("<h3>没有检测到人脸，更换一张照片试试</h3>")
        }

    }
}); 

})();     


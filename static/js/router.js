//$.ajaxSettings.async = false;
$(function(){
	init_guide();
	
	
	addImg();
	//getPassport();
	getWifiInfo();
	getWanInfo();
	getLanInfo();
	getDeviceInfo();
addImg();
	check_upgrade();
	//setTimeout("check_network_status()",5000);
});

function init_guide(){
	
}

//通用提示，重启并自动连接的。
//return_ip 修改 lan ip 的时候用用于重置 ip
function global_dorestart(action_cont,return_ip,need_flash){
	if (typeof(return_ip)=="string") {
		var ip = return_ip;
	} else {
		var ip = global_lan_ipv4;
		if(ip==""){
			ip = window.location.host;
		}
	};
	var time_ts = (+new Date());
	
	art.dialog({id:"wating_box",icon:"wait",title:false,content:action_cont+'，等待自动连接跳转...'}).lock();
	
	//为等待彻底关闭服务，10秒后再开始自动检测
	setTimeout(function(){
		autoLink("http://"+ip+"/turbo-static/turbo/web/images/logo_130726.png",{
			"success":function(){
				if(art && art.dialog.list['wating_box']){
					art.dialog.list['wating_box'].close();
				}
				art.dialog({icon:"succeed",id:"wating_box",title:false,content:'操作生效,重启成功！'}).lock().time(4);
				if(need_flash){
					window.setTimeout('window.location.href="http://'+ip+'";',3000); 
				}
			},"error":function(){
				//error	
				var usetime = Math.round(((+new Date()) - time_ts)/1000);
				art.dialog.list['wating_box'].content(action_cont+", 等待自动跳转... 用时"+usetime+i18_second);

			},"timeout":function(){
				if(art && art.dialog.list['wating_box']){
					art.dialog.list['wating_box'].close();
				}
				art.dialog({icon:"warning",id:"wating_box",title:false,content:'自动连接HIWIFI路由器失败，请检查无线或者网线是否连接正确。',
				ok:function(){
					top.location.href = 'http://'+ip+URL_ROOT_PATH;
				},
				okVal: "手动连接", 
				cancel: function(){
			        this.close();
			        return false;
			    }
				}).lock();
			}},150);
	},15000);
}

function getPassport(){
	//passport/user 
	$.getJSON("/cgi-bin/turbo/;stok=1fd7907b5167ff3f64364e6b64315aa3/api/passport/user",{},function(rsp) 
	{ 

	 if(rsp.username){
		 $("#pass").show();
		 $("#pass span").html(rsp.username + "已经绑定");
	 } else {
		 $("#pass").hide();
	 };
	});
}

function getWifiInfo(){
	//取最后一个
	//wifi/get_status_list 
	var request_date = {}; 
	if(global_wifi_status=='1'){	
			if(global_wifi_encryption=='none'){
				var msgs = "无线网未设置密码，有被他人盗用的风险，请关闭无线网，或设置密码。";
				$("#wifi-alert").show().attr("title",msgs);
			}
	}else{
		var msgs = "WIFI 未开启";
		$("#wifi-alert").show().attr("title",msgs);
	}
}

function reboot(){
	//system/reboot 

}
var light_lan_timer = [0,0,0]
function getLanInfo(){
	//network/get_lan_info 
	$.getJSON("/cgi-bin/turbo/;stok=1fd7907b5167ff3f64364e6b64315aa3/api/network/get_lan_info",{},function(rsp) 
	{ 
		if(rsp.code == 0){
			if(rsp.ipv6 && rsp.ipv6[0]){
				global_lan_ipv6 = rsp.ipv6[0].ip;
				global_lan_ipv6_mask = rsp.ipv6[0].mask;
			}
			if(rsp.ipv6 && rsp.ipv4[0]){
				global_lan_ipv4 = rsp.ipv4[0].ip;
				global_lan_ipv4_mask = rsp.ipv4[0].mask;
			}
			if(rsp.mac){
				global_lan_mac = rsp.mac 
			}
			for(var i in rsp.is_lan_link){
			//i 为索引数字
				var lan_index = i.substr(4,1);
				var lan_status = rsp.is_lan_link[i];
				if(lan_status == 1){
					light_lan_timer[lan_index] = setInterval("light_flash('"+lan_index+"');",500);
				}
			}
		}
	})
}

function light_flash(index){
	if($("#lan"+index).hasClass("lightning")){
		$("#lan"+index).removeClass("lightning");
	} else {
		$("#lan"+index).addClass("lightning");
	}
}

function getDeviceInfo(){
	//wifi/get_connected_devices_list 
	$.getJSON("/cgi-bin/turbo/;stok=1fd7907b5167ff3f64364e6b64315aa3/api/network/device_list",{},function(rsp) 
	{ 
		if(rsp.code == 0){
			set_devices_cnt(rsp.devices.length);
		}
	});
}



function addImg() 
{ 
	var s=new Date();
 	var ss = s.toLocaleTimeString()
	var url="http://www.baidu.com/img/bdlogo.gif?rand="+ss;
  var Img = new Image(); 
Img.src =url;
Img.style.display = "none";
Img.onload = function () 
{ 
	suc();
} 
Img.onerror =function(){	
	err();
  	} 
} 

function suc(){
 // alert("正常！")
  $("#set_network").addClass("ok");
  $("#network-alert").hide().attr("title","");
  }
function err(){
 // alert("错误！")
  $("#set_network").removeClass("ok");
  $("#network-alert").show().attr("title",msgs);
  }

function getWanInfo(){
	var is_conn_now = false;
	var msgs="";
	
	//联通正常检查
	/*
	if (!is_conn_now){
		msgs = msgs+"未连通互联网 请检查线路, 或者核对 pppoe 用户名密码";
		$("#network-alert").show().attr("title",msgs);
		$("#set_network").removeClass("ok");
		$(".stream").hide();
	}else{
		$("#network-alert").hide().attr("title","");
		$("#set_network").addClass("ok");
		$(".stream").show();
	}
	*/
	check_wan_info();
}

function check_wan_info(){
	//network/get_wan_info 
	$.getJSON("/cgi-bin/turbo/;stok=1fd7907b5167ff3f64364e6b64315aa3/api/network/get_wan_info",{},function(rsp) 
	{
		if(rsp.code != 0){
			return;
		}

		if (rsp.macaddr && rsp.macaddr != ""){
			global_wan_mac = rsp.macaddr.toUpperCase();
		}else if(rsp.mac && rsp.mac!=""){
			global_wan_mac =rsp.mac.toUpperCase();
		}
		
		//alert(global_wan_mac);
	
		var global_wan_type_tmp = rsp.type.toUpperCase();
		
		$.getJSON("4006024680.com/cgi-bin/turbo/admin_web/cgi-bin/turbo/;stok=1fd7907b5167ff3f64364e6b64315aa3/api/wifi/get_bridge",{},function(rsp) 
		{ 
			if(rsp.status == 1){
				global_wan_type = "无线中继 DHCP";
			} else {
				global_wan_type = global_wan_type_tmp
			}
		})
	
		if(rsp.ipv4 && rsp.ipv4[0] && rsp.ipv4[0].ip){
			global_wan_ipv4 = rsp.ipv4[0].ip;
			global_wan_ipv4_mask = rsp.ipv4[0].mask;
		}
		if(rsp.ipv6){
			for (var i=0;i<rsp.ipv6.length;i++){
				if(rsp.ipv6[i].type == 'Global'){
					global_wan_ipv6 = rsp.ipv6[i].ip;
					global_wan_ipv6_mask = rsp.ipv6[i].mask;
				}
			}
		}
		
		addImg();
		/*
		if(rsp.is_eth_link == 0){
			msgs = "WAN 未连接网线或断开连接";
			$("#network-alert").show().attr("title",msgs);
			$("#set_network").removeClass("ok");
			$(".stream").hide();
		}*/
	});
}
setInterval(addImg, 1000);
//刷新检查更新
function check_upgrade(){
	var msgs = new Array();
	var request_date = {}; 
	$.getJSON("/cgi-bin/turbo/;stok=1fd7907b5167ff3f64364e6b64315aa3/api/system/upgrade_check",request_date,function(rsp) 
	{ 
		global_upgrade_info = rsp;

		//$("#loading3").hide();
		if (rsp.need_upgrade == 1){
			msgs[0] = "有可用更新";
		}
		if (msgs.length>0) {
			$("#system-alert").show().attr("title",msgs);
		} else {
			$("#system-alert").hide().attr("title","");
		}
	})
}

//检查网络状态
/*
function check_network_status(){
	$.ajax({
		  url: "/cgi-bin/turbo/;stok=1fd7907b5167ff3f64364e6b64315aa3/api/system/check_network_connect",
		  cache: false,
		  dataType: "json",
		  success: function(rsp){
			  if(rsp){
				set_wan_status(rsp.isconn);
				set_lan_status(1,rsp.isconn_lan1);
				set_lan_status(2,rsp.isconn_lan2);
				set_devices_cnt(rsp.devices_cnt);
				
				if(rsp.wifi_status=='1'){	
					if(rsp.wifi_encryption=='none'){
						var msgs = "无线网未设置密码，有被他人盗用的风险，请关闭无线网，或设置密码。";
						$("#wifi-alert").show().attr("title",msgs);
					} else {
						$("#wifi-alert").hide().attr("title","");
					}
				}else{
					var msgs = "WIFI 未开启";
					$("#wifi-alert").show().attr("title",msgs);
				}
			  }
			  setTimeout("check_network_status()",5000);
		  },
		  error :function(){
			  if (art.dialog.list['func_box'] || art.dialog.list['wating_box']){
				  setTimeout("check_network_status()",1000*10);
			  }else{
				  art.dialog({
						title:false,
					    content: '无法连接到路由器，请检查网络连接情况！',
					    icon: 'warning',
					    ok: function(){
					    	top.location.reload();
					        return false;
					    },
					    okVal: "刷新页面 ", 
					    cancel: function(){
					        this.close();
					        return false;
					    }
					}).lock();
			  }
		  }
	});
}
*/

addImg();
/*
function set_wan_status(isconn){
	var wan_now_status = $("#network-alert").attr("title")=="";
	if(wan_now_status==isconn){
		return;
	}
	if(isconn){
		$("#network-alert").hide().attr("title","");
		$("#set_network").addClass("ok");
		$(".stream").show();
	}else{
		$("#network-alert").show().attr("title","WAN 未连接网线或断开连接");
		$("#set_network").removeClass("ok");
		$(".stream").hide();
	}
}*/
function set_lan_status(lan_index,isconn){
	if(isconn){
		if(light_lan_timer[lan_index] && light_lan_timer[lan_index]>0 ){
			return;	
		}else{
			light_lan_timer[lan_index] = setInterval("light_flash('"+lan_index+"');",500);
		}
	}else{
		if(light_lan_timer[lan_index]>0){
			clearInterval(light_lan_timer[lan_index]);
			$("#lan"+lan_index).removeClass("lightning");
			light_lan_timer[lan_index] = 0;
		}
		
	}
}

function set_devices_cnt(devices_cnt){
	if(devices_cnt >0 ){
		$("#devices em").html(devices_cnt);
		$("#devices_loading").hide();
	} else {
		$("#devices em").html(0);
	}
}

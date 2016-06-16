<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta HTTP-EQUIV="pragma" CONTENT="no-cache">
<meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate">
<meta HTTP-EQUIV="expires" CONTENT="0">
<title>App下载</title>
</head>
<body style="width: 100%;">
		<img id="tip"  alt="" src="/img/winxin_tip.png" style="display: none;max-width:100%;height:auto;">
</body>
<script type="text/javascript" src="js/vendor/jquery-1.10.1.min.js"></script>
<script>
	
	//判断是不是用微信中的浏览器打开的
	function isWeixin(){
	    var ua = navigator.userAgent.toLowerCase();  
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
	        return true;  
	    } else {  
	        return false;  
	    }  
	}  
	
	(function initPage(){
		if(isWeixin()){
			$("#tip").css("display", "block");
		} else {
			location.href = "${url }";
		}
	})();

	
</script>
</html>

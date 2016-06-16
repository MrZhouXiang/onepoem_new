<!-- 首页 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>一首小诗</title>
<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<link rel="stylesheet" type="text/css"
	href="lib/bootstrap/css/bootstrap.css">
<link rel="stylesheet" type="text/css"
	href="lib/bootstrap/css/bootstrap-responsive.css">
<link rel="stylesheet" type="text/css" href="stylesheets/theme.css">
<link rel="stylesheet" href="lib/font-awesome/css/font-awesome.css">

<script src="lib/jquery-1.8.1.min.js" type="text/javascript"></script>
<script src="lib/jquery.cookie.js" type="text/javascript"></script>
<!-- Demo page code -->

<style type="text/css">
#line-chart {
	height: 300px;
	width: 800px;
	margin: 0px auto;
	margin-top: 1em;
}

.brand {
	font-family: georgia, serif;
}

.brand .first {
	color: #ccc;
	font-style: italic;
}

.brand .second {
	color: #fff;
	font-weight: bold;
}
</style>

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

<!-- Le fav and touch icons -->
<link rel="shortcut icon" href="../assets/ico/favicon.ico">
<link rel="apple-touch-icon-precomposed" sizes="144x144"
	href="../assets/ico/apple-touch-icon-144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114"
	href="../assets/ico/apple-touch-icon-114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72"
	href="../assets/ico/apple-touch-icon-72-precomposed.png">
<link rel="apple-touch-icon-precomposed"
	href="../assets/ico/apple-touch-icon-57-precomposed.png">
</head>
<script type="text/javascript" src="js/vendor/jQuery.md5.js"></script>
<!--[if lt IE 7 ]> <body class="ie ie6"> <![endif]-->
<!--[if IE 7 ]> <body class="ie ie7"> <![endif]-->
<!--[if IE 8 ]> <body class="ie ie8"> <![endif]-->
<!--[if IE 9 ]> <body class="ie ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<script>
	var nameCo = 'username';
	var pwdCo = 'passWord';
	$(function() {
		$('#passWord').bind('keypress', function(event) {
			if (event.keyCode == "13") {
				login_btn();
			}
		});
	});
	function login_btn() {
		var usernameVar = $("#userName").val();
		var password = $("#passWord").val();
		var passwordVar = $.md5(password);
		if (usernameVar == "" || passwordVar == "") {
			layer.msg("请勿提交空值",2,{type : 1,shade : false});

		} else {
			if ($("#readerpw").attr("checked")) {
				$.cookie(nameCo, usernameVar, {
					path : '/',
					expires : 10
				});

			} else {
				$.cookie(nameCo, null, {
					path : '/'
				}); //删除cookie

			}
			$.ajax({
				url : "doLogin",
				data : {
					name : usernameVar,
					password : passwordVar
				},
				dataType : "json",
				type : "post",
				success : function(data) {
					if (data.success) {
						console.log(data);
						location.href = "orderManage.jsp";
					} else {
						layer.msg("用户名或密码错误, 请重新输入",2,{type : 1,shade : false});
					}
				},
				error : function(msg) {
					layer.msg("服务器链接失败, 请稍后提交",2,{type : 1,shade : false});
				}

			});
		}
	}

	$(function() {
		var tempName = $.cookie(nameCo);

		if ($.cookie(nameCo)) {
			$("#userName").val(tempName);

			$("#readerpw").attr("checked", "checked");
		} else {

		}

	});
</script>
<body>
	<!--<![endif]-->

	<div class="navbar">
		<div class="navbar-inner">
			<div class="container-fluid">
				<ul class="nav pull-right">

				</ul>
				<a class="brand" href="index.html"><span class="first">一首小诗</span>
					<span class="second">公司</span></a>
			</div>
		</div>
	</div>


	<div class="container-fluid">

		<div class="row-fluid">
			<div class="dialog span4">
				<div class="block">
					<div class="block-heading">登录</div>
					<div class="block-body">
						<form>
							<label>用户名:</label> <input id="userName" type="text" value=""
								class="span12"> <label>密码</label> <input id="passWord"
								value="" type="password" class="span12"> <a href="#"
								class="btn btn-primary pull-right"
								onclick="javascript:login_btn();">登录</a> <label
								class="remember-me"><input id="readerpw" type="checkbox">
								记住账号</label>
							<div class="clearfix"></div>
						</form>
					</div>
				</div>
				<!--         <p class="pull-right" style=""><a href="#" target="blank">Theme by Portnine</a></p> -->

				<p></p>
			</div>
		</div>
		</div>

		<!-- Le javascript
    ================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script src="lib/bootstrap/js/bootstrap.js"></script>
		<script src="js/layer/layer.min.js"></script>
</body>
</html>
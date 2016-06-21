<!-- 新增用户 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>新增用户</title>
<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<link rel="stylesheet" type="text/css"
	href="lib/bootstrap/css/bootstrap.css">
<link rel="stylesheet" href="css/base.css" />
<link rel="stylesheet" href="css/admin.css" />
<link rel="stylesheet" href="css/jquery.fileupload.css" />
<link rel="stylesheet" href="css/jquery.fileupload-ui.css" />
<link rel="stylesheet" href="css/lightbox.css" />
<link rel="stylesheet" type="text/css" href="stylesheets/theme.css">
<link rel="stylesheet" href="lib/font-awesome/css/font-awesome.css">

<script src="lib/jquery-1.8.1.min.js" type="text/javascript"></script>

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
      <script src="javascripts/html5.js"></script>
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

<!--[if lt IE 7 ]> <body class="ie ie6"> <![endif]-->
<!--[if IE 7 ]> <body class="ie ie7"> <![endif]-->
<!--[if IE 8 ]> <body class="ie ie8"> <![endif]-->
<!--[if IE 9 ]> <body class="ie ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->

<script type="text/javascript">
	var idVar;
	var dynasty_id;

	
	var gradeArray = new Array();
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}
	
	function loadPage() {
		idVar = Number(getQueryString("id"));
		dynasty_id= Number(getQueryString("dynasty_id"));
		
		//获取详情
		$.ajax({
			url : "webctrl/getUser",
			dataType : "json",
			type : "post",
			data:{
				id : idVar,
	        },
			success : function(data) {
				$("#name").val(data.pen_name);
				$("#email").val(data.email);
				$("#money").val(data.money);
				$("#tel").val(data.tel);
				
				var path = "../../res/assets/img/avatar/"+data.url;
	            $("#front_files").find("img").attr("src",path).show();
	            $("#front_files").find("a").attr("href",path).show();
	            $("#front_files").find("i").hide();
	            $("#front_fileName").val(data.url); //隐藏域
			}
		});
		
	}
	
	//注册函数
	$(function() {
        var front_obj = {
                fileInput:$("#front_fileupload"),
                context:$("#front_files"),
                hiddenInput:$("#front_fileName"),
                progress:'front_progress'
            };
            infoUpload(front_obj); 
            addModel();
            delModel();
	});
	
	/**
	 * 新增模板
	 */
	function addModel(){
			$("#save").on("click",function(){
				var name = $("#name").val();
				var email = $("#email").val();
				var money = $("#money").val();
				var tel = $("#tel").val();
				if(name === ""){
	        		layer.msg("请输入诗人姓名",2,{type : 1,shade : false});
	        		$("#name").focus();
	        		return false;
	        	}
				
				if(tel === ""){
	        		layer.msg("请输入电话",2,{type : 1,shade : false});
	        		$("#tel").focus();
	        		return false;
				}
				if(money === ""){
	        		layer.msg("请输入墨汁",2,{type : 1,shade : false});
	        		$("#money").focus();
	        		return false;
				}
	        	if(email === ""){
	        		layer.msg("请输入简介",2,{type : 1,shade : false});
	        		$("#email").focus();
	        		return false;
	        	}
	        	if($("#front_fileName").val() === ""){
	        		layer.msg("请上传图片",2,{type : 1,shade : false});
	        		$('#front_fileupload').focus();
	        		return false;
	        	}
	        	
				var photoNameStr = $("#front_fileName").val();
	            $.ajax({
	                url:"webctrl/addUser",
	                type:"POST",
	                dataType:"json",
	                data:{
	                	pen_name : name,
	                	email : email,
	                	tel: tel,
	                	money : money,
	                	url : photoNameStr,
	                	id : idVar
	                },
	                success:function(data){
	                    if (data.success) {
	                    	layer.msg("保存成功",2,{type:1,shade:false});
	                    	javascript:history.go(-1);
						}
	            	}
	            });
	        });
        
	}
	/**
	 * 删除
	 */
	function delModel(){
			$("#delete").on("click",function(){
				if (confirm("你是否确定删除该记录?")) {
					$.ajax({
						url : "webctrl/deleteOneAuthor",
						data : {
							id : idVar,
							staus : 6004
						},
						dataType : "json",
						type : "post",
						success : function(data) {
							if (data.code = 2000) {
								alert("删除成功.");
		                    	javascript:history.go(-1);
							} else {
								alert("删除失败,请重新尝试.");
							}
						}
					});
				}
	        });
        
	}
	/**
	 * 封面上传
	 *   var obj = {
	 *       fileInput:"",
	 *       context:"",
	 *       hiddenInput:"", //文件名隐藏域
	 *       progress:  //进度条
	 *       uploaddone:
	 *   }
	 */
	function infoUpload(obj){

	    var upload = obj.fileInput; //$('#fileupload');
	    upload.fileupload({
	        dataType: 'json',
	        add: function (e, data) {
	        	   var filepath = data.fileInput.context.value;
	        	   var extStart= filepath.lastIndexOf(".");
	               var ext=filepath.substring(extStart,filepath.length).toUpperCase();
	               if(ext!=".GIF"&&ext!=".JPG"){//ext!=".PNG"&&
	                layer.msg("图片限于jpg,gif格式");
	                return false;
	               }
	            data.context = obj.context; //$("#files");
	            data.submit();
	        },
	        done: function (e, data) {

	            var path = data.result.filePath;
	            data.context.find("img").attr("src",path).show();
	            data.context.find("a").attr("href",path).show();
	            data.context.find("i").hide();
	            obj.hiddenInput.val(data.result.fileName); //隐藏域

	        },
	        progressall: function (e, data) {
	            var progress = parseInt(data.loaded / data.total * 100, 10);

	            $("#"+obj.progress+" .progress-bar").css(
	                'width',
	                progress + '%'
	            );
	        },
	        start:function(e){
	            $("#"+obj.progress).removeClass("hide");
	            if(typeof (obj.uploaddone) !== "undefined"){
	                (obj.uploaddone)();
	            }
	        },
	        stop:function(e){
	            setTimeout(function(){$("#"+obj.progress).addClass('hide');},1000);
	        }

	    });
	}
</script>
<body onload="loadPage()">
	<!--<![endif]-->
	<jsp:include page="/head.jsp"></jsp:include>
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span2">
				<jsp:include page="/left.jsp"></jsp:include>
			</div>
			<div class="span10">
				<h2>新增用户</h2>
				<div class="well">
					<div id="myTabContent" class="tab-content">
						<div class="row-fluid">
							<div class="span12">
								<div class="row-fluid">
									<div class="span4">
										<form class="form-horizontal" id="adsForm">
											<div class="form-group">
												<label class="col-sm-2 control-label" for="name">姓名</label>
												<div class="col-sm-10">
													<input type="text" class="form-control" id="name"
														name="name"> <span class="help-block"></span>
												</div>
											</div>
											<div class="form-group">
												<label class="col-sm-2 control-label" for="tel">电话</label>
												<div class="col-sm-10">
													<input type="text" class="form-control" id="tel" name="tel">
													<span class="help-block"></span>
												</div>
											</div>
											<div class="form-group">
												<label class="col-sm-2 control-label" for="money">墨汁余额</label>
												<div class="col-sm-10">
													<input type="text" class="form-control" id="money"
														name="money"> <span class="help-block"></span>
												</div>
											</div>
											<div class="form-group">
												<label class="col-sm-2 control-label" for="email">邮箱</label>
												<div class="col-sm-10">
													<textarea class="form-control" id="email" name="email"
														rows="3"></textarea>
													<span class="help-block"></span>
												</div>
											</div>

											<div class="form-group">
												<div class="col-sm-6">
													<button class="btn btn-success fileinput-button"
														type="button">
														<i class="glyphicon glyphicon-upload"></i> <span>选择图片</span>
														<input id="front_fileupload" type="file" name="files[]"
															data-url="controller/upload/1" accept=".jpg,.png,.gif">
														<input type="hidden" id="front_fileName" /> <input
															type="hidden" id="front_type" value="zhengmian" />
													</button>
													<span class="help-block"></span>
													<!-- The global progress bar -->
													<div id="front_progress" class="progress hide">
														<div class="progress-bar progress-bar-success"
															style="width: 0;"></div>
													</div>
													<!-- The container for the uploaded files -->
													<!-- preview -->
													<div class="cover_wrp" id="front_files">
														<a class="example-image-link" href="" data-lightbox="1"><img
															class="cover default" src="" alt="图片预览" /> </a>
														<!-- <i
															class="cover default">图片预览</i> -->
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="btn-toolbar">
					<button class="btn btn-primary" id="save">保存</button>
				</div>
			</div>
		</div>
	</div>




	<!-- Le javascript
    ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="js/vendor/jquery.ui.widget.js"></script>
	<script src="js/vendor/load-image.min.js"></script>
	<script src="js/vendor/canvas-to-blob.min.js"></script>

	<script src="js/vendor/jquery.iframe-transport.js"></script>
	<script src="js/vendor/jquery.fileupload.js"></script>
	<script src="js/vendor/jquery.fileupload-process.js"></script>
	<script src="js/vendor/jquery.fileupload-image.js"></script>
	<script src="js/vendor/jquery.fileupload-validate.js"></script>
	<script src="js/vendor/icheck/icheck.min.js"></script>
	<script src="js/vendor/jquery.validate.min.js"></script>
	<script src="js/vendor/jquery.validate.message_cn.js"></script>

	<script src="js/vendor/bootstrap.min.js"></script>
	<script src="js/vendor/bootstrap-paginator.min.js"></script>
	<script src="js/vendor/lightbox-2.6.min.js"></script>

	<script src="js/layer/layer.min.js"></script>
</body>
</html>

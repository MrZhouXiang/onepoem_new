<!-- 新增诗人 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>添加诗人</title>
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
			url : "webctrl/getAuthor",
			dataType : "json",
			type : "post",
			data:{
				id : idVar,
	        },
			success : function(data) {
				$("#title").val(data.name);
				$("#content").val(data.introduce);
				$("#style").val(data.style);
				var path = "../../res/assets/img/author/"+data.url;
	            $("#front_files").find("img").attr("src",path).show();
	            $("#front_files").find("a").attr("href",path).show();
	            $("#front_files").find("i").hide();
	            $("#front_fileName").val(data.url); //隐藏域
			}
		});
		
		
		$.ajax({
			url : "webctrl/getDynastyList",
			dataType : "json",
			type : "post",
			data:{
				id : 1,
				size : 10,
	        },
			success : function(data) {
				$("#made_type").empty();
					for (var i = 0; i < data.length; i++) {
						gradeArray[i] = data[i].id;
						var selected= "";
						if(data[i].id==dynasty_id){
							selected= "selected";
						}
						$("#made_type").append(
								"<option "+selected+" value='"+data[i].id+"'>"
										+ data[i].name + "</option>");
										}
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
	});
	
	/**
	 * 新增模板
	 */
	function addModel(){
			$("#save").on("click",function(){
				var title = $("#title").val();
				var content = $("#content").val();
				var style = $("#style").val();
				if(title === ""){
	        		layer.msg("请输入诗人姓名",2,{type : 1,shade : false});
	        		$("#title").focus();
	        		return false;
	        	}
				if(style === ""){
	        		layer.msg("请输入字号",2,{type : 1,shade : false});
	        		$("#style").focus();
	        		return false;
				}
	        	if(content === ""){
	        		layer.msg("请输入简介",2,{type : 1,shade : false});
	        		$("#content").focus();
	        		return false;
	        	}
	        	if($("#front_fileName").val() === ""){
	        		layer.msg("请上传图片",2,{type : 1,shade : false});
	        		$('#front_fileupload').focus();
	        		return false;
	        	}
	        	
				var photoNameStr = $("#front_fileName").val();
	            $.ajax({
	                url:"webctrl/updateAuthor",
	                type:"POST",
	                dataType:"json",
	                data:{
	                	dynasty_id : $("#made_type").find("option:selected").val(),
	                	dynasty : $("#made_type").find("option:selected").text(),
	                	name : title,
	                	style : style,
	                	introduce : content,
	                	url : photoNameStr,
	                	id : idVar
	                },
	                success:function(data){
	                    if (data.success) {
	                    	layer.msg("保存成功",2,{type:1,shade:false});
	                    }
	            	}
	            });
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
				<h2>添加诗人</h2>
				<div class="well">
					<div id="myTabContent" class="tab-content">
						<div class="row-fluid">
							<div class="span12">
								<div class="row-fluid">
									<div class="span4">
										<form class="form-horizontal" id="adsForm">
											<div class="form-group">
												<label class="col-sm-2 control-label" for="made_type">朝代</label>
												<div class="col-sm-10">
													<select id="made_type"></select><span class="help-block"></span>
												</div>
											</div>
											<div class="form-group">
												<label class="col-sm-2 control-label" for="title">姓名</label>
												<div class="col-sm-10">
													<input type="text" class="form-control" id="title"
														name="title"> <span class="help-block"></span>
												</div>
											</div>
											<div class="form-group">
												<label class="col-sm-2 control-label" for="">字号</label>
												<div class="col-sm-10">
													<input type="text" class="form-control" id="style" name="">
													<span class="help-block"></span>
												</div>
											</div>
											<div class="form-group">
												<label class="col-sm-2 control-label" for="content">简介</label>
												<div class="col-sm-10">
													<textarea class="form-control" id="content" name="content"
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
															data-url="controller/upload/9" accept=".jpg,.png,.gif">
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
					<button class="btn btn-primary" id="save" style="float: right;">保存</button>
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

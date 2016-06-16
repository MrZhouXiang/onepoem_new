<!--成衣秀详情界面-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
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
	function logout() {
		$.ajax({
			url : "admin/logout",
			dataType : "json",
			type : "post",
			success : function(data) {
				console.log(data);
			}
		});
	}
	var tempSession = '${sessionScope.userSessionInfo.name}';
	$(function() {
		if (tempSession == null || tempSession == "") {
			location.href = "403.html";
		} else {
		}
	});
	var idVar;
	var gradeArray = new Array();
	var idStatusVar = 0;
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}

	function loadPage() {
		idVar = Number(getQueryString("id"));
		$("#soldOutBtn").text("下架");
		$.ajax({
			url : "check/getMadeTypeList",
			dataType : "json",
			type : "post",
			success : function(data) {
				if (data.success) {
					$("#made_type").empty();
					for (var i = 0; i < data.result.length; i++) {
						gradeArray[i] = data.result[i].id;
						$("#made_type").append(
								"<option value='"+data.result[i].id+"'>"
										+ data.result[i].name + "</option>");
					}
				} else {
				}
			}
		});
		$
				.ajax({
					url : "check/getClothesDetail",
					data : {
						id : idVar
					},
					dataType : "json",
					type : "post",
					success : function(data) {
						if (data.success) {
							var tempStatus = data.result.zhizuolx;
							var selectStatus = document
									.getElementById("made_type");
							for (var i = 0; i < selectStatus.options.length; i++) {
								if (selectStatus.options[i].value == tempStatus) {
									selectStatus.options[i].selected = true;
									break;
								}
							}
							$("#goods_name").val(data.result.mingcheng);
							$("#price").val(data.result.jiage);
							$("#size").val(data.result.chima);
							$("#height").val(data.result.shengao);
							$("#weight").val(data.result.tizhong);
							$("#waist").val(data.result.yaowei);
							$("#hip").val(data.result.tunwei);
							$("#size_desc").val(data.result.miaoshu);
							$("#is_public").val(
									data.result.isgongkai == "0" ? "否" : "是");
							idStatusVar = data.result.isxiajia;
							if (idStatusVar == "0") {
								$("#status").val("正常");
							} else {
								idStatusVar = 1;
								$("#status").val("已下架");
								$("#soldOutBtn").text("上架");
							}
							$("#praise_count").val(data.result.zanct);
							$("#create_date").val(data.result.rukusj);
							$("#color_name").val(data.result.yansemc);
							$("#goods_desc").val(data.result.shangpinms);
							$("#publisher").val(data.result.username);
							$("#photo_form").empty();
							$("#photo_form").append("<label>相关图片</label>");
							for (var i = 0; i < data.result.url_list.length; i++) {
								$("#photo_form")
										.append(
												"	<p>"
														+ data.result.url_list[i].tupianMc
														+ "       上传时间为："
														+ data.result.url_list[i].ruKuSj
														+ "</p><a href='"+data.result.url_list[i].url+"' target='_blank'><img width='200' height='200' src='"
								+data.result.url_list[i].url+"' align='middle''></a>");
							}
						} else {
							layer.msg("页面读取错误, 请重新刷新页面",2,{type : 1,shade : false});
						}
					}
				});
	}
	function getDate(tm) {
		return new Date(parseInt(tm)).toLocaleString();
	}
	function modifyMadeType() {
		if (confirm("你是否需要保存?")) {
			$.ajax({
				url : "check/modifyMadeType",
				data : {
					id : idVar,
					type : $("#made_type").val()
				},
				dataType : "json",
				type : "post",
				success : function(data) {
					if (data.success) {
						layer.msg("保存成功",2,{type : 1,shade : false});
					} else {
						layer.msg("保存失败, 请重新尝试",2,{type : 1,shade : false});
					}
				}
			});
		}
	}
	function soldOut() {
		$.ajax({
			url : "check/updateClothesStatus",
			data : {
				id : idVar,
				status : 0
			},
			dataType : "json",
			type : "post",
			success : function(data) {
				if (data.success) {
					layer.msg("下架成功",2,{type : 1,shade : false});
					loadPage();
				} else {
					layer.msg("下架失败, 请重新尝试",2,{type : 1,shade : false});
				}
			}
		});
	}
	function soldOutOrActive() {

		if (idStatusVar == 1) {
			$.ajax({
				url : "check/updateClothesStatus",
				data : {
					id : idVar,
					status : 1
				},
				dataType : "json",
				type : "post",
				success : function(data) {
					if (data.success) {
						layer.msg("上架成功",2,{type : 1,shade : false});
						loadPage();
					} else {
						layer.msg("上架失败, 请重新尝试",2,{type : 1,shade : false});
					}
				}
			});
		} else {
			$('#myModal').modal('show');
		}

	}
</script>
<body onload="loadPage()">
	<!--<![endif]-->

	<div class="navbar">
		<div class="navbar-inner">
			<div class="container-fluid">
				<ul class="nav pull-right">

					<li id="fat-menu" class="dropdown"><a href="#" id="drop3"
						role="button" class="dropdown-toggle" data-toggle="dropdown">
							<i class="icon-user"></i> ${sessionScope.userSessionInfo.name} <i
							class="icon-caret-down"></i>
					</a>
						<ul class="dropdown-menu">
							<li><a tabindex="-1" href="admin/logout">退出</a></li>
						</ul></li>
				</ul>
				<a class="brand" href="index.jsp"><span class="first">一首小诗</span>
					<span class="second">首页</span></a>
			</div>
		</div>
	</div>
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span2">
				<jsp:include page="/left.jsp"></jsp:include>
			</div>
			<div class="span10">
				<h2>
					成衣秀详情<a href="javascript:history.go(-1);"
						style="float: right; display: block;">返回</a>
				</h2>

				<div class="well">
					<div id="myTabContent" class="tab-content">
						<div class="row-fluid">
							<div class="span12">
								<div class="row-fluid">
									<div class="span4">
										<form id="tab">
											<label>制作类型</label> <select id="made_type"></select> <label>商品名称</label>
											<input type="text" value="" class="input-xlarge"
												id="goods_name" readonly="readonly"> <label>价格</label>
											<input type="text" value="" id="price" class="input-xlarge"
												readonly="readonly"> <label>尺码</label> <input
												type="text" value="" id="size" class="input-xlarge"
												readonly="readonly"></input> <label>身高</label> <input
												id="height" type="text" value="" class="input-xlarge"
												readonly="readonly"></input> <label>体重</label> <input
												id="weight" type="text" value="" class="input-xlarge"
												readonly="readonly"></input> <label>腰围</label> <input
												id="waist" type="text" value="" class="input-xlarge"
												readonly="readonly"></input> <label>臀围</label> <input
												type="text" value="" class="input-xlarge" id="hip"
												readonly="readonly">
										</form>
										<div class="btn-toolbar">
											<button class="btn btn-primary" onclick="modifyMadeType()">
												 保存
											</button>
											<a href="#" data-toggle="modal" class="btn" id="soldOutBtn"
												onclick="soldOutOrActive()">下架</a>
											<div class="btn-group"></div>
										</div>
									</div>
									<div class="span4">
										<form>
											<label>尺寸描述</label> <input type="text" value=""
												id="size_desc" class="input-xlarge" readonly="readonly">
											<label>是否公开</label> <input type="text" value=""
												id="is_public" class="input-xlarge" readonly="readonly">
											<label>状态</label> <input id="status" type="text" value=""
												class="input-xlarge" readonly="readonly"></input> <label>点赞数</label>
											<input id="praise_count" type="text" value=""
												class="input-xlarge" readonly="readonly"></input> <label>入库时间</label>
											<input id="create_date" type="text" value=""
												class="input-xlarge" readonly="readonly"></input> <label>颜色名称</label>
											<input id="color_name" type="text" value=""
												class="input-xlarge" readonly="readonly"></input> <label>商品描述</label>
											<input id="goods_desc" type="text" value=""
												class="input-xlarge" readonly="readonly"><label>发布者</label>
											<input id="publisher" type="text" value=""
												class="input-xlarge" readonly="readonly"></input>
										</form>
									</div>
									<div class="span4">
										<form id="photo_form"></form>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal small hide fade" id="myModal" tabindex="-1"
					role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-hidden="true">×</button>
						<h3 id="myModalLabel">下架确认</h3>
					</div>
					<div class="modal-body">

						<p class="error-text">
							<i class="icon-warning-sign modal-icon"></i>您确定要下架吗
						</p>
					</div>
					<div class="modal-footer">
						<button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>
						<button class="btn btn-danger" data-dismiss="modal"
							onclick="soldOut()">确定</button>
					</div>
				</div>

			</div>
		</div>
	</div>
	<footer>
		<jsp:include page="/footer.jsp"></jsp:include>
	</footer>




	<!-- Le javascript
    ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="lib/bootstrap/js/bootstrap.js"></script>
	<script src="js/layer/layer.min.js"></script>
</body>
</html>



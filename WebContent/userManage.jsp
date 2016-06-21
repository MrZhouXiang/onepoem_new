<!--用户管理界面-->
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
<link rel="stylesheet"
	href="/js/vendor/icheck/skins/minimal/minimal.css" />
<script src="lib/jquery-1.8.1.min.js" type="text/javascript"></script>
<script src="lib/jquery.pagination.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="stylesheets/pagination.css">
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

<script type="text/javascript">
	var idArray = new Array();
	var totalPage;
	var pageSizeVar = 1;
	var currentPageVar = 1;
	var idArray_lock = new Array();
	var totalPage_lock;
	var pageSizeVar_lock = 6;
	var currentPageVar_lock = 1;
	var serachVar = null;
	var currentLoc = 1;
	function loadPage() {
		InitTable(1);
	}
	function getDate(tm) {
		return new Date(parseInt(tm)).toLocaleString();
	}
	function pageCallback(index, jq) {
		currentPageVar = index + 1;
		InitTable(currentPageVar);
	}
	function clothesDetail_Click(id) {

		location.href = "clothesDetail.jsp?id=" + id;
	}
	function showPagination() {
		$("#list_find_ads").pagination(parseInt(totalPage), {
			callback : pageCallback,
			prev_text : '上一页',
			next_text : '下一页',
			items_per_page : pageSizeVar,
			num_display_entries : 5,//连续分页主体部分分页条目数  
			current_page : (currentPageVar - 1),//当前页索引  
			num_edge_entries : 2
		//两侧首尾分页条目数  
		});

	}
	function InitTable(pageIndex) {
		$('#search_btn').show();
		$('#input_search').show();
		$('#photo_del').hide();
		var frontUrl; //正面
		var backUrl; //背面
		var sideUrl; //侧面
		currentPageVar = pageIndex;
		currentLoc = 1;
		$.ajax({
					url : "webctrl/getUserList/" + currentPageVar,
					data : {
						currentPage : currentPageVar,
						pageSize : pageSizeVar,
						keyword : serachVar
					},
					dataType : "json",
					type : "post",
					success : function(data) {

						if (data.success) {
							$("#table_ads").empty();
							var urlPath = data.url;
							//显示列表
							for ( var i = 0; i < data.result.length; i++) {
								idArray[i] = data.result[i].id;
								var tempid = i + 1;
								$("#table_ads")
										.append(
												"<tr>"
														+ "<td>"
														+ data.result[i].pen_name
														+ "</td>"
														+ "<td>"
														+ data.result[i].tel
														+ "</td>"
														+ "<td>"
														+ data.result[i].money
														+ "</td>"
														+ "<td>"
														+ "<a href='"+urlPath+data.result[i].url+"' target='_blank'><img width='150' height='150' src='"
															+urlPath+data.result[i].url+"' align='middle''></a>"
														+ "</td>" + "<td>" + "<a href='#' onclick=\"memberDetail_Click('" + data.result[i].id + "','" + data.result[i].author_id + "')\">详情</a>"
														+ "</td>" + "</tr>");
							}
							//显示分布按钮							
							totalPage = data.totalPage;

							if (Number(totalPage) > pageSizeVar) {
								$("#list_find_ads").show();
								showPagination();
							} else {
								$("#list_find_ads").hide();
							}

							$("#error_find_ads").hide();
						} else {
							$("#error_find_ads").show();
						}
					}
				});
	}

	//注册函数
	$(function() {
		$('#input_search').bind('keypress', function(event) {
			if (event.keyCode == "13") {
				button_search();
			}
		});

		$("#add").on("click", function() {
			location.href = "addUser.jsp";
		});

	});
	function memberDetail_Click(id, author_id) {
		location.href = "userDetail.jsp?id=" + id;
	}
	function pageCallback_lock(index, jq) {

		currentPageVar_lock = index + 1;
		InitPhotoTable(currentPageVar_lock);

	}
	function showPagination_check() {
		$("#list_find_photo").pagination(parseInt(totalPage_lock), {
			callback : pageCallback_lock,
			prev_text : '上一页',
			next_text : '下一页',
			items_per_page : pageSizeVar_lock,
			num_display_entries : 5,//连续分页主体部分分页条目数  
			current_page : currentPageVar_lock - 1,//当前页索引  
			num_edge_entries : 2
		//两侧首尾分页条目数  
		});
	}
	function button_search() {
		serachVar = $("#input_search").attr("value");

		if (currentLoc == 1) {
			InitTable(1);
		} else {
			InitPhotoTable(1);
		}
	}
</script>
<body onload="loadPage()">
	<!-- 左边栏 -->
	<jsp:include page="/head.jsp"></jsp:include>
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span12">
				<div class="row-fluid">
					<!-- 左边栏 -->
					<div class="span2">
						<jsp:include page="/left.jsp"></jsp:include>
					</div>
					<div class="span10">
						<form class="form-inline" onsubmit="return false;">
							<font size="4"><button data-toggle="modal"
									data-target="#myModal" data-backdrop="static" id="add"
									type="button" class="btn">
									<i class="icon-plus" style="padding-right: 5px;"></i>新增
								</button> </font>
							<button id="search_btn" class="btn" type="button"
								style="float: right" onclick="button_search()">
								<i class="icon-search" style="padding-right: 5px;"></i>搜索
							</button>
							<input class="input-xlarge"
								style="float: right; margin-right: 10px" placeholder="请输入模板名称"
								id="input_search" type="text">
						</form>
						<div class="well">
							<div id="myTabContent" class="tab-content">
								<div class="tab-pane active in" id="clothes_check">
									<table class="table table-hover">
										<thead>
											<tr>
												<th>姓名</th>
												<th>电话</th>
												<th>墨汁</th>
												<th>图片</th>
												<th>操作</th>
											</tr>
										</thead>
										<tbody id="table_ads">
										</tbody>
									</table>
									<p id="error_find_ads" style="color: red; display: none;">没有相关数据,请查证后刷新.</p>
									<div id="list_find_ads" class="quotes" style="display: none"></div>
								</div>
							</div>
						</div>
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
	<script src="/js/vendor/icheck/icheck.min.js"></script>
	<script src="js/layer/layer.min.js"></script>
</body>
</html>



	var userPermission = '${sessionScope.userSessionInfo.name}';
	var mangerId = new Array();
	var changeState = 0;//同时只能修改一个
	var listLength = 0;
	var tempChange = new Array();

	/**
	 * 查询管理员列表
	 */
	function getManger() {
		changeState = 0;
		addCancel();
		$.ajax({
					url : "/getManagerList",
					dataType : "json",
					type : "post",
					success : function(data) {
						if (data.success) {
						
							$("#managerTable").empty();
							//显示列表
							listLength = data.result.length;
							for (var i = 0; i < data.result.length; i++) {
								var tempid = i + 1;
								mangerId[i] = data.result[i].id;
								var tempPermission;
								switch (data.result[i].role) {
								case '1': {
									tempPermission = "超级管理员";
									break;
								}
								case '2': {
									tempPermission = "普通管理员";
									break;
								}
								}
								var tempString = tempid.toString() + ",&quot;"
										+ data.result[i].loginName.toString()
										+ "&quot;" + ",&quot;"
										+ data.result[i].name + "&quot;,"
										+ "&quot;" + data.result[i].role + "&quot;";

								$("#managerTable")
										.append(
												"<tr  id='"+ data.result[i].loginName+"'>"
														+ "<td>"
														+ tempid
														+ "</td>"
														+ "<td id='mul"+data.result[i].loginName+"'>"
														+ data.result[i].loginName
														+ "</td>"
														+ "<td id='mul"+data.result[i].name+"'>"
														+ data.result[i].name
														+ "</td>"
														+ "<td id='dec"+data.result[i].role+"'>"
														+ tempPermission
														+ "</td>"
														+ "<td ><a href='#' onclick='changeRow("
														+ tempString
														+ ")'>修改</a></td>"
														+ "<td ><a href='#' onclick='deleteRow("
														+ data.result[i].id
														+ ")'>删除</a></td>"
														+ "</tr>");
							}
						} 
					}
				});
	}
	
	/**
	 * 修改管理员信息
	 * @param id
	 * @param loginName
	 * @param name
	 * @param role
	 */
	function changeRow(id, loginName, name, role) {
		if (changeState == 1) {
			layer.msg("请先提交完成的修改",2,{type : 1,shade : false});
		} else {
			changeState = 1;
			var tempId = "#" + loginName;
			var loginNameId = "#mul" + loginName;
			var nameId = "#mul" + name;
			var roleId = "#dec" + role;
			var tempMangerId = parseInt(id) - 1;
			//保存旧值
			tempChange[0] = id;
			tempChange[1] = loginName;
			tempChange[2] = name;
			tempChange[3] = role;
			var tempPer1="  <option value ='2'>普通管理员</option>";
		if(role=="超级管理员"){
			var tempPer1="  <option value ='1'>超级管理员</option>"			
		}
			var tempString = "<td>"
					+ id
					+ "</td><td>"
					+ "<input type='text' value='" + loginName + "' id='loginName_change'  >"
					+ "</td>	<td  >"
					+ "<input type='text' value='" + name + "' id='name_change' >"
					+ "</td>	" + "<td >" + "<select id='type_user_input'>"
					+ tempPer1 + "	</select>"
					+ "</td><td><a href='#' onclick='changeConfirm("
					+ mangerId[tempMangerId] + ")'>确定</a><br/>"
					+ "<a href='#' onclick='changeCancel()'>取消</a><br/>"
					+ "<a href='#' onclick='resetPassword()'>重置密码</a> "
					+ "</td>";
			$(tempId).html(tempString);
		}
	}
	
	/**
	 * 重置密码
	 */
	function resetPassword() {
		layer.confirm("是否确定重置密码? ", function(index){
			$.ajax({
				data : {
					loginName : $('#loginName_change').val()
				},
				url : "/resetPwd",
				dataType : "json",
				type : "post",
				success : function(data) {
					if (data.success) {
						layer.msg("重置成功, 密码为123456",2,{type : 1,shade : false});
						getManger();
						layer.close(index);
					} else {
						layer.msg("重置失败, 请确认后重新提交",2,{type : 1,shade : false});
					}
				},
				error : function(msg) {
					layer.msg("重置失败, 请确认后重新提交",2,{type : 1,shade : false});
				}
			});
		})
	}
	
	/**
	 * 保存修改的信息
	 * @param id
	 */
	function changeConfirm(id) {

		$.ajax({
			data : {
				id : id,
				loginName : $("#loginName_change").attr("value"),
				name : $("#name_change").attr("value"),
				role :	$("#type_user_input").val()
			},
			url : "/modifyManager",
			dataType : "json",
			type : "post",
			success : function(data) {
				if (data.success) {
					layer.msg("修改成功",2,{type : 1,shade : false});
					getManger();
				} else {
					layer.msg("修改失败, 请确认后重新提交",2,{type : 1,shade : false});
				}
			},
			error : function(msg) {
				layer.msg("修改失败, 请确认后重新提交",2,{type : 1,shade : false});
			}
		});
	}
	
	/**
	 * 取消修改
	 */
	function changeCancel() {
		changeState = 0;
		var id = tempChange[0];
		var loginName = tempChange[1];
		var name = tempChange[2];
		var role = tempChange[3];
		var str;
		if(role == "1"){
			str = "超级管理员";
		}else{
			str = "普通管理员";
		}
		var tempId = "#" + loginName;
		var tempString = id.toString() + ",&quot;" + loginName.toString()
				+ "&quot;" + ",&quot;" + name + "&quot;," + "&quot;"
				+ role + "&quot;";
		var tempHtml = "<td>" + id + "</td>" + "<td id='mul"+loginName+"'>"
				+ loginName + "</td>" + "<td id='mul"+name+"'>" + name
				+ "</td>" + "<td id='dec"+role+"'>" + str
				+ "</td>" + "<td ><a href='#' onclick='changeRow("
				+ tempString + ")'>修改</a></td>"
				+ "<td ><a href='#' onclick='deleteRow("
				+ id
				+ ")'>删除</a></td>";
		$(tempId).html(tempHtml);
	}
	
	/**
	 * 新增管理员
	 */
	function addRow() {
		$("#managerTable")
				.append(
						"<tr id='addTr'><td> "
								+ (listLength + 1)
								+ "</td><td><input style='width=50px' type='text'  placeholder='请输入用户名' value='' id='loginName_add' ></td>"
								+ "<td><input type='text' value=''   placeholder='请输入姓名' id='name_add' ></td>"
								+ "<td >" + "<select id='uerPermission'>"
								+ "  <option value ='2' selected='selected'>普通管理员</option>"
								+"	</select>"
								+ "</td>"	+ "<td><a href='#' onclick='addConfirm()'>增加</a> <br/>"
								+ "<a href='#' onclick='addCancel()'>取消</a></td>"
								+ "</tr>");
		$("#btn_group").hide();
	}
	
	/**
	 * 删除管理员
	 * @param str
	 */
	function deleteRow(id){
		layer.confirm('确定删除吗? ', function(){
			$.ajax({
				data:{
					id : id
				},
				url:"/deleteManager",
				dataType:"json",
				type : "post",
				success : function(data) {
					if (data.success) {
						layer.msg("删除成功",2,{type : 1,shade : false});
						getManger();
					}else{
						layer.msg("删除失败, 请确认后重新提交",2,{type : 1,shade : false});
					}
				},
				error:function(msg){
					layer.msg("删除失败, 请确认后重新提交",2,{type : 1,shade : false});
				}
			});
		});
	}

	/**
	 * 新增管理员
	 */
	function addConfirm() {
		var regex = /^[a-zA-Z0-9_]{6,16}$/;
		var loginName =  $("#loginName_add").val();
		if (trim(loginName) == "" || trim($("#name_add").val()) == "") {
			layer.msg("请勿提交空值",2,{type : 1,shade : false});
		}else if(!regex.test(loginName)){
			layer.msg("用户名由6-16位字母数字下划线组成, 请重新输入",2,{type : 1,shade : false});
		}else {
			$.ajax({
				data : {
					loginName : loginName,
					name : $("#name_add").val(),
					role : $("#uerPermission").val()
				},
				url : "/addManager",
				dataType : "json",
				type : "post",
				success : function(data) {
					if (data.code == "2000") {
						layer.msg(data.msg,2,{type : 1,shade : false});
						getManger();
						$("#btn_group").show();
					} else if(data.code == "4000"){
						layer.msg(data.msg,2,{type : 1,shade : false});
					}else{
						layer.msg(data.msg,2,{type : 1,shade : false});
					}
				},
				error:function(msg){
					layer.msg("新增失败, 请确认后重新提交",2,{type : 1,shade : false});
				}
			});
		}
	}

	/**
	 * 取消修改
	 */
	function addCancel() {
		$("#addTr").remove();

		$("#btn_group").show();
	}
	
	/**
	 * 去除空格
	 * @param a
	 * @returns
	 */
	function trim(a) {
	    return a.replace(/^\s+|\s+$/g, "");
	}

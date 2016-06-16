/**
 * Created by AI-MASK on 14-6-16.
 */
var currentPage = 1; //默认当前页
var baseUrl = "",
    column = "tel",
    keyword = ""; //搜索关键字

//判断某个字符是否是汉字
String.prototype.isCHS = function(i){
    if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
        return true;
    else
        return false;
}

var member = (function($){
    var mc = new DataCache();
    var numberOfRow = 15; //一页条数

    var list =  function(){
    	
        var keyword = $(".srh-input").val();
        if(keyword === ""){
            tooltip(".srh-input","请输入姓名/手机号码");
            return;
        }
        //
        memberRequest(mc,numberOfRow);
    };

    var getCache = function(){
        return mc;
    }
    var getRowCount = function(){
        return numberOfRow;
    }
    //public function
    return {
        findList:list,
        getCache:getCache,
        getRows:getRowCount
    }

})(jQuery);

/**
 * 公告列表
 */
function memberList(){

    memberRequest(member.getCache(),member.getRows());
    //memberSearch(); //搜索
    //deleteMember();
   loadPage();
   //menusort();
   // sendMail();
}
/**
 * 机构排序
 */
function menusort(){

    $("#js_sort_menu").hover(function(){
        $(this).find(".context-menu").show();
    },function(){
        $(this).find(".context-menu").hide();
    });
    $("#js_filter_menu").hover(function(){
        $(this).find(".context-menu").show();
    },function(){
        $(this).find(".context-menu").hide();
    });

    $("#js_sort_menu").on("click",'.cell a',function(){
        var $that = $(this);
        if(!$that.hasClass("selected")){
            $that.addClass("selected").siblings().removeClass("selected");
        }
        memberRequest(member.getCache(),member.getRows());
    })
    //过滤
    $("#js_filter_menu").on("click",'.cell a',function(){
        var $that = $(this);
        if(!$that.hasClass("checked")){
            $that.addClass("checked").siblings().removeClass("checked");
        }
        currentPage = 1;
        memberRequest(member.getCache(),member.getRows());
    })
}
/**
 * 分组搜索 点击和按钮事件
 */
function memberSearch(){

    $(".srh-input").keyup(function(e){
        var e = e || event;
        var keycode = e.which || e.keyCode;

        keyword = $(".srh-input").val();

        if(keyword === ""){
            column = "tel";
            tooltip(".srh-input","请输入称呼/电话");
        } else {
        	$(".srh-input").tooltip('destroy');
        }

        if (keycode == 8 && keyword == ""){
            $("#srh-btn").trigger("click");
        }
        if (keycode == 13){
            $("#srh-btn").trigger("click");
        }
    });
    //点击查询
    $("#srh-btn").on("click",function(){
//        member.findList()
        currentPage = 1;
        memberRequest(member.getCache(),member.getRows());
    });
}
/**
 * 机构列表，请求
 * @param mc
 * @param numberOfRow
 */
function memberRequest(mc,numberOfRow){
	$("#allcheck").attr("checked", false);
	var sfilter = $("#js_organization_menu").find(".cell .selected");
	var orgId = Number(sfilter.attr("val"));
	var keyword = $(".srh-input").val();
	
    $.ajax({
        url:'/memberReq/getList/'+currentPage,
        type:'post',
        dataType:'json',
        data:{
        	keyword: keyword, //查询关键字（数字、字母、中文）
            //column:column, //区分查询关键字类型（姓名、手机号码）
            //sortColumn:sortColumn, //排序关键字（姓名、手机、默认[memid]）
           // sortType:sortType, // 排序方式（升序、降序[默认]）
            num: numberOfRow, //页面容量（15）
            orgId:orgId
           // filter:filterValue //机构激活状态过滤器
        },
        success:function(data){
            if(data.success){
                mc.clear();
                var result = data.result;
                baseUrl = data.url;

                var tbody = get("table_list").getElementsByTagName("tbody");
                if(tbody.length > 0){
                    document.getElementById("table_list").removeChild(tbody[0]);
                }
                tbody[0] = document.createElement("tbody");
                document.getElementById("table_list").appendChild(tbody[0]);
                var fragment = document.createDocumentFragment();
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];

                    mc.set(obj.memId,obj); //缓存

                    var tr = renderTable(obj);
                    fragment.appendChild(tr);
                }
                tbody[0].appendChild(fragment);

                //滑过弹出
                popoverMemberDetail();

                var opt = {
                    id:'#pagebar',
                    totalPages:data.totalPages,
                    currentPage:data.curPage,
                    onPageChanged:function(e,oldPage,newPage){
                        console.log("Current page changed, old: "+oldPage+" new: "+newPage);
                        currentPage = newPage;
//                                 var s = (curPage - 1)*numberOfPages;
//                        member.findList();
                        memberRequest(mc,numberOfRow);
                    }
                };
                if(data.totalPages > 1){
                    paginator.paging(opt);
                    $("#recordCount").text(data.total);

                }else{
                    paginator.paging(opt);
                    $("#recordCount").text(data.total);
                }
                if(result.length == 0)
                {
                	layer.msg("对不起，没有找到匹配结果",2,{type:0,shade:false});
                }
            }else{
//                layer.msg("对不起，没有找到匹配结果");
                layer.msg("对不起，没有找到匹配结果",2,{type:0,shade:false});
            }

            $('input').iCheck({
                handle: 'checkbox',
                checkboxClass: 'icheckbox_minimal'
            });
        }
    });
}
/**
 * 机构弹出详细
 */
function popoverMemberDetail(){

    $.get("/html/memberDetail.html?t="+new Date().getTime(),function(d){

        $('#table_list td a').on('shown.bs.popover', function () {
            var id = $(this).parent().siblings().eq(0).find("input").attr("data-id");
            var obj = member.getCache();
            var row = obj.get(id);
            $("#pop_memberName").text(row.name);
            $("#pop_job").text(row.job);
            $("#pop_corp").text(row.corpName);
            $("#pop_website").text(row.website);

            var url = "";
            if(row.avatar == ""){
                url = baseUrl + "/assets/avatar/head.png";
            }else{
                url = baseUrl + "/assets/avatar/"+row.avatar;
            }
            $("#pop_avatar").attr("src",url);
        })

        $('#table_list td a').popover({
            html:true,
            animation:false,
            trigger:'manual',
            placement:"right",
            title:"机构信息",
            content:d,
            container:"body"
        }).on("mouseenter", function () {
            var _this = this;
            $(this).popover("show");

            $(".popover").on("mouseleave", function () {
                $(_this).popover('hide');
            });

        }).on("mouseleave", function () {
            var _this = this;
            setTimeout(function () {
                if (!$(".popover:hover").length) {
                    $(_this).popover("hide")
                }
            }, 10);
        });
    });
}
/**
 * 渲染单行tr
 * @param data
 * @returns {HTMLElement}
 */
function renderTable(data){
    var tr,td,_input;
    var ths = get("table_list").getElementsByTagName("th");
    tr = document.createElement("tr");
    for (var i = 0; i < ths.length; i++) {

        td = document.createElement("td");
        tr.appendChild(td);
        var th = ths[i];
        var type = th.getAttribute("data-type");
        if(type === "checkbox"){
            _input = document.createElement("input");
            _input.type="checkbox";
            _input.name="checkRow";
            _input.setAttribute('data-id',data.id);
            td.appendChild(_input);
            td.style.textAlign = "center";
        }else{

            switch(type){
                default :
                    td.innerText = data[type].replace(/[\r\n]/g,"");//去换行
                    td.title = data[type];
                    break;
            }
        }
    }
    return tr;
}
/**
 * 机构新增
 */
function loadPage(){
  //机构模态编辑
    $('#memberAddModal').on('show.bs.modal', function (e){
    	var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择一个用户后再审核",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("不能同时审核多个用户",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
            return false;
        }
    }); 
    $('#memberAddModal').on('shown.bs.modal', function (e) {
    	var checkedItems = inputChecked("table_list");
        $("#memberAdd_dialog").load("/html/member_req.html?t="+new Date().getTime()+" #memberAdd",function(){
        	var obj = {
                    fileInput:$("#fileupload"),
                    context:$("#files"),
                    hiddenInput:$("#fileName"),
                    progress:'progress',
                    uploaddone:function(){
                        $("#fileName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
                    }
                };
        	infoUpload(obj); //logo上传
        	
        	var id = checkedItems[0].getAttribute("data-id");

            getMemberById(Number(id)); 
            memberUpdate(id); 
            formValidate();
        });
    });
}


 /**
  *  机构表单验证
  */
 function formValidate(){

     $("#orgName").off("blur").on("blur",function(){
         var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入机构名称");
         }else{
             $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
         }
     });
     
     $("#orgEmail").off("blur").on("blur",function(){
    	 var val = $(this).val();
    	 var reg =  /^([a-zA-Z0-9_-]\.*)+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/; //邮箱正则验证
    	 if(trim(val) === ""){
    		 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入邮箱地址");
    	 }else if(!reg.test(val)){
    		 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入正确的邮箱地址");
    	 }else{
    		 $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	 }
     });
    
     $("#orgTel").off("blur").on("blur",function(){
         var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入联系电话");
         } /*else if(!/^[1]\d{10}$/.test(val)){
         	 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("手机号码格式错误，请重新输入");
         }*/else{
        	 $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
         }
     });
     
     $("#orgIntro").off("blur").on("blur",function(){
    	 var val = $(this).val();
    	 if(trim(val).length > 1000){
    		 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("机构介绍长度限制为1000个字符");
    	 } else{
        	 $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
         }
     });
     
 }
/**
 * serialize 表单序列表，字符串转 JSON对象
 **/
var serial2Json = (function(s){

    s.stj = function(str){
        str = decodeURIComponent(str,true);
        var subStr = str.replace(/&/g,"',");
        var trimStr = subStr.replace(/[+]/g, "");
        var jsonstr = "{"+trimStr.replace(/=/g,":'")+"'}";

        console.log(jsonstr);
        var obj = parseObj(jsonstr);
        //json方法
        function parseObj( strData ){
            return (new Function( "return " + strData ))();
        }
        return obj;
    };
    return s;
})({});

/**
 * 机构删除
 */
function deleteMember(){

	$("#member_del").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要删除的数据",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = Number(checkedItems[0].getAttribute("data-id"));
                    $.ajax({
                        url:"/memberReq/delete",
                        type:"post",
                        dataType:"json",
                        data:{
                        	ids:_id
                        },
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                            	memberRequest(member.getCache(),member.getRows());
                            }
                        }
                    });
                }else{
                	var str = "";
                    for (var i = 0; i < checkedItems.length; i++) {
                        var obj = checkedItems[i];
                        var _id = Number(obj.getAttribute("data-id"));
                        str += _id + ",";
                    }
                    str = str.substring(0,str.length-1);
                    
                    $.ajax({
                        url:"/memberReq/delete",
                        type:"post",
                        dataType:"json",
                        data:{
                        	ids:str
                        },
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                                for (var i = 0; i < checkedItems.length; i++) {
                                    var obj1 = checkedItems[i];
                                    $(obj1).parents("tr").remove();
                                }
                                memberRequest(member.getCache(),member.getRows());   
                            }
                        }
                    });
                }
                layer.close(index);
            });
        }
    });
}
/**
 * 发送邮件
 */
function sendMail(){
	$("#email_send").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要发送的机构",2,{type:1,shade:false});
        	return false;
        }
        if (checkedItems.length > 0) {
			console.log(checkedItems.length);
			if (checkedItems.length === 1) {
				var _id = Number(checkedItems[0].getAttribute("data-id"));
				$.ajax({
					url : "/member/sendMail/" + _id,
					type : "post",
					dataType : "json",
					success : function(data) {
						if (data.success && data.flag) {
							layer.msg("邮件发送成功",2,{type:1,shade:false});
							memberRequest(member.getCache(), member.getRows());
						}else if(!data.flag){
							layer.msg("服务器繁忙，请稍后重试",2,{type:0,shade:false});
							memberRequest(member.getCache(), member.getRows());
						}else if(!data.success){
							layer.msg("此机构已激活",2,{type:0,shade:false});
							memberRequest(member.getCache(), member.getRows());
						}
					}
				});
			} else {
				var str = "";
				for (var i = 0; i < checkedItems.length; i++) {
					var obj = checkedItems[i];
					var _id = Number(obj.getAttribute("data-id"));
					if (i == checkedItems.length - 1) {
						str += _id;
					} else {
						str += _id + ",";
					}
				}
				$.ajax({
					url : "/member/sendMail/batch/" + str,
					type : "post",
					dataType : "json",
					success : function(data) {
						if (data.success) {
							for (var i = 0; i < checkedItems.length; i++) {
								var obj1 = checkedItems[i];
								$(obj1).parents("tr").remove();
							}
							layer.msg("邮件发送成功",2,{type:1,shade:false});
							memberRequest(member.getCache(), member.getRows());
						}
					}
				});
			}
		}
	});
}

/**
 * 机构编辑，根据id查询当前机构
 * 
 * @param id
 */
function getMemberById(id){
	$.get("/memberReq/get?id="+id,function(data){
		if(data.success){
			var result = data.result;
			
			$("#memberName").val(result.name);
			$("#memberTel").val(result.tel);
			$("#memberEmail").val(result.email);
			$("#orgTel").val(result.tel);
			$("#orgIntro").text(result.introduction);
			$("#device_id").val(result.deviceId);
			$("#orgid").val(result.orgId);
			
			
			loadCorp(result.orgId);
			
			loadGroup(result.orgId);
		}
	});
}
/**
 * 机构编辑 保存
 * @param id
 */
function memberUpdate(id){
	AV.initialize("llky8r3mxc3f17jmenjx6h9i0oly9r2wedxebxpydjh3xuiz", "jsemufrveou34ck9z4bd7lms7iuv0t85fphmh0bzv938l1jm");
    $("#member-add-btn").on("click",function(){
    	if($("#memberName").val() === ""){
            $("#memberName").parents(".form-group").addClass("has-error").find(".help-block").text("请输入用户姓名");
            $("#memberName").focus();
            return false;
        } else if ($("#memberName").val().length > 15) {
        	$("#memberName").parents(".form-group").addClass("has-error").find(".help-block").text("姓名长度限制为15个字符");
        	$("#memberName").focus();
            return false;
        } else {
        	$("#memberName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	
        if($("#memberTel").val() === ""){
            $("#memberTel").parents(".form-group").addClass("has-error").find(".help-block").text("手机号作为登录账号,请填写手机号");
            $("#memberTel").focus();
            return false;
        } else if (!/^[1]\d{10}$/.test($("#memberTel").val())) {
        	 $("#memberTel").parents(".form-group").addClass("has-error").find(".help-block").text("手机号码格式错误，请重新输入");
        	 $("#memberTel").focus();
             return false;
        } else {
        	$("#memberTel").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        var reg =  /^([a-zA-Z0-9_-]\.*)+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/; //邮箱正则验证
        if($("#memberEmail").val() === ""){
        	$("#memberEmail").parents(".form-group").addClass("has-error").find(".help-block").text("请输入邮箱地址");
        	$("#memberEmail").focus();
        	return false;
        } else if(!reg.test($("#memberEmail").val())){
        	$("#memberEmail").parents(".form-group").addClass("has-error").find(".help-block").text("请输入正确的邮箱地址");
        	$("#memberEmail").focus();
        	return false;
      	 } else {
      		$("#memberEmail").parents(".form-group").removeClass("has-error").find(".help-block").text("");
      	 }
        
        if($("#memberJob").val() === ""){
        	$("#memberJob").parents(".form-group").addClass("has-error").find(".help-block").text("请输入职位");
        	$("#memberJob").focus();
        	return false;
        } else if ($("#memberJob").val().length > 15) {
        	$("#memberJob").parents(".form-group").addClass("has-error").find(".help-block").text("职位长度限制为15个字符");
        	$("#memberJob").focus();
            return false;
        } else {
        	$("#memberJob").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if($("#corpid").val() === ""){
        	$("#corpid").parents(".form-group").addClass("has-error").find(".help-block").text("请选择公司");
        	return false;
        } else {
        	$("#corpid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if($("#groupId").val() === "" || $("#groupId").val() == "-1"){
        	$("#groupId").parents(".form-group").addClass("has-error").find(".help-block").text("请选择分组");
        	return false;
        } else {
        	$("#groupId").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    
    	 var flag = telValidate();
         if(flag){
        	 var param = $("#memberAddForm").serializeArray();

             $.ajax({
                 url:"/member/new",
                 type:"post",
                 dataType:"json",
                 data:param,
                 success:function(data){
                     if(data.success){
                    	 //1.删除待审核用户
                    	$.ajax({
                            url:"/memberReq/delete",
                            type:"post",
                            dataType:"json",
                            data:{
                            	ids:id
                            },
                            success:function(data){}
                        });
                    	
                    	//2.推送到App
                    	var device_id = $("#device_id").val();
                    	if(device_id)
                		{
                    		var _msg = {
                        			"action":"com.puyuntech.yba.action.CUSTOM_RECEIVER",
                        			"aps" : { "alert" : "您已成功加入商会" },
                        			type:"4",
                        			msg:
                        			{
                        				orgId:$("#orgid").val()
                        			}
                        	};
		                	var cql = "select * from _Installation where installationId in('"+device_id+"') or deviceToken in('"+device_id+"')";
		        			AV.Push.send({cql: cql, data: _msg });
                		}
                    	 layer.msg("审核成功",2,{type:1,shade:false});
                         var total = data.totalPages;
                         currentPage = 1;
                         memberRequest(member.getCache(),member.getRows());
                         $('#memberAddModal').modal('hide');
                     }
                 }
             });
         }else{
        	 return false;
         }
        
        
    });
}

/**
 *  用户唯一性验证
 */
function telValidate(){
	 var tel = $("#memberTel").val();
	 var orgid =  $("#orgid").val();
	 if(/^[1]\d{10}$/.test(tel)){
		 var b =false;
		 $.ajax({
			 url:"/member/doValidate",
            type:"get",
            dataType:"json",
            data:{
           	 tel:tel,
           	 orgid:orgid
            },
            async:false,
            success:function(data){
           	     if(!data.success){
           	    	 $("#memberTel").parents(".form-group").addClass("has-error").find(".help-block").text(data.message);
           	     }
           		 b =data.success;
            }
		 });
		 
		 return  b;
	 }
}

/**
 * 菜单
 */
function menu(){
	//机构下拉框
	$.ajax({
        url:'/isSuperAdmin/',
        type:'post',
        dataType:'json',
        success:function(data){
        	if(data.result){
        		loadOrgMenu();
        	}
        }
	});
}

/**
 * 加载机构菜单
 */
function loadOrgMenu()
{
	$("#js_organization_menu").show();
	
	$("#js_organization_menu").hover(function(){
        $(this).find(".context-menu").show();
    },function(){
        $(this).find(".context-menu").hide();
    });

    //过滤
    $("#js_organization_menu").on("click",'.cell a',function(){
        var $that = $(this);
        if(!$that.hasClass("selected")){
            $that.addClass("selected").siblings().removeClass("selected");
        }
        currentPage = 1;
        memberRequest(member.getCache(),member.getRows());
    });
    
    $.ajax({
        url:'/organization/getAllOrganizationList/',
        type:'post',
        dataType:'json',
        success:function(data){
        	if(data.success){
        		var result = data.result;
        		var cell = $("#js_organization_menu .cell");
        		for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    cell.append('<a href="javascript:;" val="'+ obj.id +'" ><span><s></s>'+obj.name+'</span></a>');
        		}
        	}
        }
    });	
}


/**
 * 加载公司下拉列表框
 */
function loadCorp(orgId, selectedVal)
{
	$.ajax({
        url:'/corporation/getCorpNameList/',
        type:'post',
        dataType:'json',
        data:{
	    	orgId : orgId
	    },
        success:function(data){
        	if(data.success){
        		var result = data.result;
        		var menu = $("#corpMenu");
        		menu.empty();
        		var selectedObj = null;
        		for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    if(obj.corpid == selectedVal){
                    	selectedObj = obj;
                    }
                    menu.append('<li role="presentation"><a role="menuitem" tabindex="-1" val="'+ obj.corpid +'" onclick="clickCorpItem(this)">'+ obj.corpName +'</a></li>');
        		}
        		if(selectedVal)//设置默认选中项
    			{
	    			$("#corpText").text(selectedObj.corpName);
	        		$("#corpid").val(selectedObj.corpid);
    			}else{
    				$("#corpText").text("请选择公司");
    				$("#corpid").val("");
    			}
        	}
        }
	});
}

/**
 * 加载分组
 */
function loadGroup(orgid, selectedVal)
{
	$("#js_group_menu").hover(function(){
	    $(this).find(".context-menu").show();
	},function(){
	    $(this).find(".context-menu").hide();
	});

	$("#js_group_menu").on("click",'.cell a',function(){
		clickGroupOption(this);
	});
	
	loadGroupOption(orgid, selectedVal);
}

function clickCorpItem(t)
{
	var text = t.innerText;
	var val = $(t).attr("val");
	$("#corpText").text(text);
	$("#corpid").val(val);
	
    if(trim(val) === ""){
        $(t).parents(".form-group").addClass("has-error").find(".help-block").text("请选择公司");
    }else{
        $(t).parents(".form-group").removeClass("has-error").find(".help-block").text("");
    }
}

/**
 * 分组项点击事件
 */
function clickGroupOption(t)
{
	var $that = $(t);
    if(!$that.hasClass("selected")){
        $that.addClass("selected").siblings().removeClass("selected");
        $("#groupId").val($that.attr("val"));
        $("#groupText").text($that.text());
        
        if(trim($that.attr("val")) === ""){
        	$that.parents(".form-group").addClass("has-error").find(".help-block").text("请选择分组");
        }else{
        	$that.parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    }
}

function loadGroupOption(orgId, selectedVal)
{
	var selectedObj = {};
	$.ajax({
	    url:'/group/getAllGroupList/',
	    type:'post',
	    dataType:'json',
	    data:{
	    	orgId : orgId
	    },
	    success:function(data){
	    	if(data.success){
	    		var result = data.result;
	    		var menu = $("#groupList");
	    		menu.empty();
	    		var selected = '';
	    		menu.append('<a menu="groupId" val="-1" '+ (selectedVal ? '' : ' class="selected" ') +' ><span><s></s>请选择分组</span></a>');
	    		
        		for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    if(obj.id == selectedVal){
                     	selectedObj = obj;
                     	selected = ' class="selected" ';
                     }else{
                    	 selected = ' ';
                     }
                    menu.append('<a  menu="groupId" val="'+ obj.id +'" '+ selected + '><span><s></s>'+ obj.name +'</span></a>');
        		}
        		
	     		if(selectedVal)//设置默认选中项
	 			{
		    			$("#groupText").text(selectedObj.name);
		        		$("#groupId").val(selectedObj.id);
	 			}else{
	 				$("#groupText").text("请选择分组");
	 				$("#groupId").val("");
	 			}
	    	}
	    }
	});	
}

$(function(){
    userMenu();
    checkAllEvent();
    memberList();
    deleteMember();
    memberSearch();
    menu();

    $('#member-add').popover({
        html:true,
        trigger:'click',
        placement:"bottom",
        title:"机构信息",
        content:function(){
        },
        container:"body"
    });
    $(".srh-input").tooltip({
        trigger: 'click',
        placement: "bottom",
        title: "请输入称呼/电话"
    });

});
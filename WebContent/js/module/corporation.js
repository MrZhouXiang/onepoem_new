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
    	
        memberRequest(mc,numberOfRow);
    }

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
    memberSearch(); //搜索
    deleteMember();
   loadPage();
   menu();
   // sendMail();
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
 * 公司搜索 点击和按钮事件
 */
function memberSearch(){

    $(".srh-input").keyup(function(e){
        var keycode = e.which || e.keyCode;

        keyword = $(".srh-input").val();

        if(keyword === ""){
            column = "tel";
            tooltip(".srh-input","请输入公司名称");
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
 * 公司列表，请求
 * @param mc
 * @param numberOfRow
 */
function memberRequest(mc,numberOfRow){
	$("#allcheck").attr("checked", false);
	 var sfilter = $("#js_organization_menu").find(".cell .selected");
	 var orgId = Number(sfilter.attr("val"));
	 var keyword = $(".srh-input").val();
	
    $.ajax({
        url:'/corporation/getCorpList/',
        type:'post',
        dataType:'json',
        data:{
            keyword: keyword, //查询关键字（数字、字母、中文）
            //column:column, //区分查询关键字类型（姓名、手机号码）
            //sortColumn:sortColumn, //排序关键字（姓名、手机、默认[memid]）
           // sortType:sortType, // 排序方式（升序、降序[默认]）
            pageSize: numberOfRow, //页面容量（15）
            currentPage : currentPage,
            orgId : orgId
           // filter:filterValue //公司激活状态过滤器
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
                    $("#recordCount").text(result.length);
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
 * 公司弹出详细
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

           /* var url = "";
            if(row.avatar == ""){
                url = baseUrl + "/assets/avatar/head.png";
            }else{
                url = baseUrl + "/assets/avatar/"+row.avatar;
            }
            $("#pop_avatar").attr("src",url);*/
        })

        $('#table_list td a').popover({
            html:true,
            animation:false,
            trigger:'manual',
            placement:"right",
            title:"公司信息",
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
            _input.setAttribute('data-id',data.corpid);
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

var u= null;
/**
 * 机构新增
 */
function loadPage(){
	//新增modal
    $('#memberAddModal').on('shown.bs.modal', function () {
    	$("#memberEdit_dialog").empty();//清空编辑页面的内容，防止元素的ID重复
        $("#memberAdd_dialog").load("/html/corporation.html?t="+new Date().getTime()+" #add",function(){
        	loadOrg();
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
        	
            //实例化编辑器
            //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
        	UE.getEditor('introduction',{initialFrameWidth:"100%"});

            
        	addSave();
            formValidate();
        });
    });
    
    $('#memberAddModal').on('hidden.bs.modal', function (e) {
    	  // do something...
    	UE.getEditor('introduction').destroy();
	});
    
  //公司模态编辑
    $('#memberEditModal').on('show.bs.modal', function (e){
    	var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要编辑的公司",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("不能同时编辑多个公司",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
            return false;
        }
    }); 
    $('#memberEditModal').on('shown.bs.modal', function (e) {
    	$("#memberAdd_dialog").empty();//清空新增页面的内容，防止元素ID重复
    	var checkedItems = inputChecked("table_list");
        $("#memberEdit_dialog").load("/html/corporation.html?t="+new Date().getTime()+" #edit",function(){
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
    $('#memberEditModal').on('hidden.bs.modal', function (e) {
    	// do something...
    	UE.getEditor('introduction').destroy();
	});
}
//新增保存
function addSave(){
	
    $("#member-add-btn").off("click").on("click",function(){
    	
    	if($("#orgid").val() === "" && isSuperAdmin()){
            $("#orgid").parents(".form-group").addClass("has-error").find(".help-block").text("请选择机构");
            return false;
    	}else{
    		$("#orgid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	}
    	
    	if($("#corpName").val() === ""){
            $("#corpName").parents(".form-group").addClass("has-error").find(".help-block").text("请输入公司名称");
            $("#corpName").focus();
            return false;
        } else if ($("#corpName").val().length > 15) {
        	$("#corpName").parents(".form-group").addClass("has-error").find(".help-block").text("公司名称长度限制为15个字符");
        	$("#corpName").focus();
            return false;
        } else {
        	$("#corpName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	/*
    	if($("#address").val() === ""){
            $("#address").parents(".form-group").addClass("has-error").find(".help-block").text("请输入地址");
            $("#address").focus();
            return false;
        } else if ($("#address").val().length > 35) {
        	$("#address").parents(".form-group").addClass("has-error").find(".help-block").text("地址长度限制为35个字符");
        	$("#address").focus();
            return false;
        } else {
        	$("#address").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }*/
    	/*
    	var reg =  /^([a-zA-Z0-9_-]\.*)+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/; //邮箱正则验证
    	if($("#email").val() === ""){
    		$("#email").parents(".form-group").addClass("has-error").find(".help-block").text("请输入邮箱地址");
    		$("#email").focus();
    		return false;
    	} else if(!reg.test($("#email").val())){
        	$("#email").parents(".form-group").addClass("has-error").find(".help-block").text("请输入正确的邮箱地址");
        	return false;
      	 } else {
      		$("#email").parents(".form-group").removeClass("has-error").find(".help-block").text("");
      	 }*/
    	
    	if($("#tel").val() === ""){
    		$("#tel").parents(".form-group").addClass("has-error").find(".help-block").text("请输入电话号码");
    		$("#tel").focus();
    		return false;
    	} else if (!/^(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})$/.test($("#tel").val())) {
    		 $("#tel").parents(".form-group").addClass("has-error").find(".help-block").text("电话号码格式错误，请重新输入");
	    	 $("#tel").focus();
	         return false;
	    } else {
	    	$("#tel").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	    }
    	 /*
    	if($("#fax").val() === ""){
    		$("#fax").parents(".form-group").addClass("has-error").find(".help-block").text("请输入传真");
    		$("#fax").focus();
    		return false;
    	} else if (!/^(\d{3,4}-)?\d{7,8}$/.test($("#fax").val())) {
    		 $("#fax").parents(".form-group").addClass("has-error").find(".help-block").text("传真格式错误，请重新输入");
	    	 $("#fax").focus();
	         return false;
	    } else {
	    	$("#fax").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	    }

    	if($("#website").val() === ""){
    		$("#website").parents(".form-group").addClass("has-error").find(".help-block").text("请输入网址");
    		$("#website").focus();
    		return false;
    	} else {
	    	$("#website").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	    }*/
    	
    	if(UE.getEditor('introduction').getContent() === ""){
    		$("#introduction").parents(".form-group").addClass("has-error").find(".help-block").text("请输入公司介绍");
    		$("#introduction").focus();
    		return false;
    	} else {
	    	$("#introduction").parents(".form-group").removeClass("has-error").find(".help-block").text("");
		}
    	
    	 addRequest();
    });
}
/**
 * 新增表单请求
 */
 function addRequest(){
     var param = $("#memberAddForm").serializeArray();
     
     var ue = UE.getEditor('introduction');
     param.push({name : "introduction", value : ue.getContent()});
     param.push({name : "logo", value : $("#fileName").val()});

     $.ajax({
         url:"/corporation/add",
         type:"post",
         dataType:"json",
         data:param,
         success:function(data){
             if(data.success){
            	 layer.msg("新增成功",2,{type:1,shade:false});
                 var total = data.totalPages;
                 currentPage = 1;
                 memberRequest(member.getCache(),member.getRows());
                 $('#memberAddModal').modal('hide');
                 //UE.getEditor('introduction').destroy();
             }
         }
     });
 }
 /**
  *  公司表单验证
  */
 function formValidate(){
     $("#corpName").off("blur").on("blur",function(){
         var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入公司名称");
         }else{
             $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
         }
     });
     /*
     $("#email").off("blur").on("blur",function(){
    	 var val = $(this).val();
    	 var reg =  /^([a-zA-Z0-9_-]\.*)+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/; //邮箱正则验证
    	 if(trim(val) === ""){
    		 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入邮箱地址");
    	 }else if(!reg.test(val)){
    		 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入正确的邮箱地址");
    	 }else{
    		 $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	 }
     });*/
     
     $("#tel").off("blur").on("blur",function(){
         var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入电话号码");
         }else if(!/^(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})$/.test($("#tel").val())){
         	 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("电话号码格式错误，请重新输入");
         }else{
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
 * 公司删除
 */
function deleteMember(){

	$("#member_del").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要删除的公司",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = Number(checkedItems[0].getAttribute("data-id"));
                    $.ajax({
                        url:"/corporation/delete",
                        dataType:"json",
                        data:{
                        	ids:_id
                        },
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                            	memberRequest(member.getCache(),member.getRows());
                            }else{
                            	layer.msg(data.message);
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
                        url:"/corporation/delete",
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
                            }else{
                            	layer.msg(data.message);
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
            layer.msg("请选择要发送的公司",2,{type:1,shade:false});
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
							layer.msg("此公司已激活",2,{type:0,shade:false});
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
 * 公司编辑，根据id查询当前公司
 * 
 * @param id
 */
function getMemberById(id){
	$.get("/corporation/getCorpById/"+id,function(data){
		if(data.success){
			var result = data.result;
			var url = data.url;
			$("#corpName").val(result.corpName);
			$("#address").val(result.address);
			$("#email").val(result.email);
			$("#tel").val(result.tel);
			$("#fax").val(result.fax);
			$("#website").val(result.website);
			
			var logo = result.logo;
			$("#fileName").val(logo); //隐藏域
			if(logo)
			{
	            $("#files").find("img").attr("src",url+ logo).show();
	            $("#files").find("a").attr("href",url +logo).show();
	            $("#files").find("i").hide();
			}
            var  ue = UE.getEditor('introduction',{initialFrameWidth:"100%"});
            ue.ready(function(){
            	ue.setContent(result.introduction);
            });
		}
	});
}
/**
 * 公司编辑 保存
 * @param id
 */
function memberUpdate(id){
    $("#member-edit-btn").on("click",function(){
    	
    	if($("#corpName").val() === ""){
            $("#corpName").parents(".form-group").addClass("has-error").find(".help-block").text("请输入公司名称");
            $("#corpName").focus();
            return false;
        } else if ($("#corpName").val().length > 15) {
        	$("#corpName").parents(".form-group").addClass("has-error").find(".help-block").text("公司名称长度限制为15个字符");
        	$("#corpName").focus();
            return false;
        } else {
        	$("#corpName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	
    	/*
    	if($("#address").val() === ""){
            $("#address").parents(".form-group").addClass("has-error").find(".help-block").text("请输入地址");
            $("#address").focus();
            return false;
        } else if ($("#address").val().length > 35) {
        	$("#address").parents(".form-group").addClass("has-error").find(".help-block").text("地址长度限制为35个字符");
        	$("#address").focus();
            return false;
        } else {
        	$("#address").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }*/
    	/*
    	var reg =  /^([a-zA-Z0-9_-]\.*)+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/; //邮箱正则验证
    	if($("#email").val() === ""){
    		$("#email").parents(".form-group").addClass("has-error").find(".help-block").text("请输入邮箱地址");
    		$("#email").focus();
    		return false;
    	} else if(!reg.test($("#email").val())){
        	$("#email").parents(".form-group").addClass("has-error").find(".help-block").text("请输入正确的邮箱地址");
        	return false;
      	 } else {
      		$("#email").parents(".form-group").removeClass("has-error").find(".help-block").text("");
      	 }*/
    	
    	if($("#tel").val() === ""){
    		$("#tel").parents(".form-group").addClass("has-error").find(".help-block").text("请输入电话号码");
    		$("#tel").focus();
    		return false;
    	} else if (!/^(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})$/.test($("#tel").val())) {
    		 $("#tel").parents(".form-group").addClass("has-error").find(".help-block").text("电话号码格式错误，请重新输入");
	    	 $("#tel").focus();
	         return false;
	    } else {
	    	$("#tel").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	    }
    	 
    	/*
    	if($("#fax").val() === ""){
    		$("#fax").parents(".form-group").addClass("has-error").find(".help-block").text("请输入传真");
    		$("#fax").focus();
    		return false;
    	} else if (!/^(\d{3,4}-)?\d{7,8}$/.test($("#fax").val())) {
    		 $("#fax").parents(".form-group").addClass("has-error").find(".help-block").text("传真格式错误，请重新输入");
	    	 $("#fax").focus();
	         return false;
	    } else {
	    	$("#fax").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	    }

    	if($("#website").val() === ""){
    		$("#website").parents(".form-group").addClass("has-error").find(".help-block").text("请输入网址");
    		$("#website").focus();
    		return false;
    	} else {
	    	$("#website").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	    }*/
    	
    	if(UE.getEditor('introduction').getContent() === ""){
    		$("#introduction").parents(".form-group").addClass("has-error").find(".help-block").text("请输入公司介绍");
    		$("#introduction").focus();
    		return false;
    	} else {
	    	$("#introduction").parents(".form-group").removeClass("has-error").find(".help-block").text("");
		}
        
        var param = $("#memberEditForm").serializeArray();
        
        var ue = UE.getEditor('introduction');
        param.push({name : "introduction", value : ue.getContent()});
        param.push({name : "logo", value : $("#fileName").val()});
        param.push({name : "corpid", value : id});

        $.ajax({
            url:"/corporation/edit",
            type:"post",
            dataType:"json",
            data:param,
            success:function(data){
                if(data.success){
                	layer.msg("保存成功",2,{type:1,shade:false});
                    memberRequest(member.getCache(),member.getRows());
                    $('#memberEditModal').modal('hide');
                    //UE.getEditor('introduction').destroy();
                }
            }
        });
        
    });
}

function isSuperAdmin()
{
	var bool = false;
	//机构下拉框
	$.ajax({
        url:'/isSuperAdmin/',
        type:'post',
        dataType:'json',
        async : false,
        success:function(data){
        	if(data.result){
        		bool = true;
        	}
        }
	});
	return bool;
}

/**
 * 加载机构下拉框
 */
function loadOrg()
{
	if(isSuperAdmin())
	{
		$("#orgItemMeta").show();
		$.ajax({
		    url:'/organization/getAllOrganizationList/',
		    type:'post',
		    dataType:'json',
		    success:function(data){
		    	if(data.success){
		    		var result = data.result;
		    		var menu = $("#orgMenu");
	        		for (var i = 0; i < result.length; i++) {
	                    var obj = result[i];
	                    menu.append('<li role="presentation"><a role="menuitem" tabindex="-1" val="'+ obj.id +'" onclick="clickOrgItem(this)">'+ obj.name +'</a></li>');
	                    
	        		}
		    	}
		    }
		});	
	}
}

function clickOrgItem(t)
{
	var text = t.innerText;
	var val = $(t).attr("val");
	$("#orgText").text(text);
	$("#orgid").val(val);
	
	if(val != "-1"){
		$("#orgid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	}
}

$(function(){
    userMenu();
    checkAllEvent();
    memberList();

    $('#member-add').popover({
        html:true,
        trigger:'click',
        placement:"bottom",
        title:"公司信息",
        content:function(){
        },
        container:"body"
    });
    $(".srh-input").tooltip({
        trigger: 'focus',
        placement: "bottom",
        title: "请输入公司名称"
    });

});
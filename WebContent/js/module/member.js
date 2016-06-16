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
};

var member = (function($){
    var mc = new DataCache();
    var numberOfRow = 15; //一页条数

    var list =  function(){
    	
        memberRequest(mc,numberOfRow);
    };

    var getCache = function(){
        return mc;
    };
    var getRowCount = function(){
        return numberOfRow;
    };
    //public function
    return {
        findList:list,
        getCache:getCache,
        getRows:getRowCount
    };

})(jQuery);

/**
 * 公告列表
 */
function memberList(){

    memberRequest(member.getCache(),member.getRows());
    memberSearch(); //搜索
    deleteMember();
    loadPage();
    menusort();
    menu();//选择机构菜单
    sendMail();
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

function clickOrgItem(t)
{
	var text = t.innerText;
	var val = $(t).attr("val");
	$("#orgText").text(text);
	$("#orgid").val(val);
	
	if(val != "-1"){
		$("#orgid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	}
	
	//更新公司
	loadCorp(val);

	//更新分组
	loadGroupOption(val);
	
}

/**
 * 菜单
 */
function menu(){
	if(isSuperAdmin())
	{
		loadOrgMenu();
	}
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

    //机构选择
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
 * 会员排序
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
        if(!$that.hasClass("selected")){
            $that.addClass("selected").siblings().removeClass("selected");
        }
        currentPage = 1;
        memberRequest(member.getCache(),member.getRows());
    })
}
/**
 * 会员搜索 点击和按钮事件
 */
function memberSearch(){

    $(".srh-input").keyup(function(e){
        var e = e || event;
        var keycode = e.which || e.keyCode;

        keyword = $(".srh-input").val();

        if(keyword === ""){
            column = "tel";
            tooltip(".srh-input","请输入姓名/手机号码");
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
 * 会员列表，请求
 * @param mc
 * @param numberOfRow
 */
function memberRequest(mc,numberOfRow){
	$("#allcheck").attr("checked", false);
	var sfilter = $("#js_organization_menu").find(".cell .selected");
	var orgId = Number(sfilter.attr("val"));

    var sColumn = $("#js_sort_menu").find(".cell .selected");
    var sfilter = $("#js_filter_menu").find(".cell .selected");
    var sortColumn = "memid",sortType = "desc";

    sColumn.each(function(){
        var that = $(this);
        var menu = that.attr("menu");
        if(menu === "sort_file"){
            sortColumn = that.attr("val");
        }else{
            sortType = that.attr("val") === "0"?"desc":"asc";
        }
    });
    var filterValue = Number(sfilter.attr("val"));

    $.ajax({
        url:'/member/doSearch/'+ currentPage,
        type:'post',
        dataType:'json',
        data:{
            keyword: keyword, //查询关键字（数字、字母、中文）
            sortColumn:sortColumn, //排序关键字（姓名、手机、默认[memid]）
            sortType:sortType, // 排序方式（升序、降序[默认]）
            num: numberOfRow, //页面容量（15）
            filter:filterValue, //会员激活状态过滤器
            orgId:orgId
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
                //popoverMemberDetail();

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
 * 会员弹出详细
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
            title:"会员信息",
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
            _input.setAttribute('data-id',data.memId);
            _input.setAttribute('orgid',data.orgid);
            td.appendChild(_input);
            td.style.textAlign = "center";
        }else{

            switch(type){
                case "gender":
                    td.innerText = data[type] === 0?"女":"男";
                    break;
                case "name":
                    td.innerHTML = data[type];
                    break;
                case "token":
                    td.innerHTML = (data[type] == null || data[type] == ""||data[type].length<1)?"<div class='sts-icon' title='未激活'></div>":"<div class='sts-icon active' title='已激活'></div>";
                    break;
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
 * 会员新增
 */
function loadPage(){
	//新增modal
    $('#memberAddModal').on('shown.bs.modal', function () {
    	$('#memberEdit_dialog').empty();//销毁编辑模态框（防止元素ID重复）
        $("#memberAdd_dialog").load("/html/member.html?t="+new Date().getTime()+" #memberAdd",function(){
            
        	/*$('#memberJoinTime').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                pickerPosition:"bottom-left"
            });*/
        	//加载公司下拉框
            loadCorp();
            //加载机构下拉框
            loadOrg();
        	addSave();
            formValidate();

            loadGroup(-1);
		    
        });
    });
  //会员模态编辑
    $('#memberEditModal').on('show.bs.modal', function (e){
    	var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要编辑的会员",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("不能同时编辑多个会员",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
            return false;
        }
        
    }); 
    $('#memberEditModal').on('shown.bs.modal', function (e) {
    	var checkedItems = inputChecked("table_list");
    	$('#memberAdd_dialog').empty();//销毁新增模态框（防止元素ID重复）
        $("#memberEdit_dialog").load("/html/member.html?t="+new Date().getTime()+" #memberEdit",function(){
        	 
        	/*$('#memberJoinTime').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                pickerPosition:"bottom-left"
            });*/
        	var id = checkedItems[0].getAttribute("data-id");
        	var orgid = checkedItems[0].getAttribute("orgid");
            getMemberById(Number(id),orgid); 
            memberUpdate(id,orgid); 
        });
    });
}
//新增保存
function addSave(){
	
    $("#member-add-btn").off("click").on("click",function(){
    	
    	if($("#orgid").val() === "-1" && isSuperAdmin()){
            $("#orgid").parents(".form-group").addClass("has-error").find(".help-block").text("请选择机构");
            return false;
        } else {
        	$("#orgid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	
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
        	 addRequest();
         }else{
        	 return false;
         }
    });
}
/**
 * 新增表单请求
 */
 function addRequest(){
     var param = $("#memberAddForm").serializeArray();
     
         $.ajax({
             url:"/member/new",
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
                 }
             }
         });
 }
 /**
  *  会员表单验证
  */
 function formValidate(){
	 
     $("#memberName").off("blur").on("blur",function(){
         var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入用户姓名");
         }else{
             $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
         }
     });
     $("#memberTel").off("blur").on("blur",function(){
         var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("手机号作为登录账号,请填写手机号");
         } else if (!/^[1]\d{10}$/.test(val)){
         	 $(this).parents(".form-group").addClass("has-error").find(".help-block").text("手机号码格式错误，请重新输入");
         } else {
        	 $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
         }
     });
     
     $("#memberEmail").off("blur").on("blur",function(){
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
     $("#memberJob").off("blur").on("blur",function(){
    	 var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入职位");
         }else{
             $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
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
 * 会员删除
 */
function deleteMember(){

	$("#member_del").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要删除的会员",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = Number(checkedItems[0].getAttribute("data-id"));
                    var orgid = checkedItems[0].getAttribute("orgid");
                    $.ajax({
                        url:"/member/del/"+_id+"?orgid=" + orgid,
                        type:"delete",
                        dataType:"json",
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
                        if(i == checkedItems.length-1){
                            str += _id;
                        }else{
                            str += _id + ",";
                        }
                    }
                    $.ajax({
                        url:"/member/del/batch/"+str,
                        type:"delete",
                        dataType:"json",
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
            layer.msg("请选择要发送的会员",2,{type:1,shade:false});
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
							layer.msg("此会员已激活",2,{type:0,shade:false});
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
 * 会员编辑，根据id查询当前会员
 * 
 * @param id
 */
function getMemberById(id, orgid){
	$.get("/member/findById/"+id+"?orgid=" + orgid, function(data){
		if(data.success){
			var result = data.result;
			var name = result.name;
			var gender = result.gender;
			var tel = result.tel;
			var email = result.email;
			var join_time = result.joinTime;
			var job = result.job;
			var corpName = result.corpName;
			var corp_intro = result.corpIntro;
			var website = result.website;
			$("#memberName").val(name);
			$("#memberTelEdit").val(tel);
			$("#memberEmail").val(email);
			$("#joinTimeEdit").val(join_time);
			$("#memberJob").val(job);
			$("#memberCorpNameEdit").val(corpName);
			$("#memberCorpIntroEdit").val(corp_intro);
			$("#memberCorpwebsiteEdit").val(website);
			if(gender == 1){
				$("#gender1").attr("checked","checked");
			}else{
				$("#gender0").attr("checked","checked");
			}
			
			loadCorp(orgid, result.corpId);
			
			loadGroup(orgid, result.groupId);
		}
	});
}
/**
 * 会员编辑 保存
 * @param id
 */
function memberUpdate(id, orgid){
    $("#member-edit-btn").on("click",function(){
        var name = trim($("#memberName").val());
        var gender = jQuery('input[type="radio"][name="gender"]:checked').val();
//        var tel = trim($("#memberTelEdit").val());
        var email = trim($("#memberEmail").val());
        var join_time = trim($("#joinTimeEdit").val());
        var job = trim($("#memberJob").val());
        var corpName = ($("#memberCorpNameEdit").val());
        var corp_intro = ($("#memberCorpIntroEdit").val());
        var website = ($("#memberCorpwebsiteEdit").val());
        var reg =  /^([a-zA-Z0-9_-]\.*)+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/; //邮箱正则验证
        var corpid = $("#corpid").val();
        var groupId = $("#groupId").val();
        if($("#memberName").val() === ""){
            $("#memberName").parents(".form-group").addClass("has-error").find(".help-block").text("请输入用户姓名");
            return false;
        } else if ($("#memberName").val().length > 15) {
        	$("#memberName").parents(".form-group").addClass("has-error").find(".help-block").text("姓名长度限制为15个字符");
        	$("#memberName").focus();
            return false;
        } else {
        	$("#memberName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
//        if($("#memberTelEdit").val() === ""){
//            $("#memberTelEdit").parents(".form-group").addClass("has-error").find(".help-block").text("请输入手机号码");
//            return false;
//        }else if(!/^[1]\d{10}$/.test($("#memberTelEdit").val())){
//        	$("#memberTelEdit").parents(".form-group").addClass("has-error").find(".help-block").text("手机号码格式错误，请重新输入");
//        	return false;
//        }else{
//        	$("#memberTelEdit").parents(".form-group").removeClass("has-error").find(".help-block").text("");
//        }
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
        
        
        if(corpid === ""){
        	$("#corpid").parents(".form-group").addClass("has-error").find(".help-block").text("请选择公司");
        	return false;
        } else {
        	$("#corpid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if(groupId === "" || groupId == "-1"){
        	$("#groupId").parents(".form-group").addClass("has-error").find(".help-block").text("请选择分组");
        	return false;
        } else {
        	$("#groupId").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }

        $.ajax({
            url:'/member/'+id,
            type:"post",
            dataType:"json",
            data:{
                _method: 'PUT',
                name: name,
                gender: gender,
//                tel: tel,
                email: email,
                joinTime: join_time,
                job: job,
                corpName: corpName,
                corpIntro: corp_intro,
                website: website,
                orgid:orgid,
                corpId:corpid,
                groupId:groupId
            },
            success:function(data){
                if(data.success){
                	layer.msg("保存成功",2,{type:1,shade:false});
//                    currentPage = 1;
                    memberRequest(member.getCache(),member.getRows());
                    $('#memberEditModal').modal('hide');
                }
            }
        });
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

    $('#member-add').popover({
        html:true,
        trigger:'click',
        placement:"bottom",
        title:"会员信息",
        content:function(){
        },
        container:"body"
    });
    $(".srh-input").tooltip({
        trigger: 'focus',
        placement: "bottom",
        title: "请输入姓名/手机号码"
    });

});
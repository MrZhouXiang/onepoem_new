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
 * 分组搜索 点击和按钮事件
 */
function memberSearch(){

    $(".srh-input").keyup(function(e){
        var e = e || event;
        var keycode = e.which || e.keyCode;

        keyword = $(".srh-input").val();

        if(keyword === ""){
            column = "tel";
            tooltip(".srh-input","请输入分组名称");
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
 * 分组列表，请求
 * @param mc
 * @param numberOfRow
 */
function memberRequest(mc,numberOfRow){
	$("#allcheck").attr("checked", false);
	 var sfilter = $("#js_organization_menu").find(".cell .selected");
	 var orgId = Number(sfilter.attr("val"));

	var keyword = $(".srh-input").val();
	
    $.ajax({
        url:'/group/getGroupList/',
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
           // filter:filterValue //分组激活状态过滤器
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
                }
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
 * 分组弹出详细
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
            title:"分组信息",
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
	//新增modal
    $('#memberAddModal').on('shown.bs.modal', function () {
    	$("#memberEdit_dialog").empty();
        $("#memberAdd_dialog").load("/html/group.html?t="+new Date().getTime()+" #add",function(){
        	loadSelect();
        	addSave();
            formValidate();
        });
    });
  //分组模态编辑
    $('#memberEditModal').on('show.bs.modal', function (e){
    	var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要编辑的分组",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("不能同时编辑多个分组",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
            return false;
        }
    }); 
    $('#memberEditModal').on('shown.bs.modal', function (e) {
    	$("#memberAdd_dialog").empty();
    	var checkedItems = inputChecked("table_list");
        $("#memberEdit_dialog").load("/html/group.html?t="+new Date().getTime()+" #edit",function(){
        	 
        	var id = checkedItems[0].getAttribute("data-id");
            getMemberById(Number(id)); 
            memberUpdate(id); 
            formValidate();
        });
    });
}
//新增保存
function addSave(){
	
    $("#member-add-btn").off("click").on("click",function(){
    	if($("#orgid").val() === "" && isSuperAdmin()){
            $("#orgid").parents(".form-group").addClass("has-error").find(".help-block").text("请选择机构");
            return false;
    	}else{
    		$("#orgid").parents(".form-group").addClass("has-error").find(".help-block").text("");
    	}
    	
    	if($("#name").val() === ""){
            $("#name").parents(".form-group").addClass("has-error").find(".help-block").text("请输入分组名称");
            $("#name").focus();
            return false;
        } else if ($("#name").val().length > 15) {
        	$("#name").parents(".form-group").addClass("has-error").find(".help-block").text("分组名称长度限制为15个字符");
        	$("#name").focus();
            return false;
        } else{
        	$("#name").parents(".form-group").addClass("has-error").find(".help-block").text("");
        }
    	
    	 addRequest();
    });
}
/**
 * 新增表单请求
 */
 function addRequest(){
     var param = $("#memberAddForm").serializeArray();
     
     $.ajax({
         url:"/group/add",
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
  *  分组表单验证
  */
 function formValidate(){
     $("#name").off("blur").on("blur",function(){
         var val = $(this).val();
         if(trim(val) === ""){
             $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入分组名称");
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
 * 分组删除
 */
function deleteMember(){

	$("#member_del").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要删除的分组",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = Number(checkedItems[0].getAttribute("data-id"));
                    $.ajax({
                        url:"/group/delete",
                        dataType:"json",
                        data:{
                        	ids:_id
                        },
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                            	memberRequest(member.getCache(),member.getRows());
                            } else {
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
                        url:"/group/delete",
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
                            } else {
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
            layer.msg("请选择要发送的分组",2,{type:1,shade:false});
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
							layer.msg("此分组已激活",2,{type:0,shade:false});
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
 * 分组编辑，根据id查询当前分组
 * 
 * @param id
 */
function getMemberById(id){
	$.get("/group/getGroupById?groupId=" + id,function(data){
		if(data.success){
			var result = data.result;
			$("#name").val(result.name);
		}
	});
}
/**
 * 分组编辑 保存
 * @param id
 */
function memberUpdate(id){
    $("#member-edit-btn").on("click",function(){
    	var name = $("#name").val();
    	
    	if($("#orgid").val() === "" && isSuperAdmin()){
            $("#orgid").parents(".form-group").addClass("has-error").find(".help-block").text("请选择机构");
            return false;
    	}else{
    		$("#orgid").parents(".form-group").addClass("has-error").find(".help-block").text("");
    	}
    	
    	if($("#name").val() === ""){
            $("#name").parents(".form-group").addClass("has-error").find(".help-block").text("请输入分组名称");
            $("#name").focus();
            return false;
        } else if ($("#name").val().length > 15) {
        	$("#name").parents(".form-group").addClass("has-error").find(".help-block").text("分组名称长度限制为15个字符");
        	$("#name").focus();
            return false;
        } else {
        	$("#name").parents(".form-group").addClass("has-error").find(".help-block").text("");
        }
    	
        $.ajax({
            url:'/group/edit',
            type:"post",
            dataType:"json",
            data:{
            	id:id,
                name:name
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
 * 加载下拉框
 */
function loadSelect()
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
}

$(function(){
    userMenu();
    checkAllEvent();
    memberList();

    $('#member-add').popover({
        html:true,
        trigger:'click',
        placement:"bottom",
        title:"分组信息",
        content:function(){
        },
        container:"body"
    });
    $(".srh-input").tooltip({
        trigger: 'focus',
        placement: "bottom",
        title: "请输入分组名称"
    });

});
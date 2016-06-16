/**
 * Created by AI-MASK on 14-6-16.
 */
var currentPage = 1; //默认当前页

var notice = (function($){
    var mc = new DataCache();
    var numberOfRow = 15; //一页条数

    var list =  function(){
    	$("#allcheck").attr("checked", false);
    	
        var keyword = $(".srh-input").val();

        var sfilter = $("#js_organization_menu").find(".cell .selected");
    	var orgId = Number(sfilter.attr("val"));
    	
    	var stype = $("#js_status_menu").find(".cell .selected");
    	var status = Number(stype.attr("val"));
        
        $.ajax({
            url:'/user/getUserList/' + currentPage,
            type:'post',
            dataType:'json',
            data:{
                keyword: keyword,
                num: numberOfRow
            },
            success:function(data){
                if(data.success){
                    mc.clear();
                    var result = data.result;

                    var tbody = get("table_list").getElementsByTagName("tbody");
                    if(tbody.length > 0){
                        document.getElementById("table_list").removeChild(tbody[0]);
                    }
                    tbody[0] = document.createElement("tbody");
                    document.getElementById("table_list").appendChild(tbody[0]);
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < result.length; i++) {
                        var obj = result[i];

                        mc.set(obj.notId,obj); // 缓存

                        var tr = renderTable(obj);
                        fragment.appendChild(tr);
                    }
                    tbody[0].appendChild(fragment)
                    var opt = {
                        id:'#pagebar',
                        totalPages:data.totalPages,
                        currentPage:data.curPage,
                        onPageChanged:function(e,oldPage,newPage){
                            console.log("Current page changed, old: "+oldPage+" new: "+newPage);
                            currentPage = newPage;
//                                 var s = (curPage - 1)*numberOfPages;
                            notice.findList();
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
                }
                
                $('input').iCheck({
                    handle: 'checkbox',
                    checkboxClass: 'icheckbox_minimal'
                });
            }
        });
    };
    var getCache = function(){
        return mc;
    };
    return {
        findList:list,
        getCache:getCache
    }
})(jQuery);
/**
 * 公告列表
 */
function noticeList(){
    //公告新增
    $('#myModal').on('show.bs.modal', function (e) {
    	var checkedItems = inputChecked("table_list");
    	if(checkedItems.length < 1){
    		layer.msg("请选择订单",2,{type:1,shade:false});
    		return false;
    	}
    	if(checkedItems.length > 1){
    		layer.msg("不能同时选择多个订单",2,{type:1,shade:false});
    		return false;
    	}
    	var status = checkedItems[0].getAttribute("data-status");
    	if(status != 2)
    	{
    		layer.msg("不是待发货状态",2,{type:1,shade:false});
    		return false;
    	}
    	$("#noticeEdit_dialog").empty();
        $("#noticeAdd_dialog").load("/html/order.html?t="+new Date().getTime()+" #noticeAdd",function(){
        	var id = checkedItems[0].getAttribute("data-id");
			formValidate();
			newNotice(id);
        	
        	//加载机构下拉框
           // loadOrg();
        	
           /* var obj = {
                fileInput:$("#fileupload"),
                context:$("#files"),
                hiddenInput:$("#fileName"),
                progress:'progress'
            };
           infoUpload(obj); //封面上传*/

            /*$("#coverSwitch").on('change',function(){
                var ischeck = this.checked;
                if(ischeck){
                    $(this).parent().addClass('hide').next().removeClass("hide");
                }
            });*/
            
            //loadGroup();
		    
        });
    });
    //公告编辑
    $('#noticeEditModal').on('show.bs.modal', function (e) {
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要编辑的公告",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("不能同时编辑多条公告",2,{type:1,shade:false});
            return false;
        }
        $("#noticeAdd_dialog").empty();
        $("#noticeEdit_dialog").load("/html/order.html?t="+new Date().getTime()+" #noticeEdit",function(){
            var id = checkedItems[0].getAttribute("data-id");
            getNoticeById(Number(id)); //
            noticeUpdate(id); //
            var obj = {
                fileInput:$("#fileupload1"),
                context:$("#files1"),
                hiddenInput:$("#fileName1"),
                progress:'progress1'
            };

            formValidate();
            
            infoUpload(obj); //封面上传
        });
    });
    notice.findList();
    deleteNotice();

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
            _input.setAttribute('data-orgId',data.orgid);
            _input.setAttribute('data-status',data.status);
            td.appendChild(_input);
            td.style.textAlign = "center";
        }else{
            var con = data[type];
            switch(type){
                case "date":
                    var datestr = con;
                    var date = datestr.substring(5,10);

                    td.innerHTML = (date+"日").replace("-","月");
                    break;
                default :
                    td.innerHTML = con.replace(/[\r\n]/g,"");//去换行
                    td.title = con;
                    break;
            }
        }
    }
    return tr;
}
/**
 * 公告新增,，保存
 */
function newNotice(id){
    $("#notice_new_btn").on("click",function(){
        var title = trim($("#noticeTitle").val());
        var content = trim($("#noticeContent").val());
        
        if(title === ""){
            $("#noticeTitle").parents(".form-group").addClass("has-error").find(".help-block").text("请填写标题");
            $("#noticeTitle").focus();
            return;
        } else if (title.length > 35){
        	$("#noticeTitle").parents(".form-group").addClass("has-error").find(".help-block").text("标题长度限制为35个字符");
            $("#noticeTitle").focus();
            return;
        }else{
        	$("#noticeTitle").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }

        if(content === ""){
            $("#noticeContent").parents(".form-group").addClass("has-error").find(".help-block").text("请填写内容");
            $("#noticeContent").focus();
            return;
        } else if (content.length > 300){
        	$("#noticeContent").parents(".form-group").addClass("has-error").find(".help-block").text("内容长度限制为300个字符");
            $("#noticeContent").focus();
            return;
        } else{
        	$("#noticeContent").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }

        $.ajax({
            url:'order/addLogistics',
            type:"POST",
            dataType:"json",
            data:{
                orderId:id,
                name:title,
                code:content
            },
            success:function(data){
                if (data.success) {
                	
                	layer.msg("新增成功",2,{type:1,shade:false});
                    currentPage = 1;
                    notice.findList();
                    $('#myModal').modal('hide');
                }
        }
        });
    });
}
/**
 * 表单内容验证
 */
function formValidate(){
    $("#noticeTitle").off("blur").on("blur",function(){
        var val = $(this).val();
        if(trim(val) === ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请填写标题");
        } else {
            $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#noticeContent").off("blur").on("blur",function(){
        var val = $(this).val();
        if(trim(val) === ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请填写内容");
        }else{
            $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
}  
/**
 * 公告编辑，根据id查询当前公告
 * @param id
 */
function getNoticeById(id){
    var url = "/notice/get/"+id;
    $.get(url,function(data){
        if(data.success){
            var result = data.result;
            var title = result.title;
            var content = result.content;
            var cover = result.cover;
            var filePath = result.coverUrl;
            $("#noticeTitle").val(title);
            $("#noticeContent").val(content);
            $("#fileName1").val(cover);
            if(cover === ""){
                $("#files1").find("img").hide();
                $("#files1").find("i").show();
            }else{
            	if(cover){
	                //$("#files1").find("img").attr("src","http://localhost:8080/assets/img/noti/"+cover).show();
	                $("#files1").find("img").attr("src",filePath  +cover).show();
	                $("#files1").find("a").attr("href",filePath   +cover).show();
	                $("#files1").find("i").hide();
            	}
            }
        }
    });
}
/**
 * 公告编辑
 * @param id
 */
function noticeUpdate(id){
    $("#notice_Edit_btn").on("click",function(){
        var title = trim($("#noticeTitle").val());
        var content = trim($("#noticeContent").val());
        var cover = $("#fileName1").val();
        
        if(title === ""){
            $("#noticeTitle").parents(".form-group").addClass("has-error").find(".help-block").text("请填写标题");
            return;
        } else if (title.length > 35){
        	$("#noticeTitle").parents(".form-group").addClass("has-error").find(".help-block").text("标题长度限制为35个字符");
            $("#noticeTitle").focus();
            return;
        }else{
        	$("#noticeTitle").parents(".form-group").addClass("has-error").find(".help-block").text("");
        }
        if(content === ""){
            $("#noticeContent").parents(".form-group").addClass("has-error").find(".help-block").text("请填写内容");
            return;
        } else if (content.length > 300){
        	$("#noticeContent").parents(".form-group").addClass("has-error").find(".help-block").text("内容长度限制为300个字符");
            $("#noticeContent").focus();
            return;
        } else{
        	$("#noticeContent").parents(".form-group").addClass("has-error").find(".help-block").text("");
        }
        
        $.ajax({
            url:'/notice/'+id,
            type:"post",
            dataType:"json",
            data:{
                _method: 'PUT',
                title:title,
                content:content,
                cover:cover
            },
            success:function(data){
                if(data.success){
                	layer.msg("保存成功",2,{type:1,shade:false});
//                    currentPage = 1;
                    notice.findList();
                    $('#noticeEditModal').modal('hide');
                }
            }
        })
    });
}

function deleteNotice(){

    $("#notice_del").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要删除的公告",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = Number(checkedItems[0].getAttribute("data-id"));
                    $.ajax({
                        url:"/notice/del/"+_id,
                        type:"delete",
                        dataType:"json",
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                            	notice.findList();
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
                        url:"/notice/del/batch/"+str,
                        type:"delete",
                        dataType:"json",
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                                for (var i = 0; i < checkedItems.length; i++) {
                                    var obj1 = checkedItems[i];
                                    $(obj1).parents("tr").remove();
                                }
                                notice.findList();
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
 * 公告发送
 */
function noticeSend(){
	//	AV.initialize(leancloud_config.appid, leancloud_config.appkey);
	/*
    try{
        var sock = new SockJS('http://shanghui.puyuntech.com:7075/chamber');
    }catch(err){
        throw new Error("不能连接服务器,请检查");
        return;
    }

    console.log(sock);

    sock.onopen = function() {
        console.log('socketJs open');
        sock.send("{\"type\":\"\"}");
    };
    sock.onmessage = function(e) {
        console.log('message', e.data);
        var obj = JSON.parse(e.data);
        if(obj.success){
            layer.msg("公告发送成功",2,{type:1,shade:false});
        }
    };
    sock.onclose = function() {
        console.log('socketJs close');
    };
*/
    $("#notice_send").on('click',function(){

    	
//        var content = "{\"type\":\"notice\",\"msg\":[{\"title\":\"关于会费催缴的通知\",\"content\":\"请还没有交钱的赶紧交上来\"}]}";
//        var info = "{\"type\":\"info\",\"msg\":[{\"title\":\"天气不粗\",\"catogery\":\"休闲时光\",\"cover\":\"/img/info/sun.png\",\"summary\":\"这是一个温暖祥和的午后...\",\"url\":\"/info/2014061801\"}]}";
    	
        var input = inputChecked("table_list");
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要发送的公告",2,{type:1,shade:false});
        	return false;
        }
        if(input.length > 1){
            layer.msg("公告不支持多条推送",2,{type:1,shade:false});
            return;
        }
        var obj = input[0];
        var mid = $(obj).attr("data-id");
        var orgId = $(obj).attr("data-orgId");
        var status = $(obj).attr("data-status");
        var send = function (index){
        	var noticeObj = notice.getCache();
        	var row = noticeObj.get(mid);
        	if(typeof row === "undefined") return;
        	var cover = row.cover === null?"":row.cover;
        	var _msg = {
        			"action":"com.puyuntech.yba.action.CUSTOM_RECEIVER",
        			"aps" : { "alert" : row.title },
        			type:"1",
        			msg:
        			{
        				msgId:row.notId,
        				orgId:orgId
        			}
        	};
        	
        	//var msgs = JSON.stringify(_msg);//"{\"type\":\"notice\",\"msg\":["+msg+"]}";
        	
        	$.ajax({
        		url:"/notice/getDeviceIdList/",
        		type:"post",
        		dataType:"json",
        		data:{
        			noticeId:mid,
        			orgId:orgId
        		},
        		success:function(data){
        			if(data.success){
        				//var str = JSON.stringify(data.result);
        				//alert(str);
        				//str = str.substring(1,str.length-1);
        				
    					var ss = data.result;//str.split(",");

    					var ids = "";
    					for (var i = 0; i < ss.length ; i++)
    					{
    						ids += ('"' + ss[i] + '"' + ",");
    						if((i+1) % 50 == 0)//分批次发送，每次发送50条
    						{
    							ids = ids.substring(0, ids.length-1);
    							var cql = "select * from _Installation where installationId in("+ids+") or deviceToken in("+ids+")";
    	        				AV.Push.send({cql: cql, data: _msg });
    							ids = "";
    						} else if ((i+1) == ss.length)
    						{
    							ids = ids.substring(0, ids.length-1);
    							var cql = "select * from _Installation where installationId in("+ids+") or deviceToken in("+ids+")";
    	        				AV.Push.send({cql: cql,data: _msg});
    							ids = "";
    						}
    					}
        				
        				 layer.msg("发送成功",2,{type:1,shade:false});
        			}
        		}
        	});
        	//sock.send(_msgs);
        	noticeStatus(mid);
        };
        if (status == "sent") {
        	layer.confirm("该公告已发送，确定要重新发送吗？", send);
        	//layer.msg("该公告已发送，不能重新发送！",2,{type:1,shade:false});
        } else {
        	send();
        }
    });
}


/**
 * 修改公告状态
 * @param id
 */
function noticeStatus(id){
    $.ajax({
        url:"/notice/sts/"+id,
        type:"post",
        dataType:"json",
        data:{
            _method: 'PUT'
        },
        success:function(data){
            if(data.success){
                notice.findList();
            }
        }
    })
}
/**
 * 公告搜索
 */
function noticeSearch(){

    $(".srh-input").keyup(function(e){
        var e = e || event;
        keycode = e.which || e.keyCode;
        var keyword = $(".srh-input").val();
        if(keyword === ""){
            tooltip(".srh-input","请输入关键字查询");
        } else {
        	$(".srh-input").tooltip('destroy');
        }
        $("#srh-btn").trigger("click");
    });

    $("#srh-btn").on("click",function(){

        notice.findList();
    });
}

/**
 * 菜单
 */
function menu(){
	$("#js_status_menu").hover(function(){
		$(this).find(".context-menu").show();
	},function(){
		$(this).find(".context-menu").hide();
	});
	
	$("#js_status_menu").on("click",'.cell a',function(){
        var $that = $(this);
        if(!$that.hasClass("selected")){
            $that.addClass("selected").siblings().removeClass("selected");
        }
        currentPage = 1;
        notice.findList();
    });
	
	
	//if(isSuperAdmin())
	//{
	//	loadOrgMenu();
	//}
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
        notice.findList();

    	//$("#currentOrgText").text($that.text());
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

/**
 * 加载分组
 */
function loadGroup()
{
	$("#js_group_menu").hover(function(){
	    $(this).find(".context-menu").show();
	},function(){
	    $(this).find(".context-menu").hide();
	});

	$("#js_group_menu").on("click",'.cell a',function(){
		clickGroupOption(this);
	});
	
	loadGroupOption(-1);
}

/**
 * 分组项点击事件
 */
function clickGroupOption(t)
{
	var $that = $(t);
    if($that.attr("val") == "-1"){//公共
    	$that.addClass("selected");
    	$("#groupMenu .cell a[val!='-1']").removeClass("selected");
	}else{
		if(!$that.hasClass("selected")){
			$that.addClass("selected");
		}else{
			$that.removeClass("selected");
		}
		if($("#groupMenu .cell a").hasClass("selected")){
			$("#groupMenu .cell a[val='-1']").removeClass("selected");
		}else{
			$("#groupMenu .cell a[val='-1']").addClass("selected");
		}
	}
    
    var groupIds = "";
    var text = "";
    $("#groupMenu .cell a[class='selected']").each(function(i, t){
    	groupIds += $(t).attr("val") + ",";
    	text += $(t).text() + ",";
    });

    $("#groupIds").val(groupIds.substr(0, groupIds.length - 1));
    $("#groupText").text(text.substr(0, text.length - 1));
}

function loadGroupOption(orgId)
{
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
        		for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    menu.append('<a  menu="groupId" val="'+ obj.id +'"><span><s></s>'+ obj.name +'</span></a>');
        		}
	    	}
	    }
	});	
}

/**
 * 所在机构下拉框选择事件处理
 * @param t
 */
function clickOrgItem(t)
{
	var text = t.innerText;
	var val = $(t).attr("val");
	$("#orgText").text(text);
	$("#orgid").val(val);
	
	if(val !="" && val != "-1"){
		$("#orgid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
	}
	
	//更新分组
	loadGroupOption(val);
}

function initDownLoad()
{
	$("#downloadPhoto").on('click',function(){	
		var checkedItems = inputChecked("table_list");
		 if(checkedItems.length < 1){
	            layer.msg("没有选择照片",2,{type:1,shade:false});
	        	return false;
	        }
	        if(checkedItems.length > 1){
	            layer.msg("不能多选",2,{type:1,shade:false});
	            return false;
	        }
		var id = checkedItems[0].getAttribute("data-id");
		$("#downloadFrame").attr("src", "/order/downloadPhoto?id="+id);
	});
}
	
$(function(){
    userMenu();
    checkAllEvent();
    noticeList();
    noticeSend();
    noticeSearch();
    initDownLoad();
    menu();//选择机构菜单
    $(".srh-input").tooltip({
        trigger: 'focus',
        placement: "bottom",
        title: "支持手机号模糊查询"
    });
//    
});
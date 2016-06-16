/**
 * Created by AI-MASK on 14-6-16.
 */
var currentPage = 1; //默认当前页

var message = (function($){
    var mc = new DataCache();
    var numberOfRow = 15; //一页条数

    var list =  function(){
    	$("#allcheck").attr("checked", false);

        var keyword = $(".srh-input").val();

        var sfilter = $("#js_organization_menu").find(".cell .selected");
    	var orgId = sfilter.attr("val");
    	
        $.ajax({
            url:'/message/doSearch/'+ currentPage,
            type:'post',
            dataType:'json',
            data:{
                keyword: keyword,
                num: numberOfRow,
                orgId : orgId
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

                        mc.set(obj.msgId,obj); // 缓存

                        var tr = renderTable(obj);
                        fragment.appendChild(tr);
                    }
                    tbody[0].appendChild(fragment);
                    var opt = {
                        id:'#pagebar',
                        totalPages:data.totalPages,
                        currentPage:data.curPage,
                        onPageChanged:function(e,oldPage,newPage){
                            console.log("Current page changed, old: "+oldPage+" new: "+newPage);
                            currentPage = newPage;
//                                 var s = (curPage - 1)*numberOfPages;
                            message.findList();
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
                    layer.msg("对不起，没有找到匹配结果",2,{type:0,shade:false});
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
    };
})(jQuery);
/**
 * 资讯列表
 */
function messageList(){
  
    //资讯新增模态
    $('#messageAddModal').on('shown.bs.modal', function (e) {
    	$("#messageEdit_dialog").empty();
        $("#messageAdd_dialog").load("/html/information.html?t="+new Date().getTime()+" #messageAdd",function(){
            $('#messageAddModal').show();

            var editor = {};/*new Simditor({
                //textarea: $('#infoContent'),
                placeholder:"",
                upload:{
                    url: '/controller/upload/1',
                    params: null,
                    connectionCount: 1,
                    leaveConfirm: '正在上传文件，如果离开上传会自动取消'
                }
            });*/
            newMessage(editor);
            var obj = {
                fileInput:$("#fileupload"),
                context:$("#files"),
                hiddenInput:$("#fileName"),
                progress:'progress',
                uploaddone:function(){
                    $("#fileName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
                }
            };
            infoUpload(obj); //封面上传
            
            infoValidate();
            //加载机构下拉框
            loadOrg();
            
            loadGroup();
        });
    });

    //资讯编辑
    $('#messageEditModal').on('show.bs.modal', function (e) {
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要编辑的资讯",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("不能同时编辑多条资讯",2,{type:1,shade:false});
            return false;
        }
        $("#messageAdd_dialog").empty();
        //资讯更新
        $("#messageEdit_dialog").load("/html/information.html?t="+new Date().getTime()+" #messageEdit",function(){
            $('#messageEditModal').show();

            var editor = {};/*new Simditor({
                textarea: $('#infoContent'),
                placeholder:"",
                upload:{
                    url: '/controller/upload/1',
                    params: null,
                    connectionCount: 1,
                    leaveConfirm: '正在上传文件，如果离开上传会自动取消'
                }
            });*/
            var obj = {
                fileInput:$("#fileupload1"),
                context:$("#files1"),
                hiddenInput:$("#fileName"),
                progress:'progress1',
                uploaddone:function(){
                    $("#fileName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
                }
            };
            infoUpload(obj); //封面上传

            var id = checkedItems[0].getAttribute("data-id");
            getMessageById(Number(id),editor); //
            messageUpdate(id,editor); //
            
            infoValidate();
        });
    });
    
    message.findList();
    deleteMessage();

    informationSend();
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
            _input.setAttribute('data-id',data.msgId);
            _input.setAttribute('data-orgId',data.orgid);
            _input.setAttribute('data-status',data.status);
            td.appendChild(_input);
            td.style.textAlign = "center";
        }else{
            switch(type){
                case "status":
                    td.innerHTML = data[type] == "new"?"<div class='sts-icon' title='未发送'></div>":"<div class='sts-icon active' title='已发送'></div>";
                    break;
                case "date":
                    var datestr = data[type];
                    var date = datestr.substring(5,10);

                    td.innerHTML = (date+"日").replace("-","月");
                    break;
                default :
                    td.innerHTML = data[type].replace(/[\r\n]/g,"");//去换行
                    td.title = data[type];
                    break;
            }
        }
    }
    return tr;
}
/**
 * 资讯新增 保存
 */
function newMessage(editor){

    $("#message_new_btn").on("click",function(){

        var title = trim($("#infoTitle").val());
        var summary = trim($("#infoSummary").val());
        var content = $("#infoContent").val();//editor.getValue();
        var cover = $("#fileName").val();
        var orgid = $("#orgid").val();
        
        if(orgid === "" && isSuperAdmin())
        {
            $("#orgid").parents(".form-group").addClass("has-error").find(".help-block").text("请选择机构");
            return;
        }else{
        	$("#orgid").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if(title === ""){
            $("#infoTitle").parents(".form-group").addClass("has-error").find(".help-block").text("请填写标题");
            $("#infoTitle").focus();
            return;
        } else if (title.length > 35){
        	$("#infoTitle").parents(".form-group").addClass("has-error").find(".help-block").text("标题长度限制为35个字符");
            $("#infoTitle").focus();
            return;
        } else {
        	 $("#infoTitle").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if(cover === ""){
            $("#fileName").parents(".form-group").addClass("has-error").find(".help-block").text("请上传资讯封面");
            $("#fileName").focus();
            return;
        } else {
        	$("#fileName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if(summary === ""){
            $("#infoSummary").parents(".form-group").addClass("has-error").find(".help-block").text("请填写概述");
            $("#infoSummary").focus();
            return;
        } else if (summary.length > 200){
        	$("#infoSummary").parents(".form-group").addClass("has-error").find(".help-block").text("概述长度限制为200个字符");
            $("#infoSummary").focus();
            return;
        } else {
        	 $("#infoSummary").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if(content === ""){
            //editor.focus();
            $("#messageAddModal").find(".modal-body").scrollTop(350);
            $("#infoContent").parents(".form-group").addClass("has-error").find(".help-block").text("请填写内容");
            $("#infoContent").focus();
            return;
        } else if (content.length > 6000){
        	$("#infoContent").parents(".form-group").addClass("has-error").find(".help-block").text("概述长度限制为6000个字符");
            $("#infoContent").focus();
            return;
        } else {
        	 $("#infoContent").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        var groupIds = $("#groupIds").val();
        
        $.ajax({
            url:'/message/new',
            type:"post",
            dataType:"json",
            data:{
                title:title,
                cover:cover,
                summary:summary,
                content:content,
                orgid : orgid,
                groupIds : groupIds
            },
            success:function(data){
                if(data.success){
                	layer.msg("新增成功",2,{type:1,shade:false});
                    currentPage = 1;
                    message.findList();
                    $('#messageAddModal').modal('hide');
                }
            }
        });
    });
}
/**
 * 资讯表单新增验证
 */
function infoValidate(){

    $("#infoTitle").blur(function(){
        var title = $(this).val();
        if(title == ""){
        	$(this).parents(".form-group").addClass("has-error").find(".help-block").text("请填写标题");
        } else {
        	$(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#fileName").blur(function(){
        var fileName = $(this).val();
        if(fileName == ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请上传资讯封面");
        } else {
        	$(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#infoSummary").blur(function(){
        var summary = $(this).val();
        if(summary == ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请填写概述");
        } else {
        	$(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#infoContent").blur(function(){
    	var val = $(this).val();
    	if(val == ""){
    		$(this).parents(".form-group").addClass("has-error").find(".help-block").text("请填写资讯内容");
    	} else {
    		$(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	}
    });


}
/**
 * 编辑填充
 * @param id
 * @param editor
 */
function getMessageById(id,editor){
    $.get("/message/info/"+id,function(data){
        if(data.success){
            var result = data.result;
            var title = result.title;
            var content = result.content;
            var summary = result.summary;
            var cover = result.cover;
            var url = result.url;
            var cateId = result.cateId;
            switch(cateId){
            case 1:
            	$("#cate1").attr("selected","selected");
                break;
            case 2:
            	$("#cate2").attr("selected","selected");
                break;
            case 3:
            	$("#cate3").attr("selected","selected");
                break;
            case 4:
            	$("#cate4").attr("selected","selected");
                break;
            case 5:
            	$("#cate5").attr("selected","selected");
                break;
            default :
            }
            $("#infoTitle").val(title);
            $("#infoSummary").val(summary);
            $("#fileName").val(cover); //隐藏域
            if(cover)
        	{
	            $("#files1").find("img").attr("src",url+cover).show();
	            $("#files1").find("a").attr("href",url+cover).show();
	            $("#files1").find("i").hide();
        	}
            //editor.setValue(content);
            $("#infoContent").val(content);
        }
    });
}
/**
 * 资讯更新
 * @param id
 * @param editor
 */
function messageUpdate(id,editor){
    $("#message_edit_btn").on("click",function(){
        var title = trim($("#infoTitle").val());
        var cover = $("#fileName").val();
        var summary = trim($("#infoSummary").val());
        var content = $("#infoContent").val();//editor.getValue();
        var cateId = jQuery("#infoEditCategory").val(); //获取下拉列表选中项的value
        
        if(title === ""){
            $("#infoTitle").parents(".form-group").addClass("has-error").find(".help-block").text("请填写标题");
            return;
        } else if (title.length > 35){
        	$("#infoTitle").parents(".form-group").addClass("has-error").find(".help-block").text("标题长度限制为35个字符");
            $("#infoTitle").focus();
            return;
        } else {
        	 $("#infoTitle").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if(cover === ""){
            $("#fileName").parents(".form-group").addClass("has-error").find(".help-block").text("请上传资讯封面");
            return;
        } else {
        	$("#fileName").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        if(summary === ""){
            $("#infoSummary").parents(".form-group").addClass("has-error").find(".help-block").text("请填写概述");
            return;
        } else if (summary.length > 200){
        	$("#infoSummary").parents(".form-group").addClass("has-error").find(".help-block").text("概述长度限制为200个字符");
            $("#infoSummary").focus();
            return;
        } else {
        	 $("#infoSummary").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        
        if(content === ""){
            $("#infoContent").parents(".form-group").addClass("has-error").find(".help-block").text("请填写内容");
            $("#infoContent").focus();
            return;
        } else if (content.length > 6000){
        	$("#infoContent").parents(".form-group").addClass("has-error").find(".help-block").text("概述长度限制为6000个字符");
            $("#infoContent").focus();
            return;
        } else {
        	 $("#infoContent").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
        
        $.ajax({
            url:'/message/'+id,
            type:"post",
            dataType:"json",
            data:{
                _method: 'PUT',
                summary:summary,
                cover:cover,
                title:title,
                content:content,
                cateId:cateId
            },
            success:function(data){
                if(data.success){
                	layer.msg("保存成功",2,{type:1,shade:false});
//                    currentPage = 1;
                    message.findList();
                    $('#messageEditModal').modal('hide');
                }
            }
        });
    });
}

function deleteMessage(){

    $("#notice_del").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要删除的资讯",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = Number(checkedItems[0].getAttribute("data-id"));
                    $.ajax({
                        url:"/message/del/"+_id,
                        type:"delete",
                        dataType:"json",
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                            	message.findList();
//                                layer.msg('删除成功'); //风格二
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
                        url:"/message/del/batch/"+str,
                        type:"delete",
                        dataType:"json",
                        success:function(data){
                            if(data.success){
                            	layer.msg("删除成功",2,{type:1,shade:false});
                                for (var i = 0; i < checkedItems.length; i++) {
                                    var obj1 = checkedItems[i];
                                    $(obj1).parents("tr").remove();
                                }
//                                layer.msg('删除成功'); //风格二
                                message.findList();
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
 * 资讯发送
 */
function informationSend(){
	AV.initialize(leancloud_config.appid, leancloud_config.appkey);
    /*try{
        var sock = new SockJS('http://shanghui.puyuntech.com:7075/chamber');
    }catch(err){
        throw new Error("不能连接服务器,请检查"+err);
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
            layer.msg("资讯发送成功",2,{type:1,shade:false});
        }
    };
    sock.onclose = function() {
        console.log('socketJs close');
    };*/
	
	
    /**
     * 资讯推送
     */
    $("#message_send").on('click',function(){
//        var info = "{\"type\":\"info\",\"msg\":[{\"title\":\"天气不粗\",\"title\":\"休闲时光\",\"category\":\"\",\"cover\":\"/assets/img/info/\",\"summary\":\"这是一个温暖祥和的午后...\",\"url\":\"/message/get/skdflsdf\"}]}";

        var input = inputChecked("table_list");
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要发送的资讯",2,{type:1,shade:false});
        	return false;
        }
        if (input.length === 1) {
            //for (var i = 0; i < input.length; i++) {
                var obj = input[0];
                var msgId = $(obj).attr("data-id");
                var orgId = $(obj).attr("data-orgId");
                var status = $(obj).attr("data-status");
                var send = function (index){
	                var msgObj = message.getCache();
	                var row = msgObj.get(msgId);
	                var _msg = {
	                	"action":"com.puyuntech.yba.action.CUSTOM_RECEIVER",
		            	"aps" : { "alert" : row.title },
	                     type:"2",
	                     msg:
	                     {
	                        "msgId":row.msgId,
	                        "orgId":orgId
	                     }
	                };
		            //}
		            
		            //_msg = JSON.stringify(_msg);
		
		            $.ajax({
		                url:"/message/getDeviceIdList/",
		                type:"post",
		                dataType:"json",
		                data:{
		                	msgId:msgId,
		                    orgId:orgId
		                },
		                success:function(data){
		                    if(data.success){
		                    	var ss = data.result;
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
		            
		            messageStatus(msgId);
                };
                if (status == "sent") {
                	layer.confirm("该资讯已发送，确定要重新发送吗？", send);
                	//layer.msg("该资讯已发送，不能重新发送！",2,{type:1,shade:false});
                } else {
                	send();
                }
        } else {
            layer.msg("资讯不支持多条推送",2,{type:1,shade:false});
            return;
        }
        //sock.send(msgs);
    });
}
/**
 * 修改资讯状态
 * @param id
 */
function messageStatus(id){
    $.ajax({
        url:"/message/sts/"+id,
        type:"post",
        dataType:"json",
        data:{
            _method: 'PUT'
        },
        success:function(data){
            if(data.success){
            	message.findList();
            }
        }
    });
}
/**
 * 资讯搜索
 */
function messageSearch(){

    $(".srh-input").keyup(function(e){
        var e = e || event;
        keycode = e.which || e.keyCode;
        var keyword = $(".srh-input").val();
        if(keyword === ""){
            tooltip(".srh-input","请输入资讯标题");
        } else {
        	$(".srh-input").tooltip('destroy');
        }
        
        if (keycode==8 && keyword == ""){
            $("#srh-btn").trigger("click");
        }
        if (keycode==13){
            $("#srh-btn").trigger("click");
        }
    });

    $("#srh-btn").on("click",function(){

        message.findList();
    });
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
        message.findList();
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


$(function(){
    userMenu();
    checkAllEvent();
    messageList();
    messageSearch();
    menu();//选择机构菜单
    $(".srh-input").tooltip({
        trigger: 'focus',
        placement: "bottom",
        title: "请输入资讯标题"
    });
});

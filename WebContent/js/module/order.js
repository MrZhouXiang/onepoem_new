/**
 * Created by AI-MASK on 14-6-16.
 */
var currentPage = 1; //默认当前页
var currentOrderId;

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
            url:'order/getOrderList/' + currentPage,
            type:'post',
            dataType:'json',
            data:{
                keyword: keyword,
                num: numberOfRow, 
                status: status
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
                        mc.set(obj.id,obj); // 缓存
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
        });
    });
    
    
  //公告新增
    $('#myOrder').on('show.bs.modal', function (e) {
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
    	if(status != 1)
    	{
    		layer.msg("不是待付款状态",1,{type:1,shade:false});
    		return false;
    	}
    	$("#OrderAdd_dialog").empty();
        $("#OrderAdd_dialog").load("/html/order.html?t="+new Date().getTime()+" #orderAdd",function(){
        	var id = checkedItems[0].getAttribute("data-id");
			formValidate();
			newNotice(id);
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

    //订单详情
	$('#orderDetailModal').on('show.bs.modal', function (e) {
		$("#orderDetail_dialog").empty();
		$("#orderDetail_dialog").load("/html/order.html?t="+new Date().getTime()+" #orderDetail",function(){
			showOrderDetail();
	    });
	  });
	
	//订单导出
	$('#orderExportModal').on('show.bs.modal', function (e) {
		$("#orderExport_dialog").empty();
		$("#orderExport_dialog").load("/html/order.html?t="+new Date().getTime()+" #orderExport",function(){
			//导出选中
			$("#exportSelected").click(function()
			{
				exportSelectedFunc();
			});
			//导出当前条件下的查询结果
			$("#exportCondition").click(function()
			{
				exportConditionFunc();
			});
	    });
	  });
	
    notice.findList();
    deleteNotice();
    pushMessage();

}
/**
 * 导出选中
 */
function exportSelectedFunc()
{
	var checkedItems = inputChecked("table_list");
	if(checkedItems.length == 0)
	{
		layer.msg("请选中订单后导出",2,{type:1,shade:false});
	} else {
		var param="";
		for ( var i = 0; i < checkedItems.length; i++) {
			param+="'"+ checkedItems[i].getAttribute("data-id") +"',";
		}
		param = param.substring(0,param.length-1);

		//导出
		$("#downloadFrame").attr("src", "/order/exportSelected?param="+param);
		/*$.ajax({
	        url:'/order/getOrder',
	        type:"POST",
	        dataType:"json",
	        data:{
	            id:currentOrderId
	        },
	        success:function(data){
	        }
		});*/
	}
}

/**
 * 导出当前条件下的查询结果
 */
function exportConditionFunc()
{
	
}

function clickCorpItem(t)
{
	var text = t.innerText;
	var val = $(t).attr("val");
	$("#corpText").text(text);
	$("#noticeTitle").val(val);
}



/**
 * 渲染单行tr
 * @param data
 * @returns {HTMLElement}
 */
function renderTable(data, eleId){
    var tr,td,_input;
    eleId = eleId == null ? "table_list" : eleId;
    var ths = get(eleId).getElementsByTagName("th");
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
            	case "id":
            		var a = document.createElement("a");
            		a.href = "javascript:clickOrder('"+ con +"');";
            		a.title = con;
            		
            		a.innerHTML = con.replace(/[\r\n]/g,"") ;
            		td.appendChild(a);
            		//td.innerHTML = "<a href='javascript:clickOrder("+ id +");'>"+ con.replace(/[\r\n]/g,"") + "</a>";//去换行
                    //td.title = con;
	                break;
                case "status":
                	var html = "";
                	if(con == 1)
            		{
                		html = "<div title='待付款'>待付款</div>";
            		} else if (con == 2)
        			{
            			html = "<div title='待发货' style='color:red;'>待发货</div>";
        			} else if(con == 3)
    				{
        				html = "<div title='已发货' style='color:blue;'>已发货</div>";
    				}
		             else if(con == 5)
					{
						html = "<div title='已收货' style='color:green;'>已收货</div>";
					}
                    td.innerHTML = html;
                    break;
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

function clickOrder(id)
{
	currentOrderId = id;
	$('#orderDetailModal').modal('show');
}

/**
 * 显示订单详情
 */
function showOrderDetail()
{
	$.ajax({
        url:'/order/getOrder',
        type:"POST",
        dataType:"json",
        data:{
            id:currentOrderId
        },
        success:function(data){
            if (data.success) {
            	var r = data.result;
            	var a = data.address;
            	var l=data.logistics;
            	var status = "";
            	
        		if (r.status == 1)
    			{
        			status = "待付款";
    			} else if(r.status == 2)
				{
    				status = "待发货";
				}
	             else if(r.status == 3)
				{
	            	 status = "已发货";
				} else if(r.status == 5)
				{
					status = "已收货";
				}
            	$("#orderIdVal").text(r.id);
            	$("#payCodeVal").text(r.payCode);
            	$("#statusVal").val(r.status);
            	var c = r.uploadCount==r.photoCount?r.photoCount:r.uploadCount+"/"+r.photoCount;
        		$("#photoCountVal").text(c);
            	$("#codeVal").text(l.code);
            	$("#transVal").text(l.name);
            	$("#transFeeVal").text(r.transFee);
            	$("#totalFeeVal").text(r.totalFee);
            	$("#realFeeVal").text(r.realFee);
            	$("#lastFeeVal").text(r.lastFee);
            	$("#commentVal").val(r.comment);
            	$("#nameVal").val(a.name);
            	$("#telVal").val(a.tel);
            	$("#addressVal").text(a.address);
            	
           		 var elementId = "table_participant";
           		 var goods = r.goods;
                    var tbody = get(elementId).getElementsByTagName("tbody");
                    if(tbody.length > 0){
                        document.getElementById(elementId).removeChild(tbody[0]);
                    }
                    tbody[0] = document.createElement("tbody");
                    document.getElementById(elementId).appendChild(tbody[0]);
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < goods.length; i++) {
                        var obj = goods[i];

                        //mc.set(obj.memId,obj); //缓存

                        var tr = renderTable(obj, elementId);
                        fragment.appendChild(tr);
                    }
                    tbody[0].appendChild(fragment);
                    formValidate();
                    newNotice(r.id);
                    if(goods.length == 0)
                    {
                    	layer.msg("对不起，没有找到匹配结果",2,{type:0,shade:false});
                    }
            	
            }
        }
    });
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
                	layer.msg("标记发货成功",2,{type:1,shade:false});
                    currentPage = 1;
                    notice.findList();
                    $('#myModal').modal('hide');
                }else{
                	layer.msg("推送失败或标记发货失败",2,{type:1,shade:false});
                	currentPage = 1;
                    notice.findList();
                    $('#myModal').modal('hide');
                }
        }
        });
    });
    
    //订单状态改为待发货
    $("#order_new_btn").on("click",function(){
        var content = trim($("#noticeContent").val());
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
            url:'order/addOrder',
            type:"POST",
            dataType:"json",
            data:{
            	id:id,
                payCode:content
            },
            success:function(data){
                if (data.success) {
                	layer.msg("标记待发货成功",2,{type:1,shade:false});
                    currentPage = 1;
                    notice.findList();
                    $('#myOrder').modal('hide');
                }else{
                	layer.msg("推送失败或标记待发货失败",2,{type:1,shade:false});
                	currentPage = 1;
                    notice.findList();
                    $('#myOrder').modal('hide');
                }
        }
        });
    });
    
  //修改订单详情
    $("#detail_new_btn").on("click",function(){
    	var comment = trim($("#commentVal").val());
    	var payCode = $("#payCodeVal").html();
    	var name = trim($("#nameVal").val());
    	var tel = trim($("#telVal").val());
    	var address = trim($("#addressVal").val());
    	var status=$("#statusVal option:selected").val();
    	/*if(status ==="2" || status ==="3" || status ==="5"){
    		if(payCode === ""){
    			alert("本次交易尚未付款，订单状态修改失败");
    			return;
    		}
    	}*/
    	/*var status=$("#status").val();
    	alert(address+" "+comment+" "+name+" "+tel+" "+" "+status);*/
    	$.ajax({
            url:'order/updateOrder',
            type:"POST",
            dataType:"json",
            data:{
            	id:id,
            	contact:name,
            	tel:tel,
            	comment:comment,
            	address:address,
            	status:status,
            },
            success:function(data){
                if (data.success) {
                	layer.msg("修改成功",2,{type:1,shade:false});
                    currentPage = 1;
                    notice.findList();
                   // $('#myOrder').modal('hide');
                }else{
                	layer.msg("修改失败",2,{type:1,shade:false});
                	currentPage = 1;
                    notice.findList();
                   // $('#myOrder').modal('hide');
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
            layer.msg("请选择要删除的订单",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = checkedItems[0].getAttribute("data-id");
                    $.ajax({
                        url:"/order/deleteOrder?ids="+_id,
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
                          var _id = obj.getAttribute("data-id");
                          str += _id + ",";
                      }
                      str = str.substring(0,str.length-1);
                	
                     $.ajax({
                        url:"/order/deleteOrder?ids="+str,
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
        /*if (keycode==8 && keyword == ""){ //BackSpace
            $("#srh-btn").trigger("click");
        }
        if (keycode==13){ //Enter
            $("#srh-btn").trigger("click");
        }*/
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
		var obj = notice.getCache().get(id);
		if(obj.uploadCount==obj.photoCount)
		{
			$("#downloadFrame").attr("src", "/order/downloadPhoto?id="+id);
		}else{
			layer.confirm('照片尚未上传完成，继续下载会导致照片丢失，确定要继续下载吗？', function(index){
				$("#downloadFrame").attr("src", "/order/downloadPhoto?id="+id);
				layer.close(index);
			});
		}
	});
	
}
	
function initExportPhoto()
{
	$("#exportPhoto").on('click',function(){	
		
	});
}

$(function(){
    userMenu();
    checkAllEvent();
    noticeList();
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


function pushMessage(){

    $("#message_push").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要推送的订单",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定推送吗？', function(index){
                console.log(checkedItems.length);
                    var _id = checkedItems[0].getAttribute("data-id");
                    var _tel = checkedItems[0].getAttribute("data-tel");
                    $.ajax({
                        url:"/order/messagePush?ids="+_id+"&tels="+_tel,
                        dataType:"json",
                        success:function(data){
                            if(data.success){
                            	layer.msg("推送成功",2,{type:1,shade:false});
                            	notice.findList();
                            }
                        }
                    });
                layer.close(index);
            });
        }
    });
}
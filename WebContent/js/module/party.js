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

function getTodayDate()
{
	 var d = new Date();
	 var years = d.getFullYear();
	 var month = d.getMonth()+1;
	 var days = d.getDate();
	 /*var hours = add_zero(d.getHours());
	 var minutes = add_zero(d.getMinutes());
	 var seconds=add_zero(d.getSeconds());*/
	 var ndate = years+"-"+month+"-"+days;
	 return ndate;
}
/**
 * 
 *  格式-->2013-10-1
 * @param d1 
 * @param d2 
 * @returns 0 : d1==d2			1 : d1 > d2 		2:d1 < d2 
 */
function compareDate(d1, d2)
{
	var d1Arr=d1.split('-');
	var d2Arr=d2.split('-');
	var v1=new Date(d1Arr[0],d1Arr[1],d1Arr[2]).getTime();
	var v2=new Date(d2Arr[0],d2Arr[1],d2Arr[2]).getTime();

	if (v1 == v2){
		return 0;
	} else if (v1 > v2){
		return 1;
	} else if (v1 < v2){
		return 2;
	}
}

/**
 * 公告列表
 */
function memberList(){

    memberRequest(member.getCache(),member.getRows());
    memberSearch(); //搜索
    deleteMember();
   loadPage();
   menu();
   noticeSend();//初始化发送
   // sendMail();
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
        memberRequest(member.getCache(),member.getRows());
    });
	
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
 * 活动搜索 点击和按钮事件
 */
function memberSearch(){

    $(".srh-input").keyup(function(e){
        var e = e || event;
        var keycode = e.which || e.keyCode;

        keyword = $(".srh-input").val();
        
        if(keyword === ""){
            column = "tel";
            tooltip(".srh-input","请输入活动标题");
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
 * 活动列表，请求
 * @param mc
 * @param numberOfRow
 */
function memberRequest(mc,numberOfRow){

	$("#allcheck").attr("checked", false);
	
	var sfilter = $("#js_organization_menu").find(".cell .selected");
	var orgId = Number(sfilter.attr("val"));
	
	var stype = $("#js_status_menu").find(".cell .selected");
	var status = Number(stype.attr("val"));
	
	var keyword = $(".srh-input").val();
	
    $.ajax({
        url:'/party/getPartyList/',
        type:'post',
        dataType:'json',
        data:{
            keyword: keyword, //查询关键字（数字、字母、中文）
            //column:column, //区分查询关键字类型（姓名、手机号码）
            //sortColumn:sortColumn, //排序关键字（姓名、手机、默认[memid]）
           // sortType:sortType, // 排序方式（升序、降序[默认]）
            pageSize: numberOfRow, //页面容量（15）
            currentPage : currentPage,
            orgId : orgId,
            status : status
           // filter:filterValue //活动激活状态过滤器
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

                    mc.set(obj.id,obj); //缓存

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
 * 活动弹出详细
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
        });

        $('#table_list td a').popover({
            html:true,
            animation:false,
            trigger:'manual',
            placement:"right",
            title:"活动信息",
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
function renderTable(data, elementId){
	var eid = elementId ? elementId : "table_list";
	
    var tr,td,_input;
    var ths = get(eid).getElementsByTagName("th");
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
            _input.setAttribute('data-status',data.passStatus);
            td.appendChild(_input);
            td.style.textAlign = "center";
        }else{

            switch(type){
            	case "status":
            		var text = "";
            		if(data[type] == 1){
            			text = "报名中";
            		} else if (data[type] == 2){
            			text = "已结束";
            		} else if (data[type] == 3){
            			text = "截止报名";
            		}
            		
	                td.innerText = text;
	                break;
            	case "passStatus":
                    td.innerHTML = data[type] == "new"?"<div class='sts-icon' title='未发送'></div>":"<div class='sts-icon active' title='已发送'></div>";
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
 * 机构新增
 */
function loadPage(){
	//新增modal
    $('#memberAddModal').on('shown.bs.modal', function () {
    	$('#memberEdit_dialog').empty();//销毁编辑模态框（防止元素ID重复）
        $("#memberAdd_dialog").load("/html/party.html?t="+new Date().getTime()+" #add",function(){
        	$('#startDatePicker').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                startDate:getTodayDate(),
                forceParse: 0,
                pickerPosition:"bottom-left"
            }).on('changeDate', function(ev){
            	$("#startDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
            });

        	$('#cutOffDatePicker').datetimepicker({
        		language:  'zh-CN',
        		weekStart: 1,
        		todayBtn:  1,
        		autoclose: 1,
        		todayHighlight: 1,
        		startView: 2,
        		minView: 2,
                startDate:getTodayDate(),
        		forceParse: 0,
        		pickerPosition:"bottom-left"
        	}).on('changeDate', function(ev){
            	$("#cutOffDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
            });
        	
        	$('#endDatePicker').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                startDate:getTodayDate(),
                forceParse: 0,
                pickerPosition:"bottom-left"
            }).on('changeDate', function(ev){
            	$("#endDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
            });
        	
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
        	
        	loadOrg();
            
        	addSave();
        	
        	formValidate();
        });
    });
  //活动模态编辑
    $('#memberEditModal').on('show.bs.modal', function (e){
    	var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要编辑的活动",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("不能同时编辑多个活动",2,{type:1,shade:false});
            $('#memberEditModal').modal('hide');
            return false;
        }
    }); 
    $('#memberEditModal').on('shown.bs.modal', function (e) {
    	$('#memberAdd_dialog').empty();//销毁新增模态框（防止元素ID重复）
    	var checkedItems = inputChecked("table_list");
        $("#memberEdit_dialog").load("/html/party.html?t="+new Date().getTime()+" #edit",function(){
        	$('#startDatePicker').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                startDate:getTodayDate(),
                forceParse: 0,
                pickerPosition:"bottom-left"
            }).on('changeDate', function(ev){
            	$("#startDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
            });

        	$('#cutOffDatePicker').datetimepicker({
        		language:  'zh-CN',
        		weekStart: 1,
        		todayBtn:  1,
        		autoclose: 1,
        		todayHighlight: 1,
        		startView: 2,
        		minView: 2,
                startDate:getTodayDate(),
        		forceParse: 0,
        		pickerPosition:"bottom-left"
        	}).on('changeDate', function(ev){
            	$("#cutOffDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
            });
        	
        	$('#endDatePicker').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                startDate:getTodayDate(),
                forceParse: 0,
                pickerPosition:"bottom-left"
            }).on('changeDate', function(ev){
            	$("#endDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
            });

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
        	var id = checkedItems[0].getAttribute("data-id");
            getMemberById(Number(id)); 
            memberUpdate(id); 
            formValidate();
        });
    });
    $('#participantShowModal').on('show.bs.modal', function (e){
    	var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择活动后再查看",2,{type:1,shade:false});
            $('#participantShowModal').modal('hide');
        	return false;
        }
        if(checkedItems.length > 1){
            layer.msg("请选择一个活动查看",2,{type:1,shade:false});
            $('#participantShowModal').modal('hide');
        	return false;
        }
    }); 
    
    $('#participantShowModal').on('shown.bs.modal', function () {
        $("#participantShow_dialog").load("/html/party.html?t="+new Date().getTime()+" #show",function(){
        	var checkedItems = inputChecked("table_list");
        	var id = checkedItems[0].getAttribute("data-id");
        	getParticipantList(Number(id));
        });
    });
}

function getParticipantList(id)
{
	$.ajax({
		 url:"/party/getParticipantList",
         type:"post",
         dataType:"json",
         data:{
        	 partyId:id
         },
         success:function(data){
        	 if(data.success){
        		 var elementId = "table_participant";
                // mc.clear();
                 var result = data.result;
                 baseUrl = data.url;

                 var tbody = get(elementId).getElementsByTagName("tbody");
                 if(tbody.length > 0){
                     document.getElementById(elementId).removeChild(tbody[0]);
                 }
                 tbody[0] = document.createElement("tbody");
                 document.getElementById(elementId).appendChild(tbody[0]);
                 var fragment = document.createDocumentFragment();
                 for (var i = 0; i < result.length; i++) {
                     var obj = result[i];

                     //mc.set(obj.memId,obj); //缓存

                     var tr = renderTable(obj, elementId);
                     fragment.appendChild(tr);
                 }
                 tbody[0].appendChild(fragment);
                 if(result.length == 0)
                 {
                 	layer.msg("对不起，没有找到匹配结果",2,{type:0,shade:false});
                 }
             }else{
                 layer.msg("对不起，没有找到匹配结果",2,{type:0,shade:false});
             }
         }
	});
}

function formValidate(){
    $("#title").off("blur").on("blur",function(){
        var val = $(this).val();
        if(trim(val) === ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入标题");
        }else{
            $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#startDate").off("blur").on("blur",function(){
        var val = $(this).val();
        if(trim(val) === ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动开始时间");
        }else{
            $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#endDate").off("blur").on("blur",function(){
        var val = $(this).val();
        if(trim(val) === ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动结束时间");
        }else{
            $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#cutOffDate").off("blur").on("blur",function(){
        var val = $(this).val();
        if(trim(val) === ""){
            $(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动截止报名时间");
        }else{
            $(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    });
    
    $("#address").off("blur").on("blur",function(){
    	var val = $(this).val();
    	if(trim(val) === ""){
    		$(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动地点");
    	}else{
    		$(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	}
    });
    
    $("#introduction").off("blur").on("blur",function(){
    	var val = $(this).val();
    	if(trim(val) === ""){
    		$(this).parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动介绍");
    	}else{
    		$(this).parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	}
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
    	
    	if($("#title").val() === ""){
            $("#title").parents(".form-group").addClass("has-error").find(".help-block").text("请输入标题");
            return false;
        } else if ($("#title").val().length > 35) {
        	$("#title").parents(".form-group").addClass("has-error").find(".help-block").text("标题长度限制为35个字符");
        	$("#title").focus();
            return false;
        } else{
        	$("#title").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	
    	if($("#startDateField").val() === ""){
            $("#startDateField").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动开始时间");
            $("#startDateField").focus();
            return false;
        }else{
        	$("#startDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }

    	if($("#cutOffDateField").val() === ""){
            $("#cutOffDateField").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动截止报名时间");
            $("#cutOffDateField").focus();
            return false;
        }else{
        	$("#cutOffDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }

    	if($("#endDateField").val() === ""){
            $("#endDateField").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动结束时间");
            $("#endDateField").focus();
            return false;
        }else if (1 == compareDate($("#startDateField").val(), $("#endDateField").val())){
    		$("#endDateField").parents(".form-group").addClass("has-error").find(".help-block").text("开始时间应在结束之前");
            $("#endDateField").focus();
            return false;
    	}else if (1 == compareDate($("#cutOffDateField").val(), $("#endDateField").val())){
    		$("#endDateField").parents(".form-group").addClass("has-error").find(".help-block").text("截止报名时间应在结束之前");
            $("#endDateField").focus();
            return false;
    	}else{
        	$("#endDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }

    	if($("#address").val() === ""){
    		$("#address").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动地点");
    		$("#address").focus();
    		return false;
    	} else if ($("#address").val().length > 50) {
        	$("#address").parents(".form-group").addClass("has-error").find(".help-block").text("活动地点长度限制为50个字符");
        	$("#address").focus();
            return false;
        } else{
    		$("#address").parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	}
    	
    	if($("#introduction").val() === ""){
    		$("#introduction").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动介绍");
    		$("#introduction").focus();
    		return false;
    	} else if ($("#introduction").val().length > 500) {
        	$("#introduction").parents(".form-group").addClass("has-error").find(".help-block").text("活动介绍长度限制为500个字符");
        	$("#introduction").focus();
            return false;
        } else{
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
     
     $.ajax({
         url:"/party/addParty",
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
 * 活动删除
 */
function deleteMember(){

	$("#member_del").on('click',function(){
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要删除的活动",2,{type:1,shade:false});
        	return false;
        }
        if(checkedItems.length > 0){
            layer.confirm('确定删除吗？', function(index){

                console.log(checkedItems.length);
                if(checkedItems.length === 1){
                    var _id = Number(checkedItems[0].getAttribute("data-id"));
                    $.ajax({
                        url:"/party/deleteParty",
                        type:"post",
                        dataType:"json",
                        data:{
                        	ids:_id,
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
                        url:"/party/deleteParty",
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
 * 活动发送
 */
function noticeSend(){
	AV.initialize(leancloud_config.appid, leancloud_config.appkey);
    $("#notice_send").on('click',function(){
        var input = inputChecked("table_list");
        var checkedItems = inputChecked("table_list");
        if(checkedItems.length < 1){
            layer.msg("请选择要发送的活动",2,{type:1,shade:false});
        	return false;
        }
        if(input.length > 1){
            layer.msg("活动不支持多条推送",2,{type:1,shade:false});
            return;
        }
        var obj = input[0];
        var mid = $(obj).attr("data-id");
        var orgId = $(obj).attr("data-orgId");
        var status = $(obj).attr("data-status");
        var send = function (index){
        	var noticeObj = member.getCache();
        	var row = noticeObj.get(mid);
        	if(typeof row === "undefined") return;
        	var _msg = {
        			"action":"com.puyuntech.yba.action.CUSTOM_RECEIVER",
        			"aps" : { "alert" : row.title },
        			type:"3",
        			msg:
        			{
        				msgId:row.id,
        				orgId:orgId
        			}
        	};
        	
        	//var msgs = JSON.stringify(_msg);//"{\"type\":\"notice\",\"msg\":["+msg+"]}";
        	$.ajax({
        		url:"/party/getDeviceIdList/",
        		type:"post",
        		dataType:"json",
        		data:{
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
        	layer.confirm("该活动已发送，确定要重新发送吗？", send);
        	//layer.msg("该公告已发送，不能重新发送！",2,{type:1,shade:false});
        } else {
        	send();
        }
    });
}

/**
 * 修改活动状态
 * @param id
 */
function noticeStatus(id){
    $.ajax({
        url:"/party/sts/"+id,
        type:"post",
        dataType:"json",
        data:{
            _method: 'PUT'
        },
        success:function(data){
            if(data.success){
            	memberRequest(member.getCache(),member.getRows());
            }
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
            layer.msg("请选择要发送的活动",2,{type:1,shade:false});
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
							layer.msg("此活动已激活",2,{type:0,shade:false});
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
 * 活动编辑，根据id查询当前活动
 * 
 * @param id
 */
function getMemberById(id){
	$.get("/party/getParty/"+id,function(data){
		if(data.success){
			var result = data.result;
			var title = result.title;
			var startDate = result.startDate;
			var endDate = result.endDate;
			var address = result.address;
			var  introduction= result.introduction;
			var image = result.image;
			var url = data.url;
			
			$("#title").val(title);
			$("#startDate").val(startDate);
			$("#startDateField").val(startDate);//隐藏域
			
			$("#endDate").val(endDate);
			$("#endDateField").val(endDate);//隐藏域
			
			$("#cutOffDate").val(endDate);
			$("#cutOffDateField").val(endDate);//隐藏域
			
			$("#address").val(address);
			$("#introduction").val(introduction);
			
			 $("#fileName").val(image); //隐藏域
			 if(image)
			 {
	            $("#files").find("img").attr("src",url +image).show();
	            $("#files").find("a").attr("href",url +image).show();
	            $("#files").find("i").hide();
			 }
		}
	});
}
/**
 * 活动编辑 保存
 * @param id
 */
function memberUpdate(id){
    $("#member-edit-btn").on("click",function(){
        var title = $("#title").val();
        var image = $("#fileName").val();
        var startDate = $("#startDateField").val();
        var endDate = $("#endDateField").val();
        var cutOffDate = $("#cutOffDateField").val();
        var address = $("#address").val();
        var introduction = $("#introduction").val();
       
        if($("#title").val() === ""){
            $("#title").parents(".form-group").addClass("has-error").find(".help-block").text("请输入标题");
            return false;
        } else if ($("#title").val().length > 35) {
        	$("#title").parents(".form-group").addClass("has-error").find(".help-block").text("标题长度限制为35个字符");
        	$("#title").focus();
            return false;
        } else{
        	$("#title").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	
    	if($("#startDateField").val() === ""){
            $("#startDateField").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动开始时间");
            $("#startDateField").focus();
            return false;
        }else{
        	$("#startDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	
    	if($("#endDateField").val() === ""){
            $("#endDateField").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动结束时间");
            $("#endDateField").focus();
            return false;
        }else if (1 == compareDate($("#startDateField").val(), $("#endDateField").val())){
    		$("#endDateField").parents(".form-group").addClass("has-error").find(".help-block").text("开始时间应在结束之前");
            $("#endDateField").focus();
            return false;
    	}else if (1 == compareDate($("#cutOffDateField").val(), $("#endDateField").val())){
    		$("#endDateField").parents(".form-group").addClass("has-error").find(".help-block").text("截止报名时间应在结束之前");
            $("#endDateField").focus();
            return false;
    	}else{
        	$("#endDateField").parents(".form-group").removeClass("has-error").find(".help-block").text("");
        }
    	
    	if($("#address").val() === ""){
    		$("#address").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动地点");
    		$("#address").focus();
    		return false;
    	} else if ($("#address").val().length > 50) {
        	$("#address").parents(".form-group").addClass("has-error").find(".help-block").text("活动地点长度限制为50个字符");
        	$("#address").focus();
            return false;
        } else{
    		$("#address").parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	}
    	
    	if($("#introduction").val() === ""){
    		$("#introduction").parents(".form-group").addClass("has-error").find(".help-block").text("请输入活动介绍");
    		$("#introduction").focus();
    		return false;
    	} else if ($("#introduction").val().length > 500) {
        	$("#introduction").parents(".form-group").addClass("has-error").find(".help-block").text("活动介绍长度限制为500个字符");
        	$("#introduction").focus();
            return false;
        } else{
    		$("#introduction").parents(".form-group").removeClass("has-error").find(".help-block").text("");
    	}
        
        $.ajax({
            url:'/party/updateParty',
            type:"post",
            dataType:"json",
            data:{
            	id:id,
            	title:title,
            	image:image,
            	startDate:startDate,
            	endDate:endDate,
            	cutOffDate:cutOffDate,
            	address:address,
            	introduction:introduction
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
        title:"活动信息",
        content:function(){
        },
        container:"body"
    });
    $(".srh-input").tooltip({
        trigger: 'focus',
        placement: "bottom",
        title: "请输入活动标题"
    });

});
/**
 * Created by AI-MASK on 14-6-16.
 */
var currentPage = 1; //默认当前页

var dues = (function($){
    var numberOfRow = 20; //一页条数
    var list = function(){
        $.ajax({
            url:'/dues/find/'+ currentPage,
            type:'get',
            dataType:'json',
            data:{
                num: numberOfRow
            },
            success:function(data){
                if(data.success){
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
//                            var s = (curPage - 1)*numberOfPages;
                            list();
                        }
                    }
                    if(data.totalPages > 1){
                        paginator.paging(opt);
                    }
                }
            }
        });
    }

    return {
        findList:list
    }
})(jQuery);
/**
 * 公告列表
 */
function duesList(){

    dues.findList();
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
            td.appendChild(_input);
            td.style.textAlign = "center";
        }else{
            if(type === "status")
                td.innerText = data[type] === null?"未缴费":"已缴费";
            else
                td.innerText = data[type];
        }
    }
    return tr;
}
/**
 * 公告新增
 */
function newNotice(){
    $("#notice_new_btn").on("click",function(){
        var title = trim($("#noticeTitle").val());
        var content = trim($("#noticeContent").val());
        if(title === ""){
            $("#noticeErr").text("请填写标题")
            return;
        }
        if(content === ""){
            $("#noticeErr").text("请填写内容");
            return;
        }
        $.ajax({
            url:'/notice/new',
            type:"POST",
            dataType:"json",
            data:{
                title:title,
                content:content
            },
            success:function(data){
                if(data.success){
                    currentPage = 1;
                    notice.findList();
                    $('#myModal').modal('hide');
                }
        }
        })
    });
}

function getNoticeById(id){
    $.get("/notice/get/"+id,function(data){
        if(data.success){
            var result = data.result;
            var title = result.title;
            var content = result.content;
            $("#noticeEditTitle").val(title);
            $("#noticeEditContent").val(content);
        }
    });
}
function noticeUpdate(id){
    $("#notice_Edit_btn").on("click",function(){
        var title = trim($("#noticeEditTitle").val());
        var content = trim($("#noticeEditContent").val());
        if(title === ""){
            $("#noticeEditErr").text("请填写标题")
            return;
        }
        if(content === ""){
            $("#noticeEditErr").text("请填写内容");
            return;
        }
        $.ajax({
            url:'/notice/'+id,
            type:"post",
            dataType:"json",
            data:{
                _method: 'PUT',
                title:title,
                content:content
            },
            success:function(data){
                if(data.success){
                    currentPage = 1;
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
                                $(checkedItems[0]).parents("tr").remove();
                                layer.msg('删除成功'); //风格二
                            }
                        }
                    })
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
                                for (var i = 0; i < checkedItems.length; i++) {
                                    var obj1 = checkedItems[i];
                                    $(obj1).parents("tr").remove();
                                }
                                layer.msg('删除成功'); //风格二
                            }
                        }
                    })
                }
                layer.close(index);
            });
        }
    })
}
/**
 * 公告发送
 */
function noticeSend(){
    var sock = new SockJS('http://172.21.1.243:5555/chamber');
    sock.onopen = function() {
        console.log('open');
    };
    sock.onmessage = function(e) {
        console.log('message', e.data);
    };
    sock.onclose = function() {
        console.log('close');
    };

    $("#notice_send").on('click',function(){
        var obj = {
            "type":"info",
            "msg":[{
                "title":"天气不粗",
                "catogery":"休闲时光",
                "cover":"/img/info/sun.png",
                "summary":"这是一个温暖祥和的午后...",
                "url":"/info/2014061801"
            }]
        };

        var content = "{\"type\":\"notice\",\"msg\":[{\"title\":\"关于会费催缴的通知\",\"content\":\"请还没有交钱的赶紧交上来\"}]}";
        var info = "{\"type\":\"info\",\"msg\":[{\"title\":\"天气不粗\",\"catogery\":\"休闲时光\",\"cover\":\"/img/info/sun.png\",\"summary\":\"这是一个温暖祥和的午后...\",\"url\":\"/info/2014061801\"}]}";
        sock.send(obj);
    });
}

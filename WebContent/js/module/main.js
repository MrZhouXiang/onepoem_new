/**
 * Created by AI-MASK on 14-6-11.
 */
function trim(a) {
    return a.replace(/^\s+|\s+$/g, "");
}

/**
 * 头部菜单
 */
function userMenu(){

    var index = $("body").attr("index");
    var num = Number(index);
    $("#header").find(".nav li").eq(num-1).addClass('active');

    $("#user").hover(
        function(){
            $("#userMenu").show();
        },function(){
            $("#userMenu").hide();
        });

    doModify();
    apksubmit();
};

/**
 * 密码修改请求
 */
function doModify() {
    onblurEvent();

    $("#confirm_new_btn").on("click", function() {
    	var oldPwd = $("#oldPwd").val();
        var newPwd = $("#newPwd").val();
        var confirmPwd = $("#confirmPwd").val();
        var $oldPwderr = $("#old_pwd_err");
        var $newPwderr = $("#new_pwd_err");
        var $confirmPwderr = $("#confirm_pwd_err");

        var c = false;
        if(oldPwd == "" ){
            $oldPwderr.text("请输入您现在的密码").parents(".form-group").addClass("has-error");
        }else if (!/^\w{6,20}$/.test(newPwd)) {
            $newPwderr.text("格式错误，请重新输入").parents(".form-group").addClass("has-error");
        }else if (!/^\w{6,20}$/.test(confirmPwd)) {
            $confirmPwderr.text("格式错误，请重新输入").parents(".form-group").addClass("has-error");
        }else if (confirmPwd != newPwd) {
            $confirmPwderr.text(" 您两次输入的密码不一致，请重新输入").parents(".form-group").addClass("has-error");
        } else {
            $confirmPwderr.text("").parents(".form-group").removeClass("has-error");
            c = true;
        }
        var flag = pwdValidate();
        if( c && flag){
            formSubmit();
        }else{
            return false;
        }
    });
    $("#modify_pwd_close").on("click", function() {
        $(".form-horizontal")[0].reset();
        $("#old_pwd_err").text("").parents(".form-group").removeClass("has-error");
        $("#new_pwd_err").text("").parents(".form-group").removeClass("has-error");
        $("#confirm_pwd_err").text("").parents(".form-group").removeClass("has-error");
        $("#modify_msg").text("");
    });
    $("#cancel_btn").on("click", function() {
        $(".form-horizontal")[0].reset();
        $("#old_pwd_err").text("").parents(".form-group").removeClass("has-error");
        $("#new_pwd_err").text("").parents(".form-group").removeClass("has-error");
        $("#confirm_pwd_err").text("").parents(".form-group").removeClass("has-error");
        $("#modify_msg").text("");
    });
}
//onblur事件
function onblurEvent() {

    $("#oldPwd").blur(function() {
        pwdValidate();
    });
    $("#newPwd").blur(function(){
        var newPwd = $("#newPwd").val();
        if(newPwd == ""){
            $("#new_pwd_err").text("请输入新密码").parents(".form-group").addClass("has-error");
        }else if (!/^\w{6,20}$/.test(newPwd)) {
            $("#new_pwd_err").text("格式错误，请重新输入").parents(".form-group").addClass("has-error");
        } else {
            $("#new_pwd_err").text("").parents(".form-group").removeClass("has-error");
        }
    });
}
/**
 * 旧密码验证
 */
function pwdValidate(){
    var oldPwd = $("#oldPwd").val();
    var b = false;

    $.ajax({
        url : "doValidate",
        type : 'post',
        dataType : 'json',
        async:false,
        data : {
            oldPwd : $.md5(oldPwd)
        },
        success : function(data) {
            if (data.success) { //  原密码验证通过
//                $("#old_pwd_err").text(data.message).parents(".form-group").addClass("has-error");
                $("#old_pwd_err").text("").parents(".form-group").removeClass("has-error");
                b  = true;
            } else {
                if(oldPwd == ""){
                    $("#old_pwd_err").text("请输入您现在的密码").parents(".form-group").addClass("has-error");
                }else{
                    $("#old_pwd_err").text(data.message).parents(".form-group").addClass("has-error");
                }
                b =  false;
            }
        }
    });
    return b;
}
/**
 * 表单提交
 */
function formSubmit(){
    var oldPwd_md5 = $.md5($("#oldPwd").val());
    var newPwd = $("#newPwd").val();
    var confirmPwd = $("#confirmPwd").val();
    if(newPwd != "" && confirmPwd != ""){
        var newPwd_md5 = $.md5($("#newPwd").val());
        var confirmPwd_md5 = $.md5($("#confirmPwd").val());
        $.ajax({
            url : "doModify",
            type : 'post',
            dataType : 'json',
            data : {
                oldPwd : oldPwd_md5,
                newPwd : newPwd_md5,
                confirmPwd : confirmPwd_md5
            },
            success : function(data) {

                if (data.success) { //  密码修改请求成功
                    $("#modify_msg").text(data.message);
                    setTimeout(function() {
                        window.location = "/logout";
                    }, 1500);
                } else {
                    $("#modify_msg").text(data.message);
                }
            }
        });
    }
}
/**
 * 安卓版本更新， 表单提交
 */
function apksubmit(){
    $("#andr_update_btn").off("click").on("click",function(){
        var url = $("#andr_url").val();
        var versionCode = $("#andr_vercode").val();
        var versionName = $("#andr_vername").val();
        var versionDesc = $("#andr_verdesc").val();

        $.ajax({
            url:"updateApk",
            type:'post',
            dataType:'json',
            data: {
                url: url,
                versionCode:versionCode,
                versionName:versionName,
                versionDesc:versionDesc
            },
            success: function(data) {

                if (data.success) {
                    $('#updateAPK').modal('hide');
                }
            }
        });
    });
}
//===============================================================================
/**
 *
 * @returns {*}
 */
function get() {
    var elements = new Array();

    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];

        if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        if (arguments.length == 1) {
            return element;
        }

        elements.push(element);
    }
    return elements;
}
/**
 * 全选事件触发
 */
function checkAllEvent(){

    $(document).on('ifToggled','#allcheck',function(event){
        var isCheck = event.target.checked;
        checkAll(isCheck);
    });
    
//    $(document).on('ifToggled','input["checkbox"]',function(event){
//    	alert();
//    });
//    $("#allcheck").change(function(){
//        var checked = get("allcheck").checked;
//        checkAll(checked);
//    });
//    $("#table_list").on("change","input[name='checkRow']",function(){
//        //$(this).parents("tr").toggleClass("warning");
//    });
}
/**
 * checkbox 全选,全不选
 */
function checkAll(txt){

    var inputObj = get("table_list").getElementsByTagName("input");

    for (var i = 1; i < inputObj.length; i++) {
        var input = inputObj[i];
        if(input.type === "checkbox"){
            if(txt){
//                input.checked = true;
                $(input).iCheck('check');
                //$(input).parents("tr").addClass("warning");
            }else{
//                input.checked = false;
                $(input).iCheck('uncheck');
                //$(input).parents("tr").removeClass("warning");
            }
        }
    }
}
/**
 * 全选事件触发
 */
//function checkAllEvent(){
//    $('input').iCheck('check', function(){
//        alert('Well done, Sir');
//    });
//    $("#allcheck").change(function(){
//        var checked = get("allcheck").checked;
//        checkAll(checked);
//    });
//    $("#table_list").on("change","input[name='checkRow']",function(){
//        $(this).parents("tr").toggleClass("warning");
//    });
//}
/**
 * checkbox 全选,全不选
 */
//function checkAll(txt){
//
//    var inputObj = get("table_list").getElementsByTagName("input");
//
//    for (var i = 0; i < inputObj.length; i++) {
//        var input = inputObj[i];
//        if(input.type === "checkbox"){
//            if(txt){
//                input.checked = true;
//                $(input).parents("tr").addClass("warning");
//            }else{
//                input.checked = false;
//                $(input).parents("tr").removeClass("warning");
//            }
//        }
//    }
//}
/**
 * 返回 所有已被选中的checkbox
 * @param id [夫元素id]
 * @returns {Array}
 */
function inputChecked(id){
    var inputObj = get(id).getElementsByTagName("input");
    var inputAry = [];
    for (var i = 0; i < inputObj.length; i++) {
        var input = inputObj[i];
        if($(input).parent().hasClass("checked")){
            if(input.getAttribute('data-id')){
                inputAry.push(input);
            }
        }
//        if(input.type === "checkbox" && input.checked){
//            if(input.getAttribute('data-id')){
//                inputAry.push(input);
//            }
//        }
    }
    return inputAry;
}

/**
 * bootstrap page
 */
var paginator = (function(p){

    var opts = {
        currentPage: 1,
        totalPages: 10,
        numberOfPages:5,
        size:'normal', //分页条大小
        alignment:'center',
        useBootstrapTooltip:true,
        bootstrapMajorVersion:3, //bootstrap 版本 3,2
        tooltipTitles: function (type, page, current) {
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "上一页";
                case "next":
                    return "下一页";
                case "last":
                    return "尾页";
                case "page":
                    return "第" + page + "页";
            }
        },
        bootstrapTooltipOptions: {
            html: true,
            placement: 'bottom'
        },
        itemContainerClass: function (type, page, current) {
            return (page === current) ? "active" : "pointer-cursor";
        },
        onPageChanged: function(e,oldPage,newPage){
            print("Current page changed, old: "+oldPage+" new: "+newPage);
        }
    };
    //分页
    p.paging = function(options){

        opts = $.extend(opts,options);
        var $page;
        if(opts.id){
            $page = $(opts.id);
        }else{
            $page = $('#pagebar');
        }
        $page.bootstrapPaginator(opts);
    };

    return p;
})({});
/**
 * bootstrap tooltip
 * @param id
 * @param title
 */
function tooltip(id,title){

    $(id).tooltip('destroy');
    $(id).tooltip({title:title,placement:'bottom',trigger:'focus'});
    $(id).tooltip("show");
}
/**
 * 存储列表数据
 * @constructor
 */
var DataCache = function(){
    this.size = 0;
    this.caches = {};
}
DataCache.prototype = {
    remove : function(key){
        delete this.caches[key];
    },
    get : function(key){
        return this.caches[key];
    },
    set : function(key,val){
        this.caches[key] = val;
        this.size += 1;
    },
    clear:function(){
        this.caches = {};
    }
}

/**
 * 封面上传
 *   var obj = {
 *       fileInput:"",
 *       context:"",
 *       hiddenInput:"", //文件名隐藏域
 *       progress:  //进度条
 *       uploaddone:
 *   }
 */
function infoUpload(obj){

    var upload = obj.fileInput; //$('#fileupload');
    upload.fileupload({
        dataType: 'json',
        add: function (e, data) {
        	   var filepath = data.fileInput.context.value;
        	   var extStart= filepath.lastIndexOf(".");
               var ext=filepath.substring(extStart,filepath.length).toUpperCase();
               if(ext!=".GIF"&&ext!=".JPG"){//ext!=".PNG"&&
                layer.msg("图片限于jpg,gif格式");
                return false;
               }
//            data.context = $('<p/>').text('Uploading...').appendTo(document.body);
            data.context = obj.context; //$("#files");
            data.submit();
        },
        done: function (e, data) {

//            data.context.text('Upload finished.');
            var path = data.result.filePath;
            data.context.find("img").attr("src",path).show();
            data.context.find("a").attr("href",path).show();
            data.context.find("i").hide();
            obj.hiddenInput.val(data.result.fileName); //隐藏域

        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);

            $("#"+obj.progress+" .progress-bar").css(
                'width',
                progress + '%'
            );
        },
        start:function(e){
            $("#"+obj.progress).removeClass("hide");
            if(typeof (obj.uploaddone) !== "undefined"){
                (obj.uploaddone)();
            }
        },
        stop:function(e){
            setTimeout(function(){$("#"+obj.progress).addClass('hide');},1000);
        }

    });
}

/*
function fileUpload(){
	
	 var obj = {
             fileInput:$("#apkFile"),
             hiddenInput:$("#fileName"),
             url:"http://host:8080/"
         };
	 
         var upload = obj.fileInput; //$('#fileupload');
         upload.fileupload({
             dataType: 'json',
             add: function (e, data) {
//                 data.context = $('<p/>').text('Uploading...').appendTo(document.body);
                 data.context = obj.context; //$("#files");
                 data.submit();
             },
             done: function (e, data) {

//                 data.context.text('Upload finished.');
                 var path = data.result.filePath;
                 data.context.find("img").attr("src",path).show();
                 data.context.find("a").attr("href",path).show();
                 data.context.find("i").hide();
                 obj.hiddenInput.val(data.result.fileName); //隐藏域

             }

         });
         
}*/
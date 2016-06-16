/**
 * Created by AI-MASK on 14-6-11.
 */
function trim(a) {
    return a.replace(/^\s+|\s+$/g, "");
}
/**
 * 密码重置请求
 */
function doReset() {
    onblurEvent();

    $("#confirm_new_btn").on("click", function() {
        var newPwd = $("#newPwd").val();
        var confirmPwd = $("#confirmPwd").val();
        var c = false;
        if(newPwd == "" ){
        	$("#new_pwd_err").text("请输入新密码").parents(".form-group").addClass("has-error");
            $("#newPwd").focus();
        }else if (!/^\w{6,20}$/.test(newPwd)) {
        	$("#new_pwd_err").text("格式错误，请重新输入").parents(".form-group").addClass("has-error");
            $("#newPwd").focus();
        }else if (!/^\w{6,20}$/.test(confirmPwd)) {
        	$("#confirm_pwd_err").text("格式错误，请重新输入").parents(".form-group").addClass("has-error");
            $("#confirmPwd").focus();
        }else if (confirmPwd != newPwd) {
        	$("#confirm_pwd_err").text(" 您两次输入的密码不一致，请重新输入").parents(".form-group").addClass("has-error");
            $("#confirmPwd").focus();
        } else {
        	$("#confirm_pwd_err").text("").parents(".form-group").removeClass("has-error");
            c = true;
        }
        if(c){
        	formSubmit(newPwd,confirmPwd);
        }
    });
}
//onblur事件
function onblurEvent() {

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
 *表单提交
 **/
function formSubmit(newPwd,confirmPwd){
	var uuid = $("#uuid").val();
	var tel = $("#tel").val();
    if(newPwd != "" && confirmPwd != ""){
        var newPwd_md5 = $.md5($("#newPwd").val());
        var confirmPwd_md5 = $.md5($("#confirmPwd").val());
//        alert(uuid+","+tel+","+newPwd+","+confirmPwd);
        $.ajax({
            url : "/doReset",
            type : 'POST',
            dataType : 'json',
            data : {
            	tel: tel,
                pwd: newPwd_md5,
                uuid: uuid
            },
            success : function(data) {
                if (data.success) { //  密码重置请求成功
                    $("#modify_msg").text(data.message);
//                    layer.msg("密码重置成功，页面将在3秒后关闭...",2,{type:0,shade:false});
//                    setTimeout(function() {
//                    	window.close();
//                    }, 3000);
                } else {
                    $("#modify_msg").text(data.message);
                }
            },
//            error: function(XMLHttpRequest, textStatus, errorThrown) {//错误调试
//                alert(XMLHttpRequest.status); //400
//                alert(XMLHttpRequest.readyState); //4
//                alert(textStatus); //error
//            },
//            complete: function(XMLHttpRequest, textStatus) {
//                this; // 调用本次AJAX请求时传递的options参数
//            }
        });
    }
}
$(function(){
	doReset(); 
});

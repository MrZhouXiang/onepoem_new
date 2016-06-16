/**
 * Created by AI-MASK on 14-6-11.
 */
function trim(a) {
    return a.replace(/^\s+|\s+$/g, "");
}

var py = (function(usr){

    usr.init = function(){
        $("#J-adminLogin").on("click",function(){
            usr.loadPage();
        })
    }
    usr.loadPage = function(){
        $.get("login.jsp", function(result){

            $(document.body).append(result);
            $("#username").focus();

            usr.submit();
            usr.close();
            usr.enter();
        });
    };
    usr.close = function(){
        $("#J_login_close").on("click",function(){
            $(document.body).find(".login_shade").prev().remove();
            $(document.body).find(".login_shade").remove();
            $(document.body).find(".login_container").remove();
        });
    };
    usr.submit = function(){
        $("#J-loginSubmit").on('click',function(){
            var $username = $("#username"),
                $password = $("#password"),
                $login_msg = $("#login_msg");

            var username = trim($("#username").val());
            var password = trim($("#password").val());
            if(username == ""){
                $login_msg.text("用户名为空");
                $username.focus();
                return;
            }else if(password != ""){
                $password.val($.md5(password));

            }else{
                $login_msg.text("密码为空");
                $password.focus();
                return;
            }
            doLogin(username,$.md5(password));
        });
    };
    usr.enter = function(){
        $(".login_form").keydown(function(e){
            var e = e || event;
            var keycode = e.which || e.keyCode;
            if (keycode==13) {
                $(".login_btn").trigger("click");
            }
        });
    }
    function doLogin(username,pwd){

        if(username != "" && pwd != ""){
            $.ajax({
                url:"doLogin",
                type:'post',
                dataType:'json',
                data:{
                    name:username,
                    password:pwd
                },
                success:function(data){
                    if(data.success){
                        window.location = "order";
                    }else{
                        $("#login_msg").text(data.message);
                        $("#password").focus();
                    }

                }
            });
        }
    }

    return usr;
})(py || {});

$(function(){

    py.init();
    var carousel = $('#myCarousel');
    if(carousel.length > 0){
        carousel.carousel({
            interval: 4000
        });
    }
});
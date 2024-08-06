// 验证邮箱邮件 重新发送
var t = 60;
function showTime(item){
    item ? item : item = '#re_send_mail';
    t -= 1;
    $(item).text('重新发送（'+t+'）');
    $('#re_send_mail').css("pointer-events","none")
    var f = setTimeout("showTime('"+item+"')",1000);

    if(t==0){
       $(item).text('重新发送');
       $('#re_send_mail').css("pointer-events","auto")
       window.clearTimeout(f);
       t=60;
    }

}


(function($) {

// 重新发送邮件
$(document).on('click', '#re_send_mail', function(event) {
    event.preventDefault();
    $.ajax({
        url: zongcai.ajaxurl,
        type: 'POST',
        dataType: 'json',
        data: {action: 're_send_mail'},
    })
    .done(function( data ) {
        if( data.state == 200 ){
            showTime('#re_send_mail');
        }else{
            UIkit.notification(data.tips, { status: 'warning' });
        }
    })
    .fail(function() {
        UIkit.notification('网络错误，请稍候再试！', { status: 'warning' });
    });


});

// 账号登录
    $('#login-form,.login-form2').on("submit", function (event) {
		that = this
        event.preventDefault();
        // let is_sms = typeof is_sms_login != 'undefined' && is_sms_login
        let is_sms = $('#user_mobile').val() != ''

        if (is_sms && !window.sms_pass) {
            UIkit.notification('请先获取验证码', { status: 'warning' });
            return false
        }

        if (!is_sms && typeof TencentCaptcha != 'undefined' && verify_ceo_login == 1) {
            TcaptchaHandler(function (TcaptchaRes) {
                console.log(TcaptchaRes)
                if (TcaptchaRes.ret != 0) {
                    return false;
                }
                let data = $(that).serializeArray()
                data.push({'name': 'randstr', 'value': TcaptchaRes.randstr})
                data.push({'name': 'ticket', 'value': TcaptchaRes.ticket})
                $.ajax({
                    url: zongcai.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        if (data.success) {
                            setTimeout(function (){
                                if (data.data.url) {
                                    window.location.href = data.data.url;
                                }
                            },1000)
                            UIkit.notification(data.data.msg, { status: 'success' })
                        } else {
                            if(data.data.msg){
                                msg=data.data.msg;
                            }else{
                                msg=data.data
                            }
                            UIkit.notification(msg, { status: 'warning' });
                        }
                    },
                    error: function () {
                        UIkit.notification('操作错误！', { status: 'warning' });
                    }
                });
            });
        } else if (!is_sms && typeof vaptcha != 'undefined' && verify_ceo_login == 2) {
            window.vaptcha_obj.then(function (VAPTCHAObj) {
                // 将VAPTCHA验证实例保存到局部变量中
                obj = VAPTCHAObj;

                // 渲染验证组件
                VAPTCHAObj.render();

                // 验证成功进行后续操作
                VAPTCHAObj.listen('pass', function () {
                    serverToken = VAPTCHAObj.getServerToken();
                    var data = {
                        server: serverToken.server,
                        token: serverToken.token,
                    }
                    window.vaptcha_pass=true
                    console.log(data)

                    let dataA = $(that).serializeArray()
                    dataA.push({'name': 'server', 'value': serverToken.server})
                    dataA.push({'name': 'token', 'value': serverToken.token})
                    $.ajax({
                        url: zongcai.ajaxurl,
                        type: 'POST',
                        dataType: 'json',
                        data: dataA,
                        success: function (data) {
                            if (data.success) {
                                setTimeout(function (){
                                    if (data.data.url) {
                                        window.location.href = data.data.url;
                                    }
                                },1000)
                                UIkit.notification(data.data.msg, { status: 'success' })
                            } else {
                                if(data.data.msg){
                                    msg=data.data.msg;
                                }else{
                                    msg=data.data
                                }
                                UIkit.notification(msg, { status: 'warning' });
                                VAPTCHAObj.reset()
                            }
                        },
                        error: function () {
                            UIkit.notification('操作错误！', { status: 'warning' });
                            // 账号或密码错误等原因导致登录失败，重置人机验证
                            VAPTCHAObj.reset()
                        }
                    });
                })
                obj.validate();
            })
        } else {
            let data = $(that).serializeArray()
            data.push({'name': 'currentUrl','value': window.location.href})
            $.ajax({
                url: zongcai.ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    if (data.success) {
                        setTimeout(function (){
                            if (data.data.url) {
                                window.location.href = data.data.url;
                            }
                        },1000)
                        UIkit.notification(data.data.msg, { status: 'success' })
                    } else {
                        if(data.data.msg){
                            msg=data.data.msg;
                        }else{
                            msg=data.data
                        }
                        UIkit.notification(msg, { status: 'warning' });
                    }
                },
                error: function () {
                    UIkit.notification('操作错误！', { status: 'warning' });
                }
            });
        }
       

    });

//注册账号
$('#register-form,.register-form2').on("submit",function(event) {
    event.preventDefault();
    var that = this
    // let is_sms = typeof is_sms_login != 'undefined' && is_sms_login
    let is_sms = $('#user_mobile').val() != ''

    if (is_sms && !window.sms_pass) {
        UIkit.notification('请先获取验证码', { status: 'warning' });
        return false
    }

    if (!is_sms && typeof TencentCaptcha != 'undefined' && verify_ceo_login == 1) {
        TcaptchaHandler(function (TcaptchaRes) {
            console.log(TcaptchaRes)
            if (TcaptchaRes.ret != 0) {
                return false;
            }
            let data = $(that).serializeArray()
            data.push({'name': 'randstr', 'value': TcaptchaRes.randstr})
            data.push({'name': 'ticket', 'value': TcaptchaRes.ticket})
            $.ajax({
                url: zongcai.ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function( data ) {
                    if (data.success) {
                        setTimeout(function (){
                            if (data.data.url) {
                                window.location.href = data.data.url;
                            }
                        },1000)
                        UIkit.notification(data.data.msg, { status: 'success' })
                    } else {
                        UIkit.notification(data.data, { status: 'warning' });
                    }
                },
                error:function() {
                    UIkit.notification('操作错误', { status: 'warning' });
                }
            });
        })
    } else if (!is_sms && typeof vaptcha != 'undefined' && verify_ceo_login == 2) {
        window.vaptcha_obj.then(function (VAPTCHAObj) {
            // 将VAPTCHA验证实例保存到局部变量中
            obj = VAPTCHAObj;

            // 渲染验证组件
            VAPTCHAObj.render();

            // 验证成功进行后续操作
            VAPTCHAObj.listen('pass', function () {
                serverToken = VAPTCHAObj.getServerToken();
                var data = {
                    server: serverToken.server,
                    token: serverToken.token,
                }
                window.vaptcha_pass = true
                console.log(data)

                let dataA = $(that).serializeArray()
                dataA.push({'name': 'server', 'value': serverToken.server})
                dataA.push({'name': 'token', 'value': serverToken.token})

                $.ajax({
                    url: zongcai.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: dataA,
                    success: function( data ) {
                        if (data.success) {
                            setTimeout(function (){
                                if (data.data.url) {
                                    window.location.href = data.data.url;
                                }
                            },1000)
                            UIkit.notification(data.data.msg, { status: 'success' })
                        } else {
                            UIkit.notification(data.data, { status: 'warning' });
                            VAPTCHAObj.reset()
                        }
                    },
                    error:function() {
                        UIkit.notification('操作错误', { status: 'warning' });
                        VAPTCHAObj.reset()
                    }
                });
            })
            obj.validate();
        })
    } else {
        $.ajax({
            url: zongcai.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: $(that).serializeArray(),
            success: function( data ) {
                if (data.success) {
                    setTimeout(function (){
                        if (data.data.url) {
                            window.location.href = data.data.url;
                        }
                    },1000)
                    UIkit.notification(data.data.msg, { status: 'success' })
                } else {
                    UIkit.notification(data.data, { status: 'warning' });
                }
            },
            error:function() {
                UIkit.notification('操作错误', { status: 'warning' });
            }
        });
    }

});

//收藏
jQuery(document).on("click", ".add-collection", function() {

    var post_id = $(this).data("id");
    var $this = $(this);

    jQuery.ajax({
        url: zongcai.ajaxurl,
        data: {
            action:"do_collection",
            post_id:post_id
        },
        type: 'post',
        dataType: 'json',
        success:function(data){

            if(data.state == 1){
            	UIkit.notification({
					message: '感谢收藏！',
					status: 'success',
				});
                $this.addClass("cancel-collection").removeClass("add-collection").html("<i class='ceofont ceoicon-star-fill'></i> 已收藏");
            }else{

                if( data.state == 300 ){
                    UIkit.notification(data.tips, { status: 'warning' });
                    window.location.href = data.url;
                } else{
                    UIkit.notification(data.tips, { status: 'warning' });
                }

            }

        },

    });
    return false;
});

//取消收藏
jQuery(document).on("click", ".cancel-collection", function() {

    var post_id = $(this).data("id");
    var $this = $(this);

    jQuery.ajax({
        url: zongcai.ajaxurl,
        data: {
            action:"cancel_collection",
            post_id:post_id
        },
        type: 'post',
        dataType: 'json',
        success:function(data){

            if(data.state == 1){
            	UIkit.notification({
					message: '取消收藏！',
					status: 'warning',
				});
                $this.addClass("add-collection").removeClass("cancel-collection").html("<i class='ceofont ceoicon-star-line'></i> 收藏");
            }else{
                UIkit.notification(data.tips, { status: 'warning' });
            }

        },

    });
    return false;
});

//文章页面，刷新页面后取消收藏
$(document).on('click', '.single-del-collection', function() {

    var post_id = $(this).data('id');
    var $this = $(this);

    jQuery.ajax({
        url: zongcai.ajaxurl,
        data: {
            action:"cancel_collection",
            post_id:post_id
        },
        type: 'post',
        dataType: 'json',
        success:function(data){

            if(data.state == 1){
                $this.addClass("add-collection").removeClass("single-del-collection").html("<i class='ceofont ceoicon-star-line'></i> 收藏");
            }else{
                UIkit.notification(data.tips, { status: 'warning' });
            }

        },

    });

});

//用户中心取消收藏文章
$(document).on('click', '.del-collection', function(event) {
    event.preventDefault();
    var id = $(this).data('id');

    jQuery.ajax({
        url: zongcai.ajaxurl,
        data: {
            action:"cancel_collection",
            post_id:id
        },
        type: 'post',
        dataType: 'json',
        success:function(data){

            if(data.state == 1){
                $('.collection-post-'+id).remove();
            }else{
                UIkit.notification(data.tips, { status: 'warning' });
            }

        },
    });

});


// 用户中心 我的收藏  移除收藏
(function($){
    var $dp_handle = $('.dropdown-handle');

    $dp_handle.on('click', toggleSettings);

    function toggleSettings() {
        var $this = $(this),
            $dp = $this.siblings('.dropdown');

        if($dp.hasClass('closed')) {
            $dp.removeClass('closed');
            $this.addClass('active');
        } else {
            $dp.addClass('closed');
            $this.removeClass('active');
        }
    }
})(jQuery);

// 修改资料
$('#updata_accounts').submit(function(event) {
    event.preventDefault();

    $.ajax({
        url: zongcai.ajaxurl,
        type: 'POST',
        dataType: 'json',
        data: $('#updata_accounts').serializeArray(),
    })
    .done(function( data ) {
        UIkit.notification(data.tips, { status: 'success' })
        location.reload();
    })
    .fail(function() {
        UIkit.notification('网络错误！', { status: 'warning' });
    });

});


//用户中心修改密码
$(document).on('click', '#change_password_button', function(event) {
    event.preventDefault();

    var oldpwd = $('#oldpassword').val();
    var pwd1 = $('#newpassword').val();
    var pwd2 = $('#newpassword2').val();

    var err = 0;

    if( oldpwd == '' ){
        $('.oldpassword').removeClass('success').addClass('error');
        $('.oldpassword .zongcai-tips').text('请输入旧密码');
        $('.oldpassword .zongcai-tips').show();
        err = 1;
    }else{
        $('.oldpassword .zongcai-tips').hide();
    }

    if( pwd1 == '' ){
        $('.newpassword').removeClass('success').addClass('error');
        $('.newpassword .zongcai-tips').text('请输入密码');
        $('.newpassword .zongcai-tips').show();
        err = 1;
    }else{
        $('.newpassword .zongcai-tips').hide();
    }

    if( pwd2 == '' ){
        $('.newpassword2').removeClass('success').addClass('error');
        $('.newpassword2 .zongcai-tips').text('请输入密码');
        $('.newpassword2 .zongcai-tips').show();
        err = 1;
    }else{
        $('.newpassword2 .zongcai-tips').hide()
    }

    if( pwd1 && pwd2 ){

        if( pwd1 != pwd2 ){
            $('.newpassword2,.newpassword').removeClass('success').addClass('error');
            $('.newpassword2 .zongcai-tips,.newpassword .zongcai-tips').text('密码不一致');
            $('.newpassword2 .zongcai-tips,.newpassword .zongcai-tips').show();
            err = 1;
        }else if( pwd1.length < 6 ){
            $('.newpassword2,.newpassword').removeClass('success').addClass('error');
            $('.newpassword2 .zongcai-tips,.newpassword .zongcai-tips').text('密码不能少于六位');
            $('.newpassword2 .zongcai-tips,.newpassword .zongcai-tips').show();
            err = 1;
        }

    }

    if( err != 1 ){

        $.ajax({
            url: zongcai.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: $('#change_password').serializeArray(),
        })
        .done(function(data) {

            if( data.state ){
                UIkit.notification(data.tips, { status: 'success' })
                window.location.href =  window.location.href;
            }else{
                UIkit.notification(data.tips, { status: 'warning' })
            }

        })
        .fail(function() {
            UIkit.notification('网络错误，请稍候再试！', { status: 'warning' })
        });

    }

});

//QQ登录
jQuery(document).on("click", ".qq_login_button",
    function() {
        //var w = window.open("","QQ授权登录",["toolbar=0,status=0,resizable=1,width=640,height=560,left=", (screen.width - 640) / 2, ",top=", (screen.height - 560) / 2].join(""));
        jQuery.ajax({
            url: zongcai.ajaxurl,
            type: "POST",
            data: {action:"ajax_qq_v2",ref:location.href},
            success: function(data) {
                window.location = data;
            }
        });
    return false;
});

//第三方账号首次登录需绑定本站账号
$('#login_binding').submit(function(event) {
    /* Act on the event */
    event.preventDefault();

        $.ajax({
            url: zongcai.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: $('#login_binding').serializeArray(),
        })
        .done(function( data ) {
            if( data != 0 ){
                if( data.state == 200 ){
                    if( data.url ){
                    	//alert(data.tips);
                        window.location.href = data.url;
                    }
                }else if( data.state == 201 ){
                    UIkit.notification(data.tips, { status: 'warning' })
                }
            }else{
                UIkit.notification('请求错误！', { status: 'warning' })
            }
        })
        .fail(function() {
            UIkit.notification('网络错误！', { status: 'warning' })
        });

});

//第三方账号首次登录，没有本站账号的情况下注册新账号并绑定
$('#reg_binding').submit(function(event) {
    event.preventDefault();

        $.ajax({
            url: zongcai.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: $('#reg_binding').serializeArray(),
        })
        .done(function( data ) {
            if( data != 0 ){
                if( data.state == 200 ){
                    if( data.url ){
	                    //alert(data.tips);
	                    //window.location.href = data.url;
                        window.location.reload()
                    }
                }else if( data.state == 201 ){
                    UIkit.notification(data.tips, { status: 'warning' })
                }
            }else{
                UIkit.notification('请求错误！', { status: 'warning' })
            }
        })
        .fail(function() {
            UIkit.notification('网络错误！', { status: 'warning' })
        });

});


//文章点赞
$.prototype.postLike = function () {
	if ($(this).hasClass('done')) {
		UIkit.notification({
			message: '<i class="ceofont ceoicon-information-line"></i> 您已经点过赞了！！！',
			status: 'warning',
		});
		return false;
	} else {
		$(this).addClass('done');
		var id = $(this).data("id"),
			action = $(this).data('action'),
			rateHolder = $(this).children('.count');
		var ajax_data = {
			action: "dotGood",
			um_id: id,
			um_action: action
		};
		$.post("/wp-admin/admin-ajax.php", ajax_data,
			   function (data) {
			$(rateHolder).html(data);
		});
		return false;
	}
};
$(".dotGood").click(function () {
	$(this).postLike();
});



//点击加载更多
$('#pagination a').click(function() {
	$this = $(this);
	$this.addClass('loading').text("正在努力加载..."); //给a标签加载一个loading的class属性，可以用来添加一些加载效果
	var href = $this.attr("href"); //获取下一页的链接地址
	if (href != undefined) { //如果地址存在
		$.ajax({ //发起ajax请求
			url: href, //请求的地址就是下一页的链接
			type: "get", //请求类型是get
			error: function(request) {
				//如果发生错误怎么处理
			},
			success: function(data) { //请求成功
				setTimeout(function(){
					$this.removeClass('loading').text("点击查看更多"); //移除loading属性
					var $res = $(data).find(".ajax-item"); //从数据中挑出文章数据，请根据实际情况更改
					$('.ajax-main').append($res.fadeIn(500)); //将数据加载加进posts-loop的标签中。
					var newhref = $(data).find("#pagination a").attr("href"); //找出新的下一页链接
					if (newhref != undefined) {
						$("#pagination a").attr("href", newhref);
					} else {
						$("#pagination").html('我是有底线的！'); //如果没有下一页了，隐藏
					}
				},500);
			}
		});
	}
	return false;
});



})(jQuery);

/*注册获取邮箱验证码*/
function ValidateEmail(value)
    {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value))
        {
            return (true)
        }
        return (false)
    }

    $(function () {
        //hide or show password
        $('.send-verify-code').on('click', function(event){
            event.preventDefault();

            let email_address2 = $("#email_address2").val()
            if (!ValidateEmail(email_address2)) {
                UIkit.notification("请输入正确邮箱", { status: 'warning' })
                return false
            }

            var $this= $(this);
            let s60 = 60;
            let text=''

            let form_data={
                action:'send_email_verify_code',
                email:email_address2
            }
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                dataType: 'json',
                data: form_data,
                type: 'post',
                success: function (data) {
                    if (data.success) {
                        UIkit.notification(data.data.msg, { status: 'success' })

                        const inval = setInterval(() => {
                            if (s60 === 0) {
                                clearInterval(inval)
                                $this.attr('disabled', false);
                                $this.text('发送验证码')
                                return
                            } else {

                            }
                            s60 = s60 - 1
                            text = s60 + 's'
                            $this.disabled = true
                            $this.attr('disabled', true);
                            $this.text('')
                            $this.text(text);
                        }, 1000)
                    } else {
                        UIkit.notification(data.data.msg, { status: 'warning' })
                    }
                }
            })
        });

        //首页动态加载
        $(".ajax-show-post").on("click",function (){
            var that=this
            var form_data= {
                'id': $(that).attr("data-id"),
                'num': $(that).attr("data-num"),
                'page': $(that).attr("data-page"),
                'width': $(that).attr("data-width"),
                'action':'ajax_show_more_post'
            }
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: form_data,
                type: 'post',
                context: this,
                // async: false,
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        if (data.data.data) {
                            $(this).parent().prev().append(data.data.data)
                            $(this).attr('data-page',data.data.page)
                        }else{

                        }
                        if(data.data.hide_btn){
                            $(this).parent().hide();
                        }
                    } else {
                    }
                },
                error: function (msg) {
                    console.log(msg)
                }
            })

        })

    });


(function ($) {
    $(function () {

        // 发送验证码 注册
        $(document).on('click', ".go-captcha_mobile", function (event) {
            // if(typeof vaptcha != 'undefined' && !window.vaptcha_pass){
            //     layer.msg('请先人机验证', {icon: 2})
            //     return false
            // }
            var _this =
                $(this)
            var deft = _this.text()
            var user_mobile = $("input[name='user_mobile']").val()
            if(!user_mobile){
                var user_mobile = $("input[name='user_mobile_reg']").val()
            }
            if(!user_mobile){
                var user_mobile = $("input[name='user_mobile_forget']").val()
            }
            // _this.html(iconspin+deft)
            _this.attr("disabled","true");
            //验证邮箱
            if( !is_check_mobile(user_mobile) ){
                // _this.html(iconwarning+'手机号错误')
                UIkit.notification("手机号错误", { status: 'warning' })
                setTimeout(function(){
                    _this.html(deft)
                    _this.removeAttr("disabled")
                },3000)
                return false;
            }
            let s60 = 60;
            let text=''
            // window.sms_pass = true
            if (typeof TencentCaptcha != 'undefined' && verify_sms_send == 1) {
                TcaptchaHandler(function (TcaptchaRes) {
                    if (TcaptchaRes.ret != 0) {
                        _this.removeAttr("disabled")
                        return false;
                    }
                    $.ajax({
                        "action": "captcha_mobile",
                        "url": zongcai.ajaxurl,
                        "type": 'POST',
                        "data": {
                            "action": "captcha_mobile",
                            "user_mobile": user_mobile,
                            "smstype": $(_this).attr("data-smstype"),
                            "nonce": $(_this).attr("data-nonce"),
                            "randstr": TcaptchaRes.randstr,
                            "ticket": TcaptchaRes.ticket
                        },
                        success: function (data) {
                            if (data.success) {
                                UIkit.notification(data.data.msg, { status: 'success' })
                                window.sms_pass = true
                                const inval = setInterval(() => {
                                    if (s60 === 0) {
                                        clearInterval(inval)
                                        _this.attr('disabled', false);
                                        _this.text('发送验证码')
                                        return
                                    } else {

                                    }
                                    s60 = s60 - 1
                                    text = s60 + 's'
                                    _this.disabled = true
                                    _this.attr('disabled', true);
                                    _this.text('')
                                    _this.text(text);
                                }, 1000)

                                // setTimeout(function () {
                                //     _this.html(data.data.btn_msg)
                                // }, 3000)
                            } else {
                                UIkit.notification(data.data.msg, { status: 'warning' })
                                setTimeout(function () {
                                    _this.html(deft)
                                    _this.removeAttr("disabled")
                                }, 3000)
                            }
                        },
                        error: function () {
                            _this.removeAttr("disabled")

                        }
                    });
                });
            } else if (typeof vaptcha != 'undefined' && verify_sms_send == 2) {
                window.vaptcha_obj.then(function (VAPTCHAObj) {
                    // 将VAPTCHA验证实例保存到局部变量中
                    obj = VAPTCHAObj;

                    // 渲染验证组件
                    VAPTCHAObj.render();

                    // 验证成功进行后续操作
                    VAPTCHAObj.listen('pass', function () {
                        serverToken = VAPTCHAObj.getServerToken();
                        var data = {
                            server: serverToken.server,
                            token: serverToken.token,
                        }
                        window.vaptcha_pass = true
                        console.log(data)

                        $.ajax({
                            "action": "captcha_mobile",
                            "url": zongcai.ajaxurl,
                            "type": 'POST',
                            "data": {
                                "action": "captcha_mobile",
                                "user_mobile": user_mobile,
                                "smstype": $(_this).attr("data-smstype"),
                                "nonce": $(_this).attr("data-nonce"),
                            },
                            success: function (data) {
                                if (data.success) {
                                    UIkit.notification(data.data.msg, { status: 'success' })
                                    window.sms_pass = true
                                    const inval = setInterval(() => {
                                        if (s60 === 0) {
                                            clearInterval(inval)
                                            _this.attr('disabled', false);
                                            _this.text('发送验证码')
                                            return
                                        } else {

                                        }
                                        s60 = s60 - 1
                                        text = s60 + 's'
                                        _this.disabled = true
                                        _this.attr('disabled', true);
                                        _this.text('')
                                        _this.text(text);
                                    }, 1000)

                                    // setTimeout(function () {
                                    //     _this.html(data.data.btn_msg)
                                    // }, 3000)
                                } else {
                                    UIkit.notification(data.data.msg, { status: 'warning' })
                                    setTimeout(function () {
                                        _this.html(deft)
                                        _this.removeAttr("disabled")
                                    }, 3000)
                                }
                            },
                            error: function () {
                                _this.removeAttr("disabled")

                            }
                        });
                    })
                    obj.validate();
                })
            } else {
                $.ajax({
                    "action": "captcha_mobile",
                    "url": zongcai.ajaxurl,
                    "type": 'POST',
                    "data": {
                        "action": "captcha_mobile",
                        "user_mobile": user_mobile,
                        "smstype": $(_this).attr("data-smstype"),
                        "nonce": $(_this).attr("data-nonce"),
                    },
                    success: function (data) {
                        if (data.success) {
                            UIkit.notification(data.data.msg, { status: 'success' })
                            window.sms_pass = true
                            const inval = setInterval(() => {
                                if (s60 === 0) {
                                    clearInterval(inval)
                                    _this.attr('disabled', false);
                                    _this.text('发送验证码')
                                    return
                                } else {

                                }
                                s60 = s60 - 1
                                text = s60 + 's'
                                _this.disabled = true
                                _this.attr('disabled', true);
                                _this.text('')
                                _this.text(text);
                            }, 1000)

                            // setTimeout(function () {
                            //     _this.html(data.data.btn_msg)
                            // }, 3000)
                        } else {
                            UIkit.notification(data.data.msg, { status: 'warning' })
                            setTimeout(function () {
                                _this.html(deft)
                                _this.removeAttr("disabled")
                            }, 3000)
                        }
                    },
                    error: function () {
                        _this.removeAttr("disabled")

                    }
                });
            }
        });

        function is_check_mobile(str){
            // if((/^1[34578]\d{9}$/.test(str))){
            if((/^1[\d]\d{9}$/.test(str))){
                return true;
            }
            return false;//tmp
        }




    })
})(jQuery)

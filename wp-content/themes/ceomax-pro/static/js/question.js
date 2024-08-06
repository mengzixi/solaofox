(function ($){
    $(function (){

        $.fn.loading = function(t) {
            var a = $(this);
            t ? a.addClass("loading").prepend('<i class="wpcom-icon wi wi-loader"><svg aria-hidden="true"><use xlink:href="#wi-loader"></use></svg></i>') : a.removeClass("loading").find(".wi-loader").remove()
        }

        $(".question-money-v").on("click", function () {
            if ($(this).attr('data-v') > 0) {
                $(".ceo-question-money-input").val($(this).attr('data-v'))
            } else {
                UIkit.notification("请输入悬赏金额", { status: 'warning' })
                $(".ceo-question-money-input").val('')
                $(".ceo-question-money-input").focus()
            }

        })


    $(".button-select-answer").on("click",function (){
        var that=this
        
        UIkit.modal('#ceo-dialog-public').show()

        $('#submit-ceo-question-confirm').off('click').click(function () {
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: { post_id: $(that).attr('data-post_id'), comment_id: $(that).attr('data-comment_id'), action: 'select_the_answer' },
                type: 'post',
                success: function (data) {
                    if (data && data.success) {
                        UIkit.notification(data.data.msg, { status: 'success' })
                        location.href = data.data.url
                    } else if (data.data) {
                        UIkit.notification(data.data, { status: 'warning' })
                    } else {
                        UIkit.notification('操作出错', { status: 'warning' })
                    }
                },
                error: function (e) {
                    UIkit.notification('操作出错', { status: 'warning' })
                }
            })
        })
    })

    // $(function() {
        'use strict';
        $('#j-form-question .question-tj').on('click', function (e) {
            e.preventDefault()
            let $btn = $(this).find('button[type=submit]');
            if ($btn.hasClass('loading')) return false;
            $btn.attr("disabled","true");
            $btn.prepend('<div ceo-spinner id="q_spinner"></div>')

            var error = 0;
            $('#post-tags').remove();
            if (typeof tinyMCE != "undefined") {
                tinyMCE.triggerSave();
                var ed = tinyMCE.activeEditor;
                if(ed){
                    ed.off('change').on('change', function (ed) {
                        $('.wp-editor-wrap').removeClass('error');
                    });
                }
            }
            var title = $.trim($('#question_title').val());
            var content = $.trim($('#question_content').val());
            var category = $('#question_cat').val();
            if (title == '') {
                $('#question_title').addClass('error');
                error = 1;
                  UIkit.notification('请输入问题标题', { status: 'warning' })
            }
            if (content == '') {
                $('.wp-editor-wrap').addClass('error');
                error = 1;
               UIkit.notification('请输入问题内容', { status: 'warning' })
            }
            if (!category) {
                $('#question_cat').addClass('error');
                UIkit.notification('请选择分类', { status: 'warning' })
                error = 1;
            }
            if (error) {
                $btn.loading(0);
                $btn.removeAttr("disabled");
                $("#q_spinner").remove()
                return false;
            }

            if (verify_question_new) {
                TcaptchaHandler(function (TcaptchaRes) {
                    if (TcaptchaRes.ret != 0) {
                        $btn.removeAttr("disabled")
                        $("#q_spinner").remove()
                        return false;
                    }
                    var form_data = $.param({'randstr': TcaptchaRes.randstr, 'ticket': TcaptchaRes.ticket}) + '&' + $('#j-form-question').serialize();
                    $.ajax({
                        url: '/wp-admin/admin-ajax.php',
                        data: form_data,
                        type: 'post',
                        success: function (data) {
                            $btn.removeAttr("disabled")
                            $("#q_spinner").remove()
                            if (data && data.success) {
                                UIkit.notification(data.data.msg, { status: 'success' })
                                location.href = data.data.url
                            } else if (data.data) {
                                UIkit.notification(data.data, { status: 'warning' })
                            } else {
                                UIkit.notification('添加出错', { status: 'warning' })
                            }
                        },
                        error: function (e) {
                            $btn.removeAttr("disabled")
                            $("#q_spinner").remove()

                        }
                    });

                    return false;
                });
            } else if (typeof vaptcha != 'undefined') {
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
                        // 账号或密码错误等原因导致登录失败，重置人机验证
                        // VAPTCHAObj.reset()

                        var form_data = $('#j-form-question').serialize();
                        $.ajax({
                            url: '/wp-admin/admin-ajax.php',
                            data: form_data,
                            type: 'post',
                            success: function (data) {
                                $btn.removeAttr("disabled")
                                $("#q_spinner").remove()
                                if (data && data.success) {
                                    UIkit.notification(data.data.msg, { status: 'success' })
                                    location.href = data.data.url
                                } else if (data.data) {
                                    UIkit.notification(data.data, { status: 'warning' })
                                } else {
                                    UIkit.notification('添加出错', { status: 'warning' })
                                }
                            },
                            error: function (e) {
                                $btn.removeAttr("disabled")
                                $("#q_spinner").remove()

                            }
                        });
                    })
                })
                obj.validate();
            } else {
                var form_data = $('#j-form-question').serialize();
                $.ajax({
                    url: '/wp-admin/admin-ajax.php',
                    data: form_data,
                    type: 'post',
                    success: function (data) {
                        $btn.removeAttr("disabled")
                        $("#q_spinner").remove()
                        if (data && data.success) {
                            UIkit.notification(data.data.msg, { status: 'success' })
                            location.href = data.data.url
                        } else if (data.data) {
                            UIkit.notification(data.data, { status: 'warning' })
                        } else {
                            UIkit.notification('添加出错', { status: 'warning' })
                        }
                    },
                    error: function (e) {
                        $btn.removeAttr("disabled")
                        $("#q_spinner").remove()

                    }
                });

                return false;
            }
            
        }).on('input propertychange', '.form-control', function () {
            $(this).removeClass('error');
        });


        // $(function() {
        //     'use strict';
            $('#j-form-forum .forum-tj').on('click', function (e) {
                e.preventDefault()
                let $btn = $(this).find('button[type=submit]');
                if ($btn.hasClass('loading')) return false;
                $btn.attr("disabled","true");
                $btn.prepend('<div ceo-spinner id="q_spinner"></div>')

                var error = 0;
                $('#post-tags').remove();
                if (typeof tinyMCE != "undefined") {
                    tinyMCE.triggerSave();
                    var ed = tinyMCE.activeEditor;
                    if(ed){
                        ed.off('change').on('change', function (ed) {
                            $('.wp-editor-wrap').removeClass('error');
                        });
                    }
                }
                var title = $.trim($('#forum_title').val());
                var content = $.trim($('#forum_content').val());
                var category = $('#forum_cat').val();
                if (title == '') {
                    $('#forum_title').addClass('error');
                    error = 1;
                   UIkit.notification('请输入问题标题', { status: 'warning' })
                }
                if (content == '') {
                    $('.wp-editor-wrap').addClass('error');
                    error = 1;
                    UIkit.notification('请输入问题内容', { status: 'warning' })
                }
                if (!category) {
                    $('#forum_cat').addClass('error');
                    error = 1;
                    UIkit.notification('请选择分类', { status: 'warning' })
                }
                if (error) {
                    $btn.loading(0);
                    $btn.removeAttr("disabled");
                    $("#q_spinner").remove()
                    return false;
                }

               if (verify_forum_new) {
                    TcaptchaHandler(function (TcaptchaRes) {
                        if (TcaptchaRes.ret != 0) {
                            $btn.removeAttr("disabled")
                            $("#q_spinner").remove()
                            return false;
                        }
                        var form_data = $.param({'randstr': TcaptchaRes.randstr, 'ticket': TcaptchaRes.ticket}) + '&' + $('#j-form-forum').serialize();
                        $.ajax({
                            url: '/wp-admin/admin-ajax.php',
                            data: form_data,
                            type: 'post',
                            success: function (data) {
                                $btn.removeAttr("disabled")
                                $("#q_spinner").remove()
                                if (data && data.success) {
                                    UIkit.notification(data.data.msg, { status: 'success' })
                                    location.href = data.data.url
                                } else if (data.data) {
                                    UIkit.notification(data.data, { status: 'warning' })
                                } else {
                                    UIkit.notification('添加出错', { status: 'warning' })
                                }
                            },
                            error: function (e) {
                                $btn.removeAttr("disabled")
                                $("#q_spinner").remove()
                                UIkit.notification('操作出错', { status: 'warning' })

                            }
                        });

                        return false;
                    });
                } else if (typeof vaptcha != 'undefined') {
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
                            // 账号或密码错误等原因导致登录失败，重置人机验证
                            // VAPTCHAObj.reset()

                            var form_data = $('#j-form-forum').serialize();
                            $.ajax({
                                url: '/wp-admin/admin-ajax.php',
                                data: form_data,
                                type: 'post',
                                success: function (data) {
                                    $btn.removeAttr("disabled")
                                    $("#q_spinner").remove()
                                    if (data && data.success) {
                                        UIkit.notification(data.data.msg, { status: 'success' })
                                        location.href = data.data.url
                                    } else if (data.data) {
                                        UIkit.notification(data.data, { status: 'warning' })
                                    } else {
                                        UIkit.notification('添加出错', { status: 'warning' })
                                    }
                                },
                                error: function (e) {
                                    $btn.removeAttr("disabled")
                                    $("#q_spinner").remove()
                                    UIkit.notification('操作出错', { status: 'warning' })

                                }
                            });
                        })
                    })
                    obj.validate();
                } else {
                    var form_data = $('#j-form-forum').serialize();
                    $.ajax({
                        url: '/wp-admin/admin-ajax.php',
                        data: form_data,
                        type: 'post',
                        success: function (data) {
                            $btn.removeAttr("disabled")
                            $("#q_spinner").remove()
                            if (data && data.success) {
                                UIkit.notification(data.data.msg, { status: 'success' })
                                location.href = data.data.url
                            } else if (data.data) {
                                UIkit.notification(data.data, { status: 'warning' })
                            } else {
                                UIkit.notification('添加出错', { status: 'warning' })
                            }
                        },
                        error: function (e) {
                            $btn.removeAttr("disabled")
                            $("#q_spinner").remove()
                            UIkit.notification('操作出错', { status: 'warning' })

                        }
                    });

                    return false;
                }

            }).on('input propertychange', '.form-control', function () {
                $(this).removeClass('error');
            });

        });

    // });
})(jQuery)

$(function () {
    // 用户签到
    $('.btn-ceo-sign').click(function () {
        let btnLoading = Ladda.create(this);
        btnLoading.start()

        $.ajax({
            url: zongcai.ajaxurl + '?action=ceo_shop_user_sign_in',
            method: 'GET',
            success: function (res) {
                // 弹出框展示
                $('#ceoshop-member-box').html(res)
                UIkit.modal('#ceo-sign').show()
                UIkit.util.on('#ceo-sign', 'hidden', function () {
                    $('#ceoshop-member-box').html()
                    $('#ceo-sign').remove()
                });
                btnLoading.stop()
                btnLoading.remove()

                // 用户签到提交
                $('#submit-ceo-sign').click(function () {
                    let btnLoading = Ladda.create(this);
                    btnLoading.start()
                    const data = {
                        action: 'ceo_shop_user_sign_in',
                        nonce: $('#ceo-sign-nonce').val(),
                    }
                    $.post(zongcai.ajaxurl, data, function (res) {
                        btnLoading.stop()
                        btnLoading.remove()
                        if (res.success) {
                            UIkit.notification(res.data, { status: 'success' })
                            window.setTimeout(function () {
                                window.location.reload()
                            }, 1500)
                        } else {
                            UIkit.notification(res.data, { status: 'warning' })
                        }
                    })
                })
            }
        })
    })

    // 积分兑换
    $('.btn-ceo-exchange').click(function () {
        let btnLoading = Ladda.create(this);
        btnLoading.start()

        $.ajax({
            url: zongcai.ajaxurl + '?action=ceo_shop_pay_integral',
            method: 'GET',
            success: function (res) {
                // 弹出框展示
                $('#ceoshop-member-box').html(res)
                UIkit.modal('#ceo-exchange').show()
                UIkit.util.on('#ceo-exchange', 'hidden', function () {
                    $('#ceoshop-member-box').html()
                    $('#ceo-exchange').remove()
                });
                btnLoading.stop()
                btnLoading.remove()

                // 积分兑换提交
                $('#submit-ceo-exchange').click(function () {
                    let btnLoading = Ladda.create(this);
                    btnLoading.start()
                    const data = {
                        action: 'ceo_shop_pay_integral',
                        num: $('#ceo-exchange-num').val(),
                        nonce: $('#ceo-exchange-nonce').val(),
                    }
                    $.post(zongcai.ajaxurl, data, function (res) {
                        btnLoading.stop()
                        btnLoading.remove()
                        if (res.success) {
                            UIkit.notification('兑换成功，最新余额：' + res.data, { status: 'success' })
                            window.setTimeout(function () {
                                window.location.reload()
                            }, 1500)
                        } else {
                            UIkit.notification(res.data, { status: 'warning' })
                        }
                    })
                })
            }
        })
    })

    // 收益提现
    $('#btn-ceo-extract').click(function () {
        let btnLoading = Ladda.create(this);
        btnLoading.start()

        $.ajax({
            url: zongcai.ajaxurl + '?action=ceo_shop_user_withdraw',
            method: 'GET',
            success: function (res) {
                // 弹出框展示
                $('#ceoshop-member-box').html(res)
                UIkit.modal('#ceo-extract').show()
                UIkit.util.on('#ceo-extract', 'hidden', function () {
                    $('#ceoshop-member-box').html()
                    $('#ceo-extract').remove()
                });
                btnLoading.stop()
                btnLoading.remove()

                // 提现方式
                $('.withdraw-type').click(function () {
                    $('.withdraw-type').removeClass('select')
                    $(this).addClass('select')
                    $('#ceo-withdraw-type').val($(this).data('type'))

                    if ($('#ceo-withdraw-type').val() == 1) {
                        $('#withdraw-info').show()
                        $('#withdraw-real-money').show()
                        $('#withdraw-site-money').hide()
                    }
                    if ($('#ceo-withdraw-type').val() == 2) {
                        $('#withdraw-info').hide()
                        $('#withdraw-real-money').hide()
                        $('#withdraw-site-money').show()
                    }
                })

                // 到账金额
                $('#ceo-withdraw-money').on('input', function () {
                    let money = $(this).val()
                    if (!money) {
                        money = 0
                    }
                    let fee = $(this).data('fee')
                    let proportion = $(this).data('proportion')

                    let actualMoney = Decimal.sub(
                        parseFloat(money),
                        Decimal.mul(parseFloat(money), Decimal.div(parseFloat(fee), 100))
                    ).toFixed(2, Decimal.ROUND_DOWN)

                    let realMoney = Decimal.div(
                        parseFloat(actualMoney),
                        parseFloat(proportion)).toFixed(2, Decimal.ROUND_DOWN)
                    $('#withdraw-real-money').html('现金到账<em>' + realMoney + '元</em>')

                    let currency = $('#ceo-withdraw-currency').val()
                    $('#withdraw-site-money').html(currency + '到账<em>' + parseFloat(actualMoney) + currency + '</em>')
                })

                // 积分兑换提交
                $('#submit-ceo-extract').click(function () {
                    let btnLoading = Ladda.create(this);
                    btnLoading.start()
                    const data = {
                        action: 'ceo_shop_user_withdraw',
                        withdraw: $('#ceo-withdraw-type').val(),
                        alipay_account: $('#ceo-withdraw-alipay-account').val(),
                        alipay_real_name: $('#ceo-withdraw-real-name').val(),
                        contact_mobile: $('#ceo-withdraw-contact-mobile').val(),
                        money: $('#ceo-withdraw-money').val(),
                        nonce: $('#ceo-withdraw-nonce').val(),
                    }
                    $.post(zongcai.ajaxurl, data, function (res) {
                        btnLoading.stop()
                        btnLoading.remove()
                        if (res.success) {
                            UIkit.notification(res.data, { status: 'success' })
                            window.location.reload()
                        } else {
                            UIkit.notification(res.data, { status: 'warning' })
                        }
                    })
                })
            }
        })
    })

    // 余额充值
    $('.btn-ceo-recharge').click(function () {
        let btnLoading = Ladda.create(this);
        btnLoading.start()

        let checkInterval = null
        let _UIKit = UIkit

        $.ajax({
            url: zongcai.ajaxurl + '?action=ceo_shop_pay',
            method: 'GET',
            success: function (res) {
                // 弹出框展示
                $('#ceoshop-member-box').html(res)
                _UIKit.modal('#ceo-recharge').show()
                _UIKit.util.on('#ceo-recharge', 'hidden', function () {
                    $('#ceoshop-member-box').html()
                    $('#ceo-recharge').remove()
                });
                btnLoading.stop()
                btnLoading.remove()

                // 套餐选择
                $('.recharge-pay-money').click(function () {
                    $('.recharge-pay-money').removeClass('select')
                    $(this).addClass('select')
                    $('#ceo-recharge-num').val($(this).data('money'))
                })

                // 输入时去除套餐选择效果
                $('#ceo-recharge-num').focus(function () {
                    $('.recharge-pay-money').removeClass('select')
                })

                // 支付方式
                $('.recharge-pay-payment').click(function () {
                    $('.recharge-pay-payment').removeClass('select')
                    $(this).addClass('select')
                    $('#ceo-recharge-payment').val($(this).data('payment'))
                })

                // 余额充值提交
                $('#submit-ceo-recharge').click(function () {
                    let btnLoading = Ladda.create(this);
                    btnLoading.start()
                    const data = {
                        action: 'ceo_shop_pay',
                        payment: $('#ceo-recharge-payment').val(),
                        money: Decimal.div(
                            parseFloat($('#ceo-recharge-num').val()),
                            parseFloat($('#ceo-recharge-proportion').val())
                        ).toFixed(2, Decimal.ROUND_DOWN),
                        nonce: $('#ceo-recharge-nonce').val(),
                    }

                    $.post(zongcai.ajaxurl, data, function (res) {
                        if (res.success) {
                            if (res.data.pay_url) {
                                if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                                    window.location.href = res.data.pay_url
                                } else {
                                    window.open(res.data.pay_url)
                                }
                            }
                            if (res.data.jssdk) {
                                if (typeof WeixinJSBridge == "undefined") {
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    }
                                } else {
                                    WeixinJSBridge.invoke(
                                        'getBrandWCPayRequest', res.data.jssdk,
                                        function (res) {
                                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                            }
                                        });
                                }
                            }
                            if (res.data.qr_code) {
                                // 弹出框展示
                                $('#ceoshop-member-box').html(res.data.html)
                                _UIKit.modal('#ceo-payment-wrap').show()
                                _UIKit.util.on('#ceo-payment-wrap', 'hidden', function () {
                                    $('#ceoshop-member-box').html()
                                    $('#ceo-payment-wrap').remove()
                                })
                            }
                            setTimeout(function () {
                                check(res.data.order_sn);
                            }, 1000);
                        } else {
                            btnLoading.stop()
                            btnLoading.remove()
                            UIkit.notification(res.data, { status: 'warning' })
                        }
                    })
                })

                // 卡密充值
                $('#btn-ceo-cards').click(function () {
                    // let btnLoading = Ladda.create(this);
                    // btnLoading.start()
                    $.ajax({
                        url: zongcai.ajaxurl + '?action=ceo_shop_pay_code',
                        method: 'GET',
                        success: function (res) {
                            // 弹出框展示
                            $('#ceoshop-member-box').html(res)
                            _UIKit.modal('#ceo-cards').show()
                            _UIKit.util.on('#ceo-cards', 'hidden', function () {
                                $('#ceoshop-member-box').html()
                                $('#ceo-cards').remove()
                            });
                            // btnLoading.stop()
                            // btnLoading.remove()
                            // 卡密充值提交
                            $('#submit-ceo-card').click(function () {
                                let btnLoading = Ladda.create(this);
                                btnLoading.start()
                                const data = {
                                    action: 'ceo_shop_pay_code',
                                    code: $('#ceo-card-code').val(),
                                    nonce: $('#ceo-card-nonce').val(),
                                }
                                $.post(zongcai.ajaxurl, data, function (res) {
                                    btnLoading.stop()
                                    btnLoading.remove()
                                    if (res.success) {
                                        UIkit.notification('订单支付成功！', { status: 'success' })
                                        window.setTimeout(function () {
                                            window.location.reload()
                                        }, 1500)
                                    } else {
                                        UIkit.notification(res.data, { status: 'warning' })
                                    }
                                })
                            })
                        }
                    })
                })
            }
        })

        function check(orderSn) {
            $.ajax({
                url: zongcai.ajaxurl + '?action=ceo_shop_pay_check&order_sn=' + orderSn,
                method: 'GET',
                success: function (res) {
                    if (res.success) {
                        UIkit.notification('订单支付成功！', { status: 'success' })
                        window.setTimeout(function () {
                            window.location.reload()
                        }, 1500)
                    } else {
                        console.log('订单支付仍在进行中...')
                        setTimeout(function () {
                            check(orderSn);
                        }, 1000);
                    }
                },
                error: function () {
                    console.log('检测订单支付状态时发生错误！')
                    setTimeout(function () {
                        check(orderSn);
                    }, 1000);
                }
            });
        }
    })

    // 开通VIP
    $('.btn-ceo-svip').click(function () {
        let loadingStyle = $(this).data('style')
        if (loadingStyle) {
            var btnLoading = Ladda.create(this);
            btnLoading.start()
        }

        let checkInterval = null
        let _UIKit = UIkit

        $.ajax({
            url: zongcai.ajaxurl + '?action=ceo_shop_pay_vip&vip_id=' + $(this).data('vip-id'),
            method: 'GET',
            success: function (res) {
                // 弹出框展示
                $('#ceoshop-member-box').html(res)
                _UIKit.modal('#ceo-svip').show()
                _UIKit.util.on('#ceo-svip', 'hidden', function () {
                    $('#ceoshop-member-box').html()
                    $('#ceo-svip').remove()
                });
                if (loadingStyle) {
                    btnLoading.stop()
                    btnLoading.remove()
                }

                // 套餐选择
                $('.svip-select').click(function () {
                    $('.svip-select').removeClass('select')
                    $(this).addClass('select')

                    $('#svip-current-desc').html($(this).data('desc'))

                    $('#ceo-svip-id').val($(this).data('id'))
                    $('#ceo-svip-price').val($(this).data('price'))

                    // 切换套餐去除使用的优惠券
                    $('#svip-use-coupon-code').val('')
                    $('#ceo-svip-discount').val('0.00')
                    $('#svip-show-discount').text('优惠￥0')
                    $('#svip-show-discount').hide()

                    // 计算支付金额
                    calcRealPay()
                })

                // 支付方式
                $('.svip-pay-payment').click(function () {
                    $('.svip-pay-payment').removeClass('select')
                    $(this).addClass('select')
                    $('#ceo-svip-payment').val($(this).data('payment'))
                    calcRealPay()
                })

                // 使用优惠券
                $('#svip-use-coupon').click(function () {
                    let btnLoading = Ladda.create(this);
                    btnLoading.start()
                    let code = $('#svip-use-coupon-code').val()
                    $.ajax({
                        url: zongcai.ajaxurl + '?action=ceo_shop_pay_vip_coupon&code=' + code + '&vip_id=' + $('#ceo-svip-id').val(),
                        method: 'GET',
                        success: function (res) {
                            btnLoading.stop()
                            btnLoading.remove()
                            if (res.success) {
                                $('#ceo-svip-discount').val(res.data.money)
                                $('#svip-show-discount').text('优惠￥' + res.data.money)
                                $('#svip-show-discount').show()
                                calcRealPay()
                                UIkit.notification('代金券使用成功', { status: 'success' })
                            } else {
                                $('#ceo-svip-discount').val('0.00')
                                $('#svip-show-discount').text('优惠￥0')
                                $('#svip-show-discount').hide()
                                calcRealPay()
                                UIkit.notification(res.data, { status: 'warning' })
                            }
                        },
                        error: function () {
                            console.log('检测订单支付状态时发生错误！')
                        }
                    });
                })

                // 开通VIP提交
                $('#submit-ceo-svip').click(function () {
                    let btnLoading = Ladda.create(this);
                    btnLoading.start()
                    const data = {
                        action: 'ceo_shop_pay_vip',
                        payment: $('#ceo-svip-payment').val(),
                        vip_id: $('#ceo-svip-id').val(),
                        coupon_code: $('#svip-use-coupon-code').val(),
                        nonce: $('#ceo-svip-nonce').val(),
                    }
                    $.post(zongcai.ajaxurl, data, function (res) {
                        if (res.success) {
                            if (res.data.pay_status == 0) {
                                if (res.data.pay_url) {
                                    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                                        window.location.href = res.data.pay_url
                                    } else {
                                        window.open(res.data.pay_url)
                                    }
                                }
                                if (res.data.jssdk) {
                                    if (typeof WeixinJSBridge == "undefined") {
                                        if (document.addEventListener) {
                                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                        } else if (document.attachEvent) {
                                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                        }
                                    } else {
                                        WeixinJSBridge.invoke(
                                            'getBrandWCPayRequest', res.data.jssdk,
                                            function (res) {
                                                if (res.err_msg == "get_brand_wcpay_request:ok") {
                                                }
                                            });
                                    }
                                }
                                if (res.data.qr_code) {
                                    // 弹出框展示
                                    $('#ceoshop-member-box').html(res.data.html)
                                    _UIKit.modal('#ceo-payment-wrap').show()
                                    _UIKit.util.on('#ceo-payment-wrap', 'hidden', function () {
                                        $('#ceoshop-member-box').html()
                                        $('#ceo-payment-wrap').remove()
                                    });
                                }
                                setTimeout(function () {
                                    check(res.data.order_sn);
                                }, 1000);
                            } else {
                                btnLoading.stop()
                                btnLoading.remove()
                                UIkit.notification('订单支付成功！', { status: 'success' })
                                window.setTimeout(function () {
                                    window.location.reload()
                                }, 1500)
                            }
                        } else {
                            btnLoading.stop()
                            btnLoading.remove()
                            UIkit.notification(res.data, { status: 'warning' })
                        }
                    })
                })
            }
        })

        /**
        * 计算实际支付价格并显示
        * 实付价格： (应付 - 折扣) / 比例 + 运费
        */
        function calcRealPay() {
            let tempTotalPrice = Decimal.sub(
                parseFloat($('#ceo-svip-price').val()),
                parseFloat($('#ceo-svip-discount').val())
            ).toFixed(2, Decimal.ROUND_DOWN)

            if ($('#ceo-svip-payment').val() != 'balance') {
                tempTotalPrice = Decimal.div(
                    parseFloat(tempTotalPrice),
                    parseFloat($('#ceo-svip-proportion').val())
                ).toFixed(2, Decimal.ROUND_DOWN)
            }

            if (tempTotalPrice < 0) {
                tempTotalPrice = '0.00'
            }

            if ($('#ceo-svip-payment').val() != 'balance') {
                $('#ceo_price').html('￥<span id="ceo-svip-total">' + tempTotalPrice + '</span>')
            } else {
                $('#ceo_price').html('&nbsp;<span id="ceo-svip-total">' + tempTotalPrice + '</span> ' + $('#ceo-currency-name').val())
            }
        }

        function check(orderSn) {
            $.ajax({
                url: zongcai.ajaxurl + '?action=ceo_shop_pay_vip_check&order_sn=' + orderSn,
                method: 'GET',
                success: function (res) {
                    if (res.success) {
                        UIkit.notification('订单支付成功！', { status: 'success' })
                        window.setTimeout(function () {
                            window.location.reload()
                        }, 1500)
                    } else {
                        console.log('订单支付仍在进行中...')
                        setTimeout(function () {
                            check(orderSn);
                        }, 1000);
                    }
                },
                error: function () {
                    console.log('检测订单支付状态时发生错误！')
                    setTimeout(function () {
                        check(orderSn);
                    }, 1000);
                }
            });
        }
    })

    // 转盘抽奖
    $('.btn-ceo-lottery').click(function () {
        $.ajax({
            url: zongcai.ajaxurl + '?action=ceo_shop_activity_lottery_info',
            method: 'GET',
            success: function (res) {
                // 弹出框展示
                $('#ceoshop-member-box').html(res)
                UIkit.modal('#ceo-ceoshop-lottery').show()
                UIkit.util.on('#ceo-ceoshop-lottery', 'hidden', function () {
                    $('#ceoshop-member-box').html()
                    $('#ceo-ceoshop-lottery').remove()
                });

                let luckyConfig = {
                    width: '390px',
                    height: '390px',
                    blocks: [{
                        padding: '10px',
                        background: '#869cfa'
                    }],
                    prizes: [],
                    buttons: [{
                        radius: '35%',
                        imgs: [{
                            src: '/wp-content/themes/ceomax-pro/ceoshop/assets/img/lottery/btn.png',
                            width: '90%',
                            top: '-120%'
                        }]
                    }],
                    start: function () {
                        // 开始游戏
                        const data = {
                            action: 'ceo_shop_activity_lottery_start',
                            nonce: $('#ceo-lottery-nonce').val(),
                        }
                        $.post(zongcai.ajaxurl, data, function (res) {
                            if (res.success) {
                                myLucky.play()
                                myLucky.stop(res.data.index)
                            } else {
                                UIkit.notification(res.data, { status: 'warning' })
                            }
                        })
                    },
                    end: function (prize) {
                        UIkit.notification(prize.msg, { status: 'success' })
                    }
                }

                for (let i = 0; i < lottery_item.length; i++) {
                    luckyConfig.prizes.push({
                        fonts: [{
                            text: lottery_item[i].text,
                            top: '20%'
                        }],
                        msg: lottery_item[i].msg,
                        imgs: [{
                            src: lottery_item[i].img,
                            width: '25%',
                            top: '45%'
                        }],
                        background: i % 2 == 0 ? '#e9e8fe' : '#b8c5f2'
                    })
                }

                const myLucky = new LuckyCanvas.LuckyWheel('#my-lucky', luckyConfig)
            }
        })
    })
})

//复制推广链接
function copyText() {
    var copyText = document.getElementById("promotion-link");
    copyText.select();
    document.execCommand("copy");
    UIkit.notification({
        message: '复制成功',
        status: 'success'
    });
}
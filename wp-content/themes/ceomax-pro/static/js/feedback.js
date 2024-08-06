$(function () {
    $(".feedback_reply").on("click", function(){
        if ($(this).attr("data-id")) {
            location.href='/member/reply_feedback?post_id='+$(this).attr("data-id")
        }
    })
    $(".feedback_delete").on("click", function () {
        that = this
        if ($(that).attr("data-id")) {
            data = {
                action: "feedback_delete",
                'post_id': $(that).attr("data-id")
            }
            if(!confirm("确认删除吗")){
                return false;
            }
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                dataType: 'json',
                data: data,
                type: 'post',
                success: function (data) {
                    if (data.code == 1) {
                        alert(data.msg);
                        location.reload()
                    } else {
                        alert(data.msg)
                    }
                }
            })

        }
    })

    $(".feedback_end").on("click", function () {
        that = this
        if ($(that).attr("data-id")) {
            data = {
                action: "feedback_end",
                'post_id': $(that).attr("data-id")
            }
            if(!confirm("确认结束吗")){
                return false;
            }
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                dataType: 'json',
                data: data,
                type: 'post',
                success: function (data) {
                    if (data.code == 1) {
                        // alert(data.msg);
                        location.reload()
                    } else {
                        alert(data.msg)
                    }
                }
            })

        }
    })

});

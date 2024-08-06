$(function() {
    if(window.screen.availWidth>768){

        jQuery(".sidebar-column").theiaStickySidebar({
            additionalMarginTop:  0
        })
    }
    $(".consultingshop li").on("click",function () {
        var indexs = $(this).index()
        $('.consultingshop .ceo-display-inline-block span').removeClass("current");
        $('.consultingshop .ceo-display-inline-block span').eq(indexs).addClass("current");
    })
})

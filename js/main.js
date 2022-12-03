(
    function () {
    //当浏览器窗口被调整大小时触发
    window.onresize = function () {
        ShowHideElement("i-link-box", "linkList-item", 845);
    }
    window.onload = function () {
        ShowHideElement("i-link-box", "linkList-item", 845);
    }

    function ShowHideElement(Element1, Element2, Vaule) {
        var Person = document.getElementsByClassName(Element1);
        var BoxHeight = document.getElementsByClassName(Element2);
        var WindowHeight = window.innerHeight || document.body.clientHeight;
        //遍历获取到的元素
        for (var i = 6; i < Person.length; i++) {
            if (WindowHeight <= Vaule && deviceVal === "pc") {
                Person[i].style.display = "none";
                BoxHeight[0].style.marginTop = "5px";
            } else {
                Person[i].style.display = "block";
                BoxHeight[0].style.marginTop = "0px";
            }
        }
    }

    window.ShowHideElement = ShowHideElement;
}());

var now = -1;
var resLength = 0;
var listIndex = -1;
var hotList = 0;
var thisSearch = 'https://www.baidu.com/s?ie=utf-8&wd=';
$('#search-icon').children().attr('xlink:href', '#icon-baidu')
var thisSearchIcon = './logo.jpg';
var storage = window.localStorage;
if (!storage.stopHot) {
    storage.stopHot = true
}
storage.stopHot == 'false'
    ? $('#hot-btn').attr(
        'style',
        'background: url(./image/hotg.svg) no-repeat center/cover;'
    )
    : $('#hot-btn').attr(
        'style',
        'background: url(./image/hotk.svg) no-repeat center/cover;'
    );
var ssData = storage.searchEngine;
if (storage.searchEngine != undefined) {
    ssData = ssData.split(',');
    thisSearch = ssData[0];
    $('#search-icon').children().attr('xlink:href', ssData[1])
	$('#txt').attr('placeholder', ssData[2])
}

function getHotkeywordbak(value) {
    $.ajax({
        type: "GET",
        url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
        async: true,
        data: {
            wd: value
        },
        dataType: "jsonp",
        jsonp: "cb",
        success: function (res) {
            $("#box ul").text("");
            hotList = res.s.length;
            if (hotList) {
                $("#box").css("display", "block");
                for (var i = 0; i < hotList; i++) {
                    $("#box ul").append("<li><span>" + (
                        i + 1
                    ) + "</span>" + res.s[i] + "</li>");
                    $("#box ul li")
                        .eq(i)
                        .click(function () {
                            $('#txt').val(this.childNodes[1].nodeValue);
							aopen(thisSearch , this.childNodes[1].nodeValue);
                            $('#box').css('display', 'none')
                        });
                    if (i === 0) {
                        $("#box ul li")
                            .eq(i)
                            .css({"border-top": "none"});
                        $("#box ul span")
                            .eq(i)
                            .css({"color": "#fff", "background": "#f54545"})
                    } else {
                        if (i === 1) {
                            $("#box ul span")
                                .eq(i)
                                .css({"color": "#fff", "background": "#ff8547"})
                        } else {
                            if (i === 2) {
                                $("#box ul span")
                                    .eq(i)
                                    .css({"color": "#fff", "background": "#ffac38"})
                            }
                        }
                    }
                }
            } else {
                $("#box").css("display", "none")
            }
        },
        error: function (res) {
            console.log(res)
        }
    })
}
function getHotkeyword(value) {
    $.ajax({
        type: "GET",
        url: "https://sug.so.360.cn/suggest",
        async: true,
        data: {
            word: value
        },
        dataType: "jsonp",
        jsonp: "callback",
        success: function (res) {
            $("#box ul").text("");
            hotList = res.result.length;E
            if (hotList) {
                $("#box").css("display", "block");
                for (var i = 0; i < hotList; i++) {
                    $("#box ul").append("<li><span>" + (
                        i + 1
                    ) + "</span>" + res.result[i].word + "</li>");
                    $("#box ul li")
                        .eq(i)
                        .click(function () {
                            $('#txt').val(this.childNodes[1].nodeValue);
							aopen(thisSearch , this.childNodes[1].nodeValue);
                            $('#box').css('display', 'none')
                        });
                    if (i === 0) {
                        $("#box ul li")
                            .eq(i)
                            .css({"border-top": "none"});
                        $("#box ul span")
                            .eq(i)
                            .css({"color": "#fff", "background": "#f54545"})
                    } else {
                        if (i === 1) {
                            $("#box ul span")
                                .eq(i)
                                .css({"color": "#fff", "background": "#ff8547"})
                        } else {
                            if (i === 2) {
                                $("#box ul span")
                                    .eq(i)
                                    .css({"color": "#fff", "background": "#ffac38"})
                            }
                        }
                    }
                }
            } else {
                $("#box").css("display", "none")
            }
        },
        error: function (res) {
            console.log(res)
        }
    })
}

// 按键松开时执行
$("#txt").keyup(function (e) {
    if ($(this).val()) {
        if (e.keyCode == 38 || e.keyCode == 40 || storage.stopHot != 'true') {
            return
        }
        $("#search-clear").css("display", "block");
        getHotkeyword($(this).val())
    } else {
        $("#search-clear").css("display", "none");
        $("#box").css("display", "none")
    }
});

$("#txt").keydown(function (e) {
    if (e.keyCode === 40) {
        listIndex === (hotList - 1)
            ? listIndex = 0
            : listIndex++;
        $("#box ul li")
            .eq(listIndex)
            .addClass("current")
            .siblings()
            .removeClass("current");
        var hotValue = $("#box ul li")
            .eq(listIndex)[0]
            .childNodes[1]
            .nodeValue;
        $("#txt").val(hotValue)
    }
    if (e.keyCode === 38) {
        if (e.preventDefault) {
            e.preventDefault()
        }
        if (e.returnValue) {
            e.returnValue = false
        }
        listIndex === 0 || listIndex === -1
            ? listIndex = (hotList - 1)
            : listIndex--;
        $("#box ul li")
            .eq(listIndex)
            .addClass("current")
            .siblings()
            .removeClass("current");
        var hotValue = $("#box ul li")
            .eq(listIndex)[0]
            .childNodes[1]
            .nodeValue;
        $("#txt").val(hotValue)
    }
    if (e.keyCode === 13) {
		var keys = $("#txt").val();
		if (keys.length == 0) {
				$("#txt").attr("placeholder", "没有关键词无法为你进行搜索！╮(￣▽￣)╭ ");
				return false
		}else{
		aopen(thisSearch , $("#txt").val());
        //window.open(thisSearch + $("#txt").val());
        $("#box").css("display", "none");
        $("#txt").blur();
        $("#box ul li").removeClass("current");
        listIndex = -1
			
		}
		
    }
		
});
$("#search-clear").click(function () {
    $('#txt').val("");
    $('#search-clear').css('display', 'none');
    $("#box").css("display", "none");
});
$(".search-btn").click(function () {
	var keys = $("#txt").val();
	if (keys.length == 0) {
		$("#txt").attr("placeholder", "没有关键词无法为你进行搜索！╮(￣▽￣)╭ ");
		return false
	}else{
	aopen(thisSearch , $("#txt").val());
    $("#box").css("display", "none");
    $("#txt").blur();
    $("#box ul li").removeClass("current");
    listIndex = -1
	}
});
//模拟提交
function aopen(url,data) {

	 
		data = data
                .replace(/\%/g,"%25")
                .replace(/\ /g,"%20")
                .replace(/\+/g,"%2B")
                .replace(/\//g,"%2F")
                .replace(/\?/g,"%3F")
                .replace(/\&/g,"%26")
                .replace(/\=/g,"%3D")
                .replace(/\#/g,"%23");
	

	window.open(url+data,'_self')
}
$("#txt").focus(function () {
   // $(".search-box").css("box-shadow", "0 4px 6px #0000001f");
    $(".search-box").css("border", "1px solid #4068e0");
    if ($(this).val() && storage.stopHot == 'true') {
        getHotkeyword($(this).val())
    }
});
$("#txt").blur(function () {
    //$(".search-box").css("box-shadow", "0 2px 3px #0000000f");
    $(".search-box").removeAttr('style');
    setTimeout(function () {
        $("#box").css("display", "none")
    }, 400)
});
$(function () {
    // $('#box ul').html() === '' ? $('#box').css('height','0px') :
    // $('#box').css('height','auto');
    var search = {
        data: [
            {
                name: '百度',
                icon: 'icon-baidu',
                color: '#3385ff',
                url: 'https://www.baidu.com/s?ie=utf-8&wd='
            }, {
                name: '谷歌镜像',
                icon: 'icon-google',
                color: '#ffb744',
                url: 'https://search.njau.cf/search?q='
            }, {
                name: '谷歌',
                icon: 'icon-google',
                color: '#4c8bf5',
                url: 'https://www.google.com/search?q='
            }, {
                name: '必应',
                color: '#0a8583',
                icon: 'icon-bing',
                url: 'https://cn.bing.com/search?q='
            }, {
                name: '好搜',
                icon: 'icon-so',
                color: '#f8b616',
                url: 'https://www.so.com/s?q='
            }, {
                name: '搜狗',
                icon: 'icon-sogou',
                color: '#fe620d',
                url: 'https://www.sogou.com/web?query='
            },{
                name: 'Github',
                icon: 'icon-github',
                color: '#24292e',
                url: 'https://github.com/search?utf8=✓&q='
            }, {
                name: '微信',
                icon: 'icon-wechat',
                color: '#ff0030',
                url: 'https://weixin.sogou.com/weixinwap?type=2&query='
            }, {
                name: '知乎',
                icon: 'icon-zhihu',
                color: '#0078d7',
                url: 'https://www.zhihu.com/search?type=content&q='
            }, {
                name: '微博',
                icon: 'icon-weibo',
                color: '#f3131b',
                url: 'https://s.weibo.com/weibo/'
            }, {
                name: '夸克',
                icon: 'icon-quark',
                color: '#03bc11',
                url: 'https://quark.sm.cn/s?q='
            }, {
                name: 'shodan',
                icon: 'icon-safe',
                color: '#148aff',
                url: 'https://www.shodan.io/search?query='
            }
        ]
    }
    /*for (var i = 0; i < search.data.length; i++) {
        var addList = '<li><i style="background: url(' + search
            .data[i]
            .icon + ') no-repeat center/cover;color: ' + search
            .data[i]
            .color + '"></i><span>' + search
            .data[i]
            .name + '</span></li>'
        $('.search-engine-list').append(addList);
    }*/
	for (var i = 0; i < search.data.length; i++) {
        var addList = '<li><svg class="icon"><use xlink:href="#' + search.data[i].icon +'"></use></svg><span>' + search
            .data[i]
            .name + '</span></li>'
        $('.search-engine-list').append(addList);
    }

    $('#search-icon, .search-engine').hover(function () {
        $('.search-engine').css('display', 'block')
    }, function () {
        $('.search-engine').css('display', 'none')
    });

    $('#hot-btn').on('click', function () {
        // $(this).toggleClass('icon-kaiguanclose-copy');
        if (storage.stopHot == 'true') {
            $(this).attr(
                'style',
                'background: url(./image/hotg.svg) no-repeat center/cover;'
            )
            storage.stopHot = false
        } else {
            storage.stopHot = true
            $(this).attr(
                'style',
                'background: url(./image/hotk.svg) no-repeat center/cover;'
            )
        }
        console.log(storage.stopHot)
    });

    $('.search-engine-list li').click(function () {
        var _index = $(this).index();
        var thisIcon = $(this).children().children().attr('xlink:href');
        var thisText = $(this).text() + '搜索:输入关键词搜索';
		$('#search-icon use').attr('xlink:href', thisIcon)
        $('#txt').attr('placeholder', thisText)
        thisSearch = search
            .data[_index]
            .url;
        $('.search-engine').css('display', 'none')

        storage.searchEngine = [thisSearch, thisIcon, thisText]
    })
	
	
})

$(document).ready(function () {
    //菜单点击
    $("#menu").click(function (event) {
        $(this).toggleClass('on');
        $(".list").toggleClass('closed');
        $(".mywth").toggleClass('hidden');
    });
    $("#content").click(function (event) {
        $(".on").removeClass('on');
        $(".list").addClass('closed');
        $(".mywth").removeClass('hidden');
    });
});


$(document).ready(function(){$("#menu").click(function(s){$(this).toggleClass("on"),$(".list").toggleClass("closed"),$(".mywth").toggleClass("hidden")}),$("#content").click(function(s){$(".on").removeClass("on"),$(".list").addClass("closed"),$(".mywth").removeClass("hidden")})});
            (function (a, h, g, f, e, d, c, b) {
                  b = function () {
                        d = h.createElement(g);
                        c = h.getElementsByTagName(g)[0];
                        d.src = e;
                        d.charset = "utf-8";
                        d.async = 1;
                        c.parentNode.insertBefore(d, c)
                  };
                  a["SeniverseWeatherWidgetObject"] = f;
                  a[f] || (a[f] = function () {
                        (a[f].q = a[f].q || []).push(arguments)
                  });
                  a[f].l = +new Date();
                  if (a.attachEvent) {
                        a.attachEvent("onload", b)
                  } else {
                        a.addEventListener("load", b, false)
                  }
            }(window, document, "script", "SeniverseWeatherWidget",
                  "//cdn.sencdn.com/widget2/static/js/bundle.js?t=" + parseInt((new Date().getTime() / 100000000)
                        .toString(), 10)));
            window.SeniverseWeatherWidget('show', {
                  flavor: "slim",
                  location: "WX4FBXXFKE4F",
                  geolocation: true,
                  language: "auto",
                  unit: "c",
                  theme: "auto",
                  token: "95e011fd-5d26-4a2a-a8e9-37aa7cc653c4",
                  hover: "enabled",
                  container: "tp-weather-widget"
            })
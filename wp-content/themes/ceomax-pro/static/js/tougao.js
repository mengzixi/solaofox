(function($) {
    $.fn.loading = function(t) {
        var a = $(this);
        t ? a.addClass("loading").prepend('<i class="wpcom-icon wi wi-loader"><svg aria-hidden="true"><use xlink:href="#wi-loader"></use></svg></i>') : a.removeClass("loading").find(".wi-loader").remove()
    }


    //动态属性
    $(document).on("click",'.csf-repeater-remove',function () {
        if ($(this).hasClass('csf-confirm')) {
            if (confirm($(this).attr('data-confirm'))) {
                $(this).parents('.csf-repeater-item').remove()
            }
        }
    })
    $(document).on("click",'.csf-repeater-add',function () {
//         debugger
        var field= $(this).prev('.csf-repeater-wrapper').attr('data-field-id')
        var unique= $(this).prev('.csf-repeater-wrapper').attr('data-unique-id')
        var name_str=unique+field
        var append_html='<div class="csf-repeater-item" style="">\n' +
            '                                                                    <div class="csf-repeater-content">\n' +
            '                                                                        <div class="csf-field csf-field-text">\n' +
            '                                                                            <div class="csf-title"><h4>标题</h4></div>\n' +
            '                                                                            <div class="csf-fieldset"><input class="input-title" type="text"\n' +
            '                                                                                                             name="'+name_str+'[0][title]"\n' +
            '                                                                                                             value="标题"\n' +
            '                                                                                                             data-depend-id="title">\n' +
            '                                                                            </div>\n' +
            '                                                                            <div class="clear"></div>\n' +
            '                                                                        </div>\n' +
            '                                                                        <div class="csf-field csf-field-text">\n' +
            '                                                                            <div class="csf-title"><h4>描述内容</h4></div>\n' +
            '                                                                            <div class="csf-fieldset"><input class="input-desc" type="text"\n' +
            '                                                                                                             name="'+name_str+'[0][desc]"\n' +
            '                                                                                                             value="这里是描述内容"\n' +
            '                                                                                                             data-depend-id="desc">\n' +
            '                                                                            </div>\n' +
            '                                                                            <div class="clear"></div>\n' +
            '                                                                        </div>\n' +
            '                                                                    </div>\n' +
            '                                                                    <div class="csf-repeater-helper">\n' +
            '                                                                        <div class="csf-repeater-helper-inner">\n' +
            '                                                                                    <i class="csf-repeater-remove csf-confirm fa fa-times"\n' +
            '                                                                                    data-confirm="确定要删除此项目吗？"></i></div>\n' +
            '                                                                    </div>\n' +
            '                                                                </div>'
        $(this).prev('.csf-repeater-wrapper').append(append_html)
        var repeater_item_all = $(this).prev('.csf-repeater-wrapper').find('.csf-repeater-item')
        if (repeater_item_all.length > 0) {
            for (let index = 0; index < repeater_item_all.length; index++) {
                $(repeater_item_all[index]).find(".input-title").attr('name', name_str + '[' + index + '][title]');
                $(repeater_item_all[index]).find(".input-desc").attr('name', name_str + '[' + index + '][desc]');
            }
        }

        return false;
    })
    //动态属性end



}(jQuery));

;(function ($) {
    var methods = {
        getSerializedTags: function () {
            var currentTags = [];
            $(this).find("li.tagItem").each(function (i, e) {
                currentTags.push($(e).text())
            });
            return currentTags.join(',')
        }, getTags: function () {
            var currentTags = [];
            $(this).find("li.tagItem").each(function (i, e) {
                currentTags.push($(e).text())
            });
            return currentTags
        }, version: function () {
            return "1.3.0"
        }
    };
    $.fn.tagHandler = function (options) {
        if (typeof (options) == 'object' || typeof (options) == 'undefined') {
            var opts = $.extend({}, $.fn.tagHandler.defaults, options);
            debug($(this), opts);
            return this.each(function () {
                if (!$(this).is('ul')) {
                    return true
                }
                var tagContainer = this;
                var tagContainerObject = $(tagContainer);
                if (!tagContainer.id) {
                    var d = new Date();
                    tagContainer.id = d.getTime()
                }
                tagContainerObject.wrap('<div class="' + opts.className + '" />');
                tagContainerObject.addClass(opts.className + "Container");
                if (opts.allowEdit) {
                    tagContainerObject.html('<li class="tagInput"><input class="tagInputField" type="text" /></li>')
                }
                var inputField = tagContainerObject.find(".tagInputField");
                var tags = [];
                tags.availableTags = [];
                tags.originalTags = [];
                tags.assignedTags = [];
                if (opts.updateURL !== '') {
                    if (!opts.autoUpdate) {
                        $("<div />").attr({
                            id: tagContainer.id + "_save",
                            title: "Save Tags"
                        }).addClass("tagUpdate").click(function () {
                            saveTags(tags, opts, tagContainer.id)
                        }).appendTo(tagContainerObject.parent())
                    }
                    $("<div />").attr({
                        id: tagContainer.id + "_loader",
                        title: "Saving Tags"
                    }).addClass("tagLoader").appendTo(tagContainerObject.parent())
                }
                if (opts.getURL !== '' && opts.initLoad) {
                    $.ajax({
                        url: opts.getURL,
                        cache: false,
                        data: opts.getData,
                        dataType: 'json',
                        success: function (data, text, xhr) {
                            if (data.availableTags.length) {
                                tags.availableTags = data.availableTags.slice();
                                tags.originalTags = tags.availableTags.slice()
                            }
                            if (opts.sortTags) {
                                tags = sortTags(tags)
                            }
                            if (data.assignedTags.length) {
                                tags.assignedTags = data.assignedTags.slice();
                                if (opts.sortTags) {
                                    tags = sortTags(tags)
                                }
                                tags = addAssignedTags(opts, tags, inputField, tagContainer)
                            }
                            if (opts.autocomplete && typeof ($.fn.autocomplete) == 'function' && opts.allowEdit) {
                                $(inputField).autocomplete("option", "source", tags.availableTags)
                            }
                        },
                        error: function (xhr, text, error) {
                            debug(xhr, text, error);
                            alert(opts.msgError)
                        }
                    })
                } else if (opts.getURL !== '') {
                    tags.assignedTags = opts.assignedTags.slice();
                    if (opts.sortTags) {
                        tags = sortTags(tags)
                    }
                    tags = addAssignedTags(opts, tags, inputField, tagContainer)
                } else {
                    if (opts.availableTags.length) {
                        tags.availableTags = opts.availableTags.slice();
                        tags.originalTags = tags.availableTags.slice()
                    }
                    if (opts.sortTags) {
                        tags = sortTags(tags)
                    }
                    if (opts.assignedTags.length) {
                        tags.assignedTags = opts.assignedTags.slice();
                        if (opts.sortTags) {
                            tags = sortTags(tags)
                        }
                        tags = addAssignedTags(opts, tags, inputField, tagContainer)
                    }
                    if (opts.autocomplete && typeof ($.fn.autocomplete) == 'function' && opts.allowEdit && opts.initLoad) {
                        $(inputField).autocomplete("option", "source", tags.availableTags)
                    }
                }
                if (opts.allowEdit) {
                    tagContainerObject.delegate("li.tagItem", "click", function () {
                        var $el = $(this);
                        var rc = 1;
                        if (typeof (opts.onDelete) == "function") {
                            rc = opts.onDelete.call(this, $.trim($el.text()))
                        }
                        if (rc) {
                            tags = removeTag($el, tags, opts.sortTags);
                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                saveTags(tags, opts, tagContainer.id)
                            }
                        }
                        if (typeof (opts.afterDelete) == "function") {
                            opts.afterDelete.call(this, $.trim($el.text()))
                        }
                        if (opts.autocomplete && typeof ($.fn.autocomplete) == 'function' && opts.initLoad) {
                            $(inputField).autocomplete("option", "source", tags.availableTags)
                        }
                    });
                    $(inputField).keypress(function (e) {
                        var $el = $(this);
                        if (e.which === 13 || e.which === 44 || e.which === opts.delimiter.charCodeAt(0)) {
                            e.preventDefault();
                            if ($el.val() !== "" && !checkTag($.trim($el.val()), tags.assignedTags)) {
                                if (!opts.allowAdd && !checkTag($.trim($el.val()), tags.availableTags)) {
                                    alert(opts.msgNoNewTag);
                                    return
                                }
                                if (opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags) {
                                    alert('Maximum tags allowed: ' + opts.maxTags)
                                } else {
                                    var newTag = $.trim($el.val());
                                    var rc = 1;
                                    if (typeof (opts.onAdd) == "function") {
                                        rc = opts.onAdd.call(this, newTag)
                                    }
                                    if (rc || typeof (rc) == "undefined") {
                                        tags = addTag(this, newTag, tags, opts.sorttags);
                                        if (opts.updateURL !== '' && opts.autoUpdate) {
                                            saveTags(tags, opts, tagContainer.id)
                                        }
                                        if (opts.autocomplete && typeof ($.fn.autocomplete) == 'function' && opts.initload) {
                                            $(inputField).autocomplete("option", "source", tags.availableTags)
                                        }
                                        if (typeof (opts.afterAdd) == "function") {
                                            opts.afterAdd.call(this, newTag)
                                        }
                                    }
                                }
                                $el.val("");
                                $el.focus()
                            }
                        }
                    });
                    $(inputField).keydown(function (e) {
                        var $el = $(this);
                        if (e.which === 8 && $el.val() === "") {
                            var deleted_tag = tagContainerObject.find(".tagItem:last").text();
                            if (typeof (opts.onDelete) == "function") {
                                opts.onDelete.call(this, $.trim(deleted_tag))
                            }
                            tags = removeTag(tagContainerObject.find(".tagItem:last"), tags, opts.sortTags);
                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                saveTags(tags, opts, tagContainer.id)
                            }
                            if (typeof (opts.afterDelete) == "function") {
                                opts.afterDelete.call(this, $.trim(deleted_tag))
                            }
                            if (opts.autocomplete && typeof ($.fn.autocomplete) == 'function' && opts.initLoad) {
                                $(inputField).autocomplete("option", "source", tags.availableTags)
                            }
                            $el.focus()
                        }
                    });
                    if (opts.autocomplete && typeof ($.fn.autocomplete) == 'function' && opts.initLoad) {
                        $(inputField).autocomplete({
                            source: tags.availableTags, select: function (event, ui) {
                                var $el = $(this);
                                if (!checkTag($.trim(ui.item.value), tags.assignedTags)) {
                                    if (opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags) {
                                        alert('Maximum tags allowed: ' + opts.maxTags)
                                    } else {
                                        var newTag = $.trim(ui.item.value);
                                        var rc = 1;
                                        if (typeof (opts.onAdd) == "function") {
                                            rc = opts.onAdd.call(this, newTag)
                                        }
                                        if (rc || typeof (rc) == "undefined") {
                                            tags = addTag(this, newTag, tags, opts.sortTags);
                                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                                saveTags(tags, opts, tagContainer.id)
                                            }
                                            $(inputField).autocomplete("option", "source", tags.availableTags);
                                            if (typeof (opts.afterAdd) == "function") {
                                                opts.afterAdd.call(this, newTag)
                                            }
                                        }
                                    }
                                    $el.focus()
                                }
                                $el.val("");
                                return false
                            }, minLength: opts.minChars
                        })
                    } else if (opts.autocomplete && typeof ($.fn.autocomplete) == 'function') {
                        $(inputField).autocomplete({
                            source: function (request, response) {
                                opts.getData[opts.queryname] = request.term;
                                var lastXhr = $.getJSON(opts.getURL, opts.getData, function (data, status, xhr) {
                                    response(data.availableTags)
                                })
                            }, select: function (event, ui) {
                                var $el = $(this);
                                if (!checkTag($.trim(ui.item.value), tags.assignedTags)) {
                                    if (opts.maxTags > 0 && tags.assignedTags.length >= opts.maxTags) {
                                        alert('Maximum tags allowed: ' + opts.maxTags)
                                    } else {
                                        var newTag = $.trim(ui.item.value);
                                        var rc = 1;
                                        if (typeof (opts.onAdd) == "function") {
                                            opts.onAdd.call(this, newTag)
                                        }
                                        if (rc || typeof (rc) == "undefined") {
                                            tags = addTag(this, $.trim(ui.item.value), tags, opts.sortTags);
                                            if (opts.updateURL !== '' && opts.autoUpdate) {
                                                saveTags(tags, opts, tagContainer.id)
                                            }
                                            if (typeof (opts.afterAdd) == "function") {
                                                opts.afterAdd.call(this, newTag)
                                            }
                                        }
                                    }
                                    $el.focus()
                                }
                                $el.val('');
                                return false
                            }, minLength: opts.minChars
                        })
                    }
                    $(inputField).focus(function () {
                        if ($(inputField).val() === '' && opts.autocomplete && typeof ($.fn.autocomplete) == 'function' && opts.initLoad) {
                            $(inputField).autocomplete("search", "")
                        }
                    });
                    tagContainerObject.click(function () {
                        $(inputField).focus()
                    })
                }
                this.getTags = function () {
                    return tags.assignedTags
                };
                return 1
            })
        } else if (typeof (options) == "string" && methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1))
        }
    };
    $.fn.tagHandler.defaults = {
        allowEdit: true,
        allowAdd: true,
        assignedTags: [],
        autocomplete: false,
        autoUpdate: false,
        availableTags: [],
        className: 'tagHandler',
        debug: false,
        delimiter: '',
        getData: {},
        getURL: '',
        initLoad: true,
        maxTags: 0,
        minChars: 0,
        msgNoNewTag: "You don't have permission to create a new tag.",
        msgError: "There was an error getting the tag list.",
        onAdd: {},
        onDelete: {},
        afterAdd: {},
        afterDelete: {},
        queryname: 'q',
        sortTags: true,
        updateData: {},
        updateURL: ''
    };

    function checkTag(value, tags) {
        var check = false;
        jQuery.each(tags, function (i, e) {
            if (e === value) {
                check = true;
                return false
            }
        });
        return check
    }

    function removeTagFromList(value, tags) {
        jQuery.each(tags, function (i, e) {
            if (e === value) {
                tags.splice(i, 1)
            }
        });
        return tags
    }

    function addTag(tagField, value, tags, sort) {
        tags.assignedTags.push(value);
        tags.availableTags = removeTagFromList(value, tags.availableTags);
        $("<li />").addClass("tagItem").text(value).insertBefore($(tagField).parent());
        if (sort) {
            tags = sortTags(tags)
        }
        return tags
    }

    function removeTag(tag, tags, sort) {
        var value = $(tag).text();
        tags.assignedTags = removeTagFromList(value, tags.assignedTags);
        if (checkTag(value, tags.originalTags)) {
            tags.availableTags.push(value)
        }
        $(tag).remove();
        if (sort) {
            tags = sortTags(tags)
        }
        return tags
    }

    function sortTags(tags) {
        tags.availableTags = tags.availableTags.sort();
        tags.assignedTags = tags.assignedTags.sort();
        tags.originalTags = tags.originalTags.sort();
        return tags
    }

    function saveTags(tags, opts, tcID) {
        var sendData = {tags: tags.assignedTags};
        $.extend(sendData, opts.updateData);
        $.ajax({
            type: 'POST',
            url: opts.updateURL,
            cache: false,
            data: sendData,
            dataType: 'json',
            beforeSend: function () {
                if ($("#" + tcID + "_save").length) {
                    $("#" + tcID + "_save").fadeOut(200, function () {
                        $("#" + tcID + "_loader").fadeIn(200)
                    })
                } else {
                    $("#" + tcID + "_loader").fadeIn(200)
                }
            },
            complete: function () {
                $("#" + tcID + "_loader").fadeOut(200, function () {
                    if ($("#" + tcID + "_save").length) {
                        $("#" + tcID + "_save").fadeIn(200)
                    }
                })
            }
        })
    }

    function addAssignedTags(opts, tags, inputField, tagContainer) {
        $(tags.assignedTags).each(function (i, e) {
            if (opts.allowEdit) {
                $("<li />").addClass("tagItem").text(e).insertBefore($(inputField).parent())
            } else {
                $("<li />").addClass("tagItem").css("cursor", "default").text(e).appendTo($(tagContainer))
            }
            tags.availableTags = removeTagFromList(e, tags.availableTags)
        });
        return tags
    }

    function debug(tagContainer, options) {
        if (options.debug && window.console && window.console.log) {
            window.console.log(tagContainer);
            window.console.log(options);
            window.console.log($.fn.tagHandler.defaults)
        }
    }
})(jQuery);
;(function ($) {
    $(document).ready(function () {
        $('#j-form').on('click', '.j-thumb', function () {
            var uploader;
            if (uploader) {
                uploader.open();
            } else {
                uploader = wp.media.frames.file_frame = wp.media({
                    title: "选择图片",
                    button: {text: "插入图片"},
                    library: {type: "image"},
                    multiple: false
                });
                uploader.on("select", function () {
                    var attachment = uploader.state().get("selection").first().toJSON();
                    var img = "<img src=\"" + attachment.url + "\" width=\"" + attachment.width + "\" height=\"" + attachment.height + "\"><div class=\"thumb-remove j-thumb-remove\">×</div>";
                    $('#j-thumb-wrap').html(img);
                    $('#_thumbnail_id').val(attachment.id);
                });
                uploader.open();
            }
        }).on('click', '.j-thumb-remove', function () {
            $('#j-thumb-wrap').html('');
            $('#_thumbnail_id').val('');
        }).on('submit', function () {
            let $btn = $(this).find('button[type=submit]');
            if ($btn.hasClass('loading')) return false;
            // $btn.loading(1);
            var error = 0;
            $('#post-tags').remove();
            $("<input>", {
                type: 'hidden',
                name: 'post-tags',
                id: 'post-tags',
                val: $("#tag-container").tagHandler("getSerializedTags")
            }).appendTo(this);
            if (typeof tinyMCE != "undefined") {
                tinyMCE.triggerSave();
                var ed = tinyMCE.activeEditor;
                ed.off('change').on('change', function (ed) {
                    $('.wp-editor-wrap').removeClass('error');
                });
            }
            var title = $.trim($('#post-title').val());
            var content = $.trim($('#post-content').val());
            var category = $('#post-category').val();
            if (title == '') {
                $('#post-title').addClass('error');
                error = 1;
            }
            if (content == '') {
                $('.wp-editor-wrap').addClass('error');
                error = 1;
            }
            if (!category) {
                $('#post-category').addClass('error');
                error = 1;
            }
            if (error) {
                $btn.loading(0);
                return false;
            }
            // $("#j-form").submit()
            // return false;
        }).on('input propertychange', '.form-control', function () {
            $(this).removeClass('error');
        });
        if($("#postTags").length){
            postTags = $("#postTags").val()
            postTags = JSON.parse(postTags)
            console.log(postTags)
            $("#tag-container").tagHandler({assignedTags: postTags});                
        }else{
                $("#tag-container").tagHandler({assignedTags: ''});                
        }

    });
})(jQuery);
;/*! This file is auto-generated */
window.wp = window.wp || {}, function (f, m) {
    m.editor = m.editor || {}, window.switchEditors = new function () {
        var s, d, n = {};

        function e() {
            !s && window.tinymce && (s = window.tinymce, (d = s.$)(document).on("click", function (e) {
                var t = d(e.target);
                t.hasClass("wp-switch-editor") && r(t.attr("data-wp-editor-id"), t.hasClass("switch-tmce") ? "tmce" : "html")
            }))
        }

        function u(e) {
            var t = d(".mce-toolbar-grp", e.getContainer())[0], n = t && t.clientHeight;
            return n && 10 < n && n < 200 ? parseInt(n, 10) : 30
        }

        function r(e, t) {
            e = e || "content", t = t || "toggle";
            var n, r, i = s.get(e), a = d("#wp-" + e + "-wrap"), o = d("#" + e), c = o[0];
            if ("toggle" === t && (t = i && !i.isHidden() ? "html" : "tmce"), "tmce" === t || "tinymce" === t) {
                if (i && !i.isHidden()) return !1;
                void 0 !== window.QTags && window.QTags.closeAllTags(e), n = parseInt(c.style.height, 10) || 0;
                (i ? i.getParam("wp_keep_scroll_position") : window.tinyMCEPreInit.mceInit[e] && window.tinyMCEPreInit.mceInit[e].wp_keep_scroll_position) && function (e) {
                    if (!e || !e.length) return;
                    var t = e[0], n = function (e, t) {
                            var n = t.cursorStart, r = t.cursorEnd, i = l(e, n);
                            i && (n = -1 !== ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].indexOf(i.tagType) ? i.ltPos : i.gtPos);
                            var a = l(e, r);
                            a && (r = a.gtPos);
                            var o = g(e, n);
                            o && !o.showAsPlainText && (n = o.urlAtStartOfContent ? o.endIndex : o.startIndex);
                            var c = g(e, r);
                            c && !c.showAsPlainText && (r = c.urlAtEndOfContent ? c.startIndex : c.endIndex);
                            return {cursorStart: n, cursorEnd: r}
                        }(t.value, {cursorStart: t.selectionStart, cursorEnd: t.selectionEnd}), r = n.cursorStart,
                        i = n.cursorEnd, a = r !== i ? "range" : "single", o = null,
                        c = b(d, "&#65279;").attr("data-mce-type", "bookmark");
                    if ("range" == a) {
                        var p = t.value.slice(r, i), s = c.clone().addClass("mce_SELRES_end");
                        o = [p, s[0].outerHTML].join("")
                    }
                    t.value = [t.value.slice(0, r), c.clone().addClass("mce_SELRES_start")[0].outerHTML, o, t.value.slice(i)].join("")
                }(o), i ? (i.show(), !s.Env.iOS && n && 50 < (n = n - u(i) + 14) && n < 5e3 && i.theme.resizeTo(null, n), i.getParam("wp_keep_scroll_position") && w(i)) : s.init(window.tinyMCEPreInit.mceInit[e]), a.removeClass("html-active").addClass("tmce-active"), o.attr("aria-hidden", !0), window.setUserSetting("editor", "tinymce")
            } else if ("html" === t) {
                if (i && i.isHidden()) return !1;
                if (i) {
                    s.Env.iOS || (n = (r = i.iframeElement) ? parseInt(r.style.height, 10) : 0) && 50 < (n = n + u(i) - 14) && n < 5e3 && (c.style.height = n + "px");
                    var p = null;
                    i.getParam("wp_keep_scroll_position") && (p = function (e) {
                        var t = e.getWin().getSelection();
                        if (!t || t.rangeCount < 1) return;
                        var n = "SELRES_" + Math.random(), r = b(e.$, n), i = r.clone().addClass("mce_SELRES_start"),
                            a = r.clone().addClass("mce_SELRES_end"), o = t.getRangeAt(0), c = o.startContainer,
                            p = o.startOffset, s = o.cloneRange();
                        0 < e.$(c).parents(".mce-offscreen-selection").length ? (c = e.$("[data-mce-selected]")[0], i.attr("data-mce-object-selection", "true"), a.attr("data-mce-object-selection", "true"), e.$(c).before(i[0]), e.$(c).after(a[0])) : (s.collapse(!1), s.insertNode(a[0]), s.setStart(c, p), s.collapse(!0), s.insertNode(i[0]), o.setStartAfter(i[0]), o.setEndBefore(a[0]), t.removeAllRanges(), t.addRange(o));
                        e.on("GetContent", x);
                        var d = E(e.getContent());
                        e.off("GetContent", x), i.remove(), a.remove();
                        var l = new RegExp('<span[^>]*\\s*class="mce_SELRES_start"[^>]+>\\s*' + n + "[^<]*<\\/span>(\\s*)"),
                            g = new RegExp('(\\s*)<span[^>]*\\s*class="mce_SELRES_end"[^>]+>\\s*' + n + "[^<]*<\\/span>"),
                            u = d.match(l), w = d.match(g);
                        if (!u) return null;
                        var f = u.index, m = u[0].length, h = null;
                        if (w) {
                            -1 !== u[0].indexOf("data-mce-object-selection") && (m -= u[1].length);
                            var v = w.index;
                            -1 !== w[0].indexOf("data-mce-object-selection") && (v -= w[1].length), h = v - m
                        }
                        return {start: f, end: h}
                    }(i)), i.hide(), p && function (e, t) {
                        if (!t) return;
                        var n = e.getElement(), r = t.start, i = t.end || t.start;
                        n.focus && setTimeout(function () {
                            n.setSelectionRange(r, i), n.blur && n.blur(), n.focus()
                        }, 100)
                    }(i, p)
                } else o.css({display: "", visibility: ""});
                a.removeClass("tmce-active").addClass("html-active"), o.attr("aria-hidden", !1), window.setUserSetting("editor", "html")
            }
        }

        function l(e, t) {
            var n = e.lastIndexOf("<", t - 1);
            if (e.lastIndexOf(">", t) < n || ">" === e.substr(t, 1)) {
                var r = e.substr(n), i = r.match(/<\s*(\/)?(\w+|\!-{2}.*-{2})/);
                if (!i) return null;
                var a = i[2];
                return {ltPos: n, gtPos: n + r.indexOf(">") + 1, tagType: a, isClosingTag: !!i[1]}
            }
            return null
        }

        function g(e, t) {
            for (var n = function (e) {
                var t, n = function (e) {
                    var t = e.match(/\[+([\w_-])+/g), n = [];
                    if (t) for (var r = 0; r < t.length; r++) {
                        var i = t[r].replace(/^\[+/g, "");
                        -1 === n.indexOf(i) && n.push(i)
                    }
                    return n
                }(e);
                if (0 === n.length) return [];
                var r, i = m.shortcode.regexp(n.join("|")), a = [];
                for (; r = i.exec(e);) {
                    var o = "[" === r[1];
                    t = {
                        shortcodeName: r[2],
                        showAsPlainText: o,
                        startIndex: r.index,
                        endIndex: r.index + r[0].length,
                        length: r[0].length
                    }, a.push(t)
                }
                var c = new RegExp('(^|[\\n\\r][\\n\\r]|<p>)(https?:\\/\\/[^s"]+?)(<\\/p>s*|[\\n\\r][\\n\\r]|$)', "gi");
                for (; r = c.exec(e);) t = {
                    shortcodeName: "url",
                    showAsPlainText: !1,
                    startIndex: r.index,
                    endIndex: r.index + r[0].length,
                    length: r[0].length,
                    urlAtStartOfContent: "" === r[1],
                    urlAtEndOfContent: "" === r[3]
                }, a.push(t);
                return a
            }(e), r = 0; r < n.length; r++) {
                var i = n[r];
                if (t >= i.startIndex && t <= i.endIndex) return i
            }
        }

        function b(e, t) {
            return e("<span>").css({
                display: "inline-block",
                width: 0,
                overflow: "hidden",
                "line-height": 0
            }).html(t || "")
        }

        function w(e) {
            var t = e.$(".mce_SELRES_start").attr("data-mce-bogus", 1),
                n = e.$(".mce_SELRES_end").attr("data-mce-bogus", 1);
            if (t.length) if (e.focus(), n.length) {
                var r = e.getDoc().createRange();
                r.setStartAfter(t[0]), r.setEndBefore(n[0]), e.selection.setRng(r)
            } else e.selection.select(t[0]);
            e.getParam("wp_keep_scroll_position") && function (e, t) {
                var n, r = e.$(t).offset().top, i = e.$(e.getContentAreaContainer()).offset().top, a = u(e),
                    o = f("#wp-content-editor-tools"), c = 0, p = 0;
                o.length && (c = o.height(), p = o.offset().top);
                var s, d = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                    l = i + r, g = d - (c + a);
                if (l < g) return;
                s = e.settings.wp_autoresize_on ? (n = f("html,body"), Math.max(l - g / 2, p - c)) : (n = f(e.contentDocument).find("html,body"), r);
                n.animate({scrollTop: parseInt(s, 10)}, 100)
            }(e, t), i(t), i(n), e.save()
        }

        function i(e) {
            var t = e.parent();
            e.remove(), !t.is("p") || t.children().length || t.text() || t.remove()
        }

        function x(e) {
            e.content = e.content.replace(/<p>(?:<br ?\/?>|\u00a0|\uFEFF| )*<\/p>/g, "<p>&nbsp;</p>")
        }

        function E(e) {
            var t = "blockquote|ul|ol|li|dl|dt|dd|table|thead|tbody|tfoot|tr|th|td|h[1-6]|fieldset|figure",
                n = t + "|div|p", r = t + "|pre", i = !1, a = !1, o = [];
            return e ? (-1 === e.indexOf("<script") && -1 === e.indexOf("<style") || (e = e.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, function (e) {
                return o.push(e), "<wp-preserve>"
            })), -1 !== e.indexOf("<pre") && (i = !0, e = e.replace(/<pre[^>]*>[\s\S]+?<\/pre>/g, function (e) {
                return (e = (e = e.replace(/<br ?\/?>(\r\n|\n)?/g, "<wp-line-break>")).replace(/<\/?p( [^>]*)?>(\r\n|\n)?/g, "<wp-line-break>")).replace(/\r?\n/g, "<wp-line-break>")
            })), -1 !== e.indexOf("[caption") && (a = !0, e = e.replace(/\[caption[\s\S]+?\[\/caption\]/g, function (e) {
                return e.replace(/<br([^>]*)>/g, "<wp-temp-br$1>").replace(/[\r\n\t]+/, "")
            })), -1 !== (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(new RegExp("\\s*</(" + n + ")>\\s*", "g"), "</$1>\n")).replace(new RegExp("\\s*<((?:" + n + ")(?: [^>]*)?)>", "g"), "\n<$1>")).replace(/(<p [^>]+>.*?)<\/p>/g, "$1</p#>")).replace(/<div( [^>]*)?>\s*<p>/gi, "<div$1>\n\n")).replace(/\s*<p>/gi, "")).replace(/\s*<\/p>\s*/gi, "\n\n")).replace(/\n[\s\u00a0]+\n/g, "\n\n")).replace(/(\s*)<br ?\/?>\s*/gi, function (e, t) {
                return t && -1 !== t.indexOf("\n") ? "\n\n" : "\n"
            })).replace(/\s*<div/g, "\n<div")).replace(/<\/div>\s*/g, "</div>\n")).replace(/\s*\[caption([^\[]+)\[\/caption\]\s*/gi, "\n\n[caption$1[/caption]\n\n")).replace(/caption\]\n\n+\[caption/g, "caption]\n\n[caption")).replace(new RegExp("\\s*<((?:" + r + ")(?: [^>]*)?)\\s*>", "g"), "\n<$1>")).replace(new RegExp("\\s*</(" + r + ")>\\s*", "g"), "</$1>\n")).replace(/<((li|dt|dd)[^>]*)>/g, " \t<$1>")).indexOf("<option") && (e = (e = e.replace(/\s*<option/g, "\n<option")).replace(/\s*<\/select>/g, "\n</select>")), -1 !== e.indexOf("<hr") && (e = e.replace(/\s*<hr( [^>]*)?>\s*/g, "\n\n<hr$1>\n\n")), -1 !== e.indexOf("<object") && (e = e.replace(/<object[\s\S]+?<\/object>/g, function (e) {
                return e.replace(/[\r\n]+/g, "")
            })), e = (e = (e = (e = e.replace(/<\/p#>/g, "</p>\n")).replace(/\s*(<p [^>]+>[\s\S]*?<\/p>)/g, "\n$1")).replace(/^\s+/, "")).replace(/[\s\u00a0]+$/, ""), i && (e = e.replace(/<wp-line-break>/g, "\n")), a && (e = e.replace(/<wp-temp-br([^>]*)>/g, "<br$1>")), o.length && (e = e.replace(/<wp-preserve>/g, function () {
                return o.shift()
            })), e) : ""
        }

        function a(e) {
            var t = !1, n = !1,
                r = "table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary";
            return -1 !== (e = e.replace(/\r\n|\r/g, "\n")).indexOf("<object") && (e = e.replace(/<object[\s\S]+?<\/object>/g, function (e) {
                return e.replace(/\n+/g, "")
            })), -1 === (e = e.replace(/<[^<>]+>/g, function (e) {
                return e.replace(/[\n\t ]+/g, " ")
            })).indexOf("<pre") && -1 === e.indexOf("<script") || (t = !0, e = e.replace(/<(pre|script)[^>]*>[\s\S]*?<\/\1>/g, function (e) {
                return e.replace(/\n/g, "<wp-line-break>")
            })), -1 !== e.indexOf("<figcaption") && (e = (e = e.replace(/\s*(<figcaption[^>]*>)/g, "$1")).replace(/<\/figcaption>\s*/g, "</figcaption>")), -1 !== e.indexOf("[caption") && (n = !0, e = e.replace(/\[caption[\s\S]+?\[\/caption\]/g, function (e) {
                return (e = (e = e.replace(/<br([^>]*)>/g, "<wp-temp-br$1>")).replace(/<[^<>]+>/g, function (e) {
                    return e.replace(/[\n\t ]+/, " ")
                })).replace(/\s*\n\s*/g, "<wp-temp-br />")
            })), e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e += "\n\n").replace(/<br \/>\s*<br \/>/gi, "\n\n")).replace(new RegExp("(<(?:" + r + ")(?: [^>]*)?>)", "gi"), "\n\n$1")).replace(new RegExp("(</(?:" + r + ")>)", "gi"), "$1\n\n")).replace(/<hr( [^>]*)?>/gi, "<hr$1>\n\n")).replace(/\s*<option/gi, "<option")).replace(/<\/option>\s*/gi, "</option>")).replace(/\n\s*\n+/g, "\n\n")).replace(/([\s\S]+?)\n\n/g, "<p>$1</p>\n")).replace(/<p>\s*?<\/p>/gi, "")).replace(new RegExp("<p>\\s*(</?(?:" + r + ")(?: [^>]*)?>)\\s*</p>", "gi"), "$1")).replace(/<p>(<li.+?)<\/p>/gi, "$1")).replace(/<p>\s*<blockquote([^>]*)>/gi, "<blockquote$1><p>")).replace(/<\/blockquote>\s*<\/p>/gi, "</p></blockquote>")).replace(new RegExp("<p>\\s*(</?(?:" + r + ")(?: [^>]*)?>)", "gi"), "$1")).replace(new RegExp("(</?(?:" + r + ")(?: [^>]*)?>)\\s*</p>", "gi"), "$1")).replace(/(<br[^>]*>)\s*\n/gi, "$1")).replace(/\s*\n/g, "<br />\n")).replace(new RegExp("(</?(?:" + r + ")[^>]*>)\\s*<br />", "gi"), "$1")).replace(/<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)>)/gi, "$1")).replace(/(?:<p>|<br ?\/?>)*\s*\[caption([^\[]+)\[\/caption\]\s*(?:<\/p>|<br ?\/?>)*/gi, "[caption$1[/caption]")).replace(/(<(?:div|th|td|form|fieldset|dd)[^>]*>)(.*?)<\/p>/g, function (e, t, n) {
                return n.match(/<p( [^>]*)?>/) ? e : t + "<p>" + n + "</p>"
            }), t && (e = e.replace(/<wp-line-break>/g, "\n")), n && (e = e.replace(/<wp-temp-br([^>]*)>/g, "<br$1>")), e
        }

        function t(e) {
            var t = {o: n, data: e, unfiltered: e};
            return f && f("body").trigger("beforePreWpautop", [t]), t.data = E(t.data), f && f("body").trigger("afterPreWpautop", [t]), t.data
        }

        function o(e) {
            var t = {o: n, data: e, unfiltered: e};
            return f && f("body").trigger("beforeWpautop", [t]), t.data = a(t.data), f && f("body").trigger("afterWpautop", [t]), t.data
        }

        return f(document).on("tinymce-editor-init.keep-scroll-position", function (e, t) {
            t.$(".mce_SELRES_start").length && w(t)
        }), f ? f(document).ready(e) : document.addEventListener ? (document.addEventListener("DOMContentLoaded", e, !1), window.addEventListener("load", e, !1)) : window.attachEvent && (window.attachEvent("onload", e), document.attachEvent("onreadystatechange", function () {
            "complete" === document.readyState && e()
        })), m.editor.autop = o, m.editor.removep = t, n = {go: r, wpautop: o, pre_wpautop: t, _wp_Autop: a, _wp_Nop: E}
    }, m.editor.initialize = function (e, t) {
        var n, r;
        if (f && e && m.editor.getDefaultSettings) {
            if (r = m.editor.getDefaultSettings(), (t = t || {tinymce: !0}).tinymce && t.quicktags) {
                var i = f("#" + e),
                    a = f("<div>").attr({class: "wp-core-ui wp-editor-wrap tmce-active", id: "wp-" + e + "-wrap"}),
                    o = f('<div class="wp-editor-container">'),
                    c = f("<button>").attr({type: "button", "data-wp-editor-id": e}),
                    p = f('<div class="wp-editor-tools">');
                if (t.mediaButtons) {
                    var s = "Add Media";
                    window._wpMediaViewsL10n && window._wpMediaViewsL10n.addMedia && (s = window._wpMediaViewsL10n.addMedia);
                    var d = f('<button type="button" class="button insert-media add_media">');
                    d.append('<span class="wp-media-buttons-icon"></span>'), d.append(document.createTextNode(" " + s)), d.data("editor", e), p.append(f('<div class="wp-media-buttons">').append(d))
                }
                a.append(p.append(f('<div class="wp-editor-tabs">').append(c.clone().attr({
                    id: e + "-tmce",
                    class: "wp-switch-editor switch-tmce"
                }).text(window.tinymce.translate("Visual"))).append(c.attr({
                    id: e + "-html",
                    class: "wp-switch-editor switch-html"
                }).text(window.tinymce.translate("Text")))).append(o)), i.after(a), o.append(i)
            }
            window.tinymce && t.tinymce && ("object" != typeof t.tinymce && (t.tinymce = {}), (n = f.extend({}, r.tinymce, t.tinymce)).selector = "#" + e, f(document).trigger("wp-before-tinymce-init", n), window.tinymce.init(n), window.wpActiveEditor || (window.wpActiveEditor = e)), window.quicktags && t.quicktags && ("object" != typeof t.quicktags && (t.quicktags = {}), (n = f.extend({}, r.quicktags, t.quicktags)).id = e, f(document).trigger("wp-before-quicktags-init", n), window.quicktags(n), window.wpActiveEditor || (window.wpActiveEditor = n.id))
        }
    }, m.editor.remove = function (e) {
        var t, n, r = f("#wp-" + e + "-wrap");
        window.tinymce && (t = window.tinymce.get(e)) && (t.isHidden() || t.save(), t.remove()), window.quicktags && (n = window.QTags.getInstance(e)) && n.remove(), r.length && (r.after(f("#" + e)), r.remove())
    }, m.editor.getContent = function (e) {
        var t;
        if (f && e) return window.tinymce && (t = window.tinymce.get(e)) && !t.isHidden() && t.save(), f("#" + e).val()
    }
}(window.jQuery, window.wp);

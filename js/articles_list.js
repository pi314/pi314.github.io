var articles_list = [{
    "like":true,
    "date":"2012/07/31",
    "week":"Tue",
    "time":"16:19",
    "sign":"hualien",
    "title":"[遊戲] 貪吃蛇III",
    "file":"snake3.txt",
    },{
    "like":true,
    "date":"2012/07/31",
    "week":"Tue",
    "time":"16:25",
    "sign":"hualien",
    "title":"[遊戲] 貪吃蛇III 修改第二版",
    "file":"snake3.2.txt",
    },{
    "like":true,
    "date":"2012/08/01",
    "week":"Wed",
    "time":"17:01",
    "sign":"hualien",
    "title":"[作品] pi 蛇 4.6",
    "file":"snake4.6.txt",
    },{
    "like":true,
    "date":"2012/08/01",
    "week":"Wed",
    "time":"19:10",
    "sign":"hualien",
    "title":"[程式] Brainfuck",
    "file":"brainfuck.txt",
    },{
    "like":false,
    "date":"2012/08/01",
    "week":"Wed",
    "time":"17:31",
    "sign":"hualien",
    "title":"[程式] Matrix_II",
    "file":"matrix2.txt",
    },{
    "like":true,
    "date":"2012/07/31",
    "week":"Tue",
    "time":"17:18",
    "sign":"hualien",
    "title":"[程式] Petri dish---培養皿",
    "file":"petridish.txt",
    },{
    "like":true,
    "date":"2012/08/02",
    "week":"Thu",
    "time":"",
    "sign":"hualien",
    "title":"[作品] 貪吃蛇 5",
    "file":"snake5.txt",
    },{
    "like":false,
    "date":"2012/08/02",
    "week":"Thu",
    "time":"17:28",
    "sign":"hualien",
    "title":"[程式] Mouse Board",
    "file":"mouseboard.txt",
    },{
    "like":true,
    "date":"2012/08/01",
    "week":"Wed",
    "time":"17:50",
    "sign":"hualien",
    "title":"[作品] 串珠",
    "file":"chain.txt",
    },{
    "like":true,
    "date":"2012/08/02",
    "week":"Thu",
    "time":"17:40",
    "sign":"hualien",
    "title":"[作品] 新風格首頁",
    "file":"newHomePage.txt",
    },{
    "like":true,
    "base":true,
    "date":"2012/08/02",
    "week":"Thu",
    "time":"17:45",
    "sign":"hualien",
    "title":"[常用] 個人常用的程式",
    "file":"commonUse.txt",
    },{
    "like":true,
    "date":"2012/08/07",
    "week":"Tue",
    "time":"11:04",
    "sign":"hualien",
    "title":"[作品] Universe",
    "file":"universe.txt",
    "push":"universe_p.txt",
    },{
    "like":true,
    "date":"2012/08/19",
    "week":"Sun",
    "time":"22:31",
    "sign":"hualien",
    "re":true,
    "title":"[作品] 新風格首頁",
    "file":"newHomePage_re.txt",
    },{
    "like":true,
    "date":"2012/09/26",
    "week":"Wed",
    "time":"23:59",
    "sign":"nctu",
    "re":true,
    "title":"[作品] 新風格首頁",
    "file":"newHomePage_re2.txt",
    "push":"newHomePage_re2_p.txt",
    },{
    "like":true,
    "date":"2013/02/24",
    "week":"Sun",
    "time":"21:32",
    "sign":"hualien",
    "re":true,
    "title":"[作品] Universe",
    "file":"universe_re.txt",
    },{
    "like":true,
    "date":"2013/08/20",
    "week":"Tue",
    "time":"21:34",
    "sign":"hualien",
    "title":"[作品] wvim",
    "file":"wvim.txt",
    },{
    "like":true,
    "date":"2013/10/12",
    "week":"Sat",
    "time":"20:13",
    "sign":"nctu",
    "title":"[作品] 新風格首頁 & Universe1.2",
    "file":"update_on_homepage_and_universe.txt",
    "push":"update_on_homepage_and_universe_p.txt",
    },{
    "like":true,
    "date":"2014/01/10",
    "week":"Fri",
    "time":"15:59",
    "sign":"nctu",
    "title":"[有趣] 自產生程式",
    "file":"quine.txt",
    "re":false,
}];

var gen_article_menu_panel = function () {
    var article_menu_panel = [];
    var base_menu = [];
    var base_list = [];

    for (var a = 0; a < articles_list.length; a++) {
        article_menu_panel[a] = gen_article_widget(a, articles_list[a]);
        if (articles_list[a].base == true) {
            base_menu[base_menu.length] = gen_article_widget(a, articles_list[a], true);
            articles_list[a]['base_index'] = base_list.length + articles_list.length;
            base_list[base_list.length] = { 'origin': a };
        }
    }
    articles_list = articles_list.concat(base_list);
    //console.log(base_menu);
    console.log('articles_list: ', articles_list);

    return article_menu_panel.concat(base_menu);
};

var gen_article_widget = function (a, article_item, base) {
    var ret_str = '';

    if (base == undefined) {
        ret_str += '<div class="list_number text_block">' + (a+1) + '</div>';
    } else {
        ret_str += '<div class="base list_number text_block">重要</div>';
    }

    if (article_item.like == true) {
        if (article_item.base == true) {
            ret_str += '<div class="text_block like B">B</div>';
        } else {
            ret_str += '<div class="text_block like M">M</div>';
        }
    } else {
        ret_str += '<div class="text_block like">+</div>';
    } ret_str += '</div>';

    ret_str += '<div class="text_block pushes">?</div>';
    var color_str = week_color[article_item.week];
    ret_str += '<div class="text_block date ' + color_str + '">'
        + article_item.date.substr(5) + '</div>';
    ret_str += '<div class="text_block author">pi314</div>';

    if (article_item.re == true) {
        ret_str += '<div class="text_block re">Re</div>';
    } else {
        ret_str += '<div class="text_block re">◇ </div>';
    }
    //ret_str += '<div class="text_block re">◆ </div>';
    //ret_str += '<div class="text_block re">Re</div>';
    ret_str += '<div class="text_block article_title">' + article_item.title + '</div>';
    return ret_str;
};

var get_equal_index = function (index) {
    if (articles_list[index].origin != undefined) {
        // this article is based
        return articles_list[index].origin;
    }
    return index;
};

var get_article_content = function (index) {
    if (index >= 0) {
        var eq_index = get_equal_index(index);
        if (articles_content[eq_index] != undefined) {
            // this article had been fetched
            push_content[index] = [];
            if (index == bookmark_index) {
                goto_bookmark();
            }
            get_article_content(index - 1);
        } else {
            //console.log(eq_index, index);
            $.ajax({
                url: 'Articles/' + articles_list[eq_index].file,
                cache: false,
            }).done(function (msg) {
                articles_content[eq_index] = msg;
                if (articles_list[eq_index].push != undefined) {
                    // this file has apushes file
                    get_push_file(index);
                } else {
                    $($('.pushes')[index+1]).text(' ');
                    $($('.pushes')[eq_index+1]).text(' ');
                    push_content[index] = [];
                    push_content[eq_index] = [];
                    if (index == bookmark_index) {
                        goto_bookmark();
                    }
                }
                get_article_content(index - 1);
            });
        }
    }
};

var get_push_file = function (index) {
    var eq_index = get_equal_index(index);
    $.ajax({
        url: 'Articles/' + articles_list[eq_index].push,
        cache: false,
    }).done(function (msg) {
        push_data = JSON.parse(msg);
        push_content[eq_index] = push_data;
        var pushes = get_pushes(push_data);
        if (pushes >= 0) {
            $($('.pushes')[eq_index+1]).text(pushes);
            $($('.pushes')[eq_index+1]).addClass('pos_push');
        }
        if (index == bookmark_index) {
            goto_bookmark();
        }
        // now I don't consider the negtive pushes
    });
};

var get_pushes = function (push_data) {
    var sum = 0;
    for (var a = 0; a < push_data.length; a++) {
        if (push_data[a].type == 1) {
            sum += 1;
        }
    }
    return sum;
};

var get_newest = function () {
    for (var a = articles_list.length - 1; a >= 0; a--) {
        if (articles_list[a].origin == undefined) {
            return a;
        }
    }
}

var set_focus = function (index) {
    if (index < articles_list.length && index >= 0) {
        $('#article_widget_'+focus_index).removeClass('focused');
        focus_index = index;
        $('#article_widget_'+focus_index).addClass('focused');
    }
};

var set_readed = function (index) {
    var eq_index = get_equal_index(index);
    var article_item = articles_list[eq_index];
    var index_list = [];
    if (article_item.base_index == undefined) {
        index_list = [eq_index, index];
    } else {
        index_list = [eq_index, index, article_item.base_index];
    }

    var like_str = '';
    if (article_item.base == true) {
        like_str = 'b';
    } else if (article_item.like == true) {
        like_str = 'm';
    }

    for (var a = 0; a < index_list.length; a++) {
        $($('.like')[ index_list[a] + 1 ]).text(like_str);
    }

    readed_article_title = article_item.title;
    var re_element_list = $('.re');
    var article_title_element_list = $('.article_title');
    for (var a = 0; a < articles_list.length; a++) {
        var eq_index = get_equal_index(a);
        if (articles_list[eq_index].title == readed_article_title) {
            if (articles_list[a].re == true) {
                $(re_element_list[a+1]).text('=>');
                $(re_element_list[a+1]).addClass('fY');
                $(article_title_element_list[a+1]).addClass('fY');
            } else {
                $(re_element_list[a+1]).text('◆ ');
                $(re_element_list[a+1]).addClass('fG');
                $(article_title_element_list[a+1]).addClass('fG');
            }
        } else {
            if (articles_list[a].re == true) {
                $(re_element_list[a+1]).text('Re');
            } else {
                $(re_element_list[a+1]).text('◇ ');
            }
            $(re_element_list[a+1]).removeClass('fY');
            $(re_element_list[a+1]).removeClass('fG');
            $(article_title_element_list[a+1]).removeClass('fY');
            $(article_title_element_list[a+1]).removeClass('fG');
        }
    }
}

var get_last_same_title_index = function (index) {
    for (var a = focus_index - 1; a >= 0; a--) {
        var eq_index = get_equal_index(a);
        if (articles_list[eq_index].title == readed_article_title) {
            return a;
        }
    }
    return index;
}

var get_next_same_title_index = function (index) {
    for (var a = focus_index + 1; a < articles_list.length; a++) {
        var eq_index = get_equal_index(a);
        if (articles_list[eq_index].title == readed_article_title) {
            return a;
        }
    }
    return index;
}

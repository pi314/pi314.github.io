$(function () {
var get_visible_lines = function () {
    var a = $(window).height();
    var line_height = $($('.line')[0]).height();
    return Math.floor(a / line_height);
};

var week_color = {
    "Mon": "fG",
    "Tue": "fY",
    "Wed": "fL",
    "Thu": "fP",
    "Fri": "fC",
    "Sat": "fW",
    "Sun": "fR",
};

var coloring = function () {
    $('.plain').removeClass('plain');
    $('#content_0').css('background', 'navy');
    $('#content_1').css('background', 'navy');
    $('#content_2').css('background', 'navy');
};

var uncoloring = function () {
    var colors = 'brgynpcwoBRGYNPCWO';
    for (var a = 0; a < colors.length; a++) {
        $('.f'+colors[a]).addClass('plain');
        $('.b'+colors[a]).addClass('plain');
    }
    $('.item_name').addClass('plain');
    $('.item_content').addClass('plain');
    $('#content_0').css('background', 'black');
    $('#content_1').css('background', 'black');
    $('#content_2').css('background', 'black');
};

var mouse_bindings = function () {
    $('.article_widget').hover(function () {
        var index = $('.article_widget').index(this);
        set_focus(index-1);
    }).click(function () {
        enter_article();
    });

    var inrange = false;

    $('#wrapper').mouseenter(function () {
        inrange = true;
    }).mouseleave(function () {
        inrange = false;
    });

    $('body').click(function () {
        if (!inrange) {
            if (state == 'LIST') {
                enter_article();
            } else {
                back_to_list();
            }
        }
    });
};

var focus_bar_down = function () {
    set_focus(focus_index + 1);
    var cur_end = list_displayer.get_end();
    if (focus_index > cur_end) {
        var cur_range = list_displayer.get_range();
        list_displayer.set_end(cur_end + cur_range);
    }
};

var focus_bar_up = function () {
    set_focus(focus_index - 1);
    var cur_start = list_displayer.get_start();
    if (focus_index < cur_start) {
        var cur_range = list_displayer.get_range();
        var new_start = cur_start - cur_range;
        if (new_start < 0) new_start = 0;
        list_displayer.set_start(new_start);
    }
};
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
var enter_article = function () {
    var eq_index = get_equal_index(focus_index);
    if (articles_content[eq_index] != undefined
        && push_content[eq_index] != undefined) {
        state = 'ARTICLE';
        goto_article_by_index(eq_index);
        if (color_state == 'NORMAL') {
            coloring();
        } else {
            uncoloring();
        }
    } else {
        console.log(eq_index);
        console.log(articles_content[eq_index]);
        console.log(push_content[eq_index]);
    }
};

var replace_color_tags = function (str) {
    str = str.replace(/<([^\/])(.)>/g, '<span class="f$1 b$2">');
    str = str.replace(/<\/>/g, '</span>');
    return str;
};

var hyper_link_recognization = function (str) {
    return str.replace(
        /(^|[^"'])((ftp|http|https|file):\/\/[\S]+(\b|$))/gi,
        '$1<a href="$2" target="_blank">$2</a>').replace(
        /<a href="(.*)">(.*)<\/a>/gi,
        '<a href="$1" target="_black">$2</a>'
        );
};

var goto_article_by_index = function (index) {
    var index = get_equal_index(index);
    $('#articles_list').css('display', 'none');
    $('#article_content').css('display', 'block');
    if (index < articles_list.length && index >= 0) {
        var article_content_data = gen_article_content(index);
        content_displayer.set_content(article_content_data);
    }
    content_displayer.set_start(0);
    KeyManager.namespace('ARTICLE');
    set_readed(index);
    window.location.hash = articles_list[index].file;
};

var set_bookmark = function (index) {
    KeyManager.namespace('WAIT');
    $('#articles_list').css('display', 'none');
    $('#article_content').css('display', 'none');
    bookmark_index = index;
};

var goto_bookmark = function () {
    KeyManager.namespace('ARTICLE');
    goto_article_by_index(bookmark_index);
    bookmark_index = -1;
};

var back_to_list = function () {
    $('#articles_list').css('display', 'block');
    $('#article_content').css('display', 'none');
    KeyManager.namespace('LIST');
    state = 'LIST';
    window.location.hash = '#list';
    coloring();
}

var gen_article_content = function (index) {
    // process empty lines here
    var data = articles_content[index].split(/\n/);
    for (var a = 0; a < data.length; a++) {
        if (data[a][0] == '>') {
            data[a] = '<cb>' + data[a] + '</>';
        }

        data[a] = replace_color_tags(data[a]);
        data[a] = hyper_link_recognization(data[a]);

        if (data[a].length == 0) {
            data[a] = '<br>';
        }
    }
    var article_head = gen_article_head(index);
    var article_sign = gen_article_sign(index);
    var article_pushes = gen_article_pushes(index);
    return article_head.concat( data ).concat( article_sign ).concat( article_pushes );
};

var gen_article_head = function (index) {
    var eq_index = get_equal_index(index);
    var line1 = '';
    line1 += '<span class="text_block item_name">作者</span>';
    line1 += '<span class="text_block item_content">pi314 (圓周率)</span>';
    line1 += '<span class="text_block board_name">';
        line1 += '<span class="text_block item_name">站內</span>';
        line1 += '<span class="text_block item_content">P_pi314</span>';
    line1 += '</span>';

    var line2 = '';
    line2 += '<span class="text_block item_name">標題</span>';
    line2 += '<span class="text_block item_content">'
        + articles_list[eq_index].title
        + '</span>';

    var date_str = articles_list[eq_index].date;
    var week_str = articles_list[eq_index].week;
    var time_str = articles_list[eq_index].time;
    var line3 = '';
    line3 += '<span class="text_block item_name">時間</span>';
    line3 += '<span class="text_block item_content">'
        + date_str + ' ' + week_str + ' ' + time_str
        + '</span>';
    return [line1, line2, line3, '<br>'];
}

var gen_article_sign = function (index) {
    var data = signatures_list[articles_list[index].sign];
    for (var a = 0; a < data.length; a++) {
        data[a] = replace_color_tags(data[a]);
        if (data[a].length == 0) {
            data[a] = '<br>';
        }
    }
    return data;
}

var gen_article_pushes = function (index) {
    var data = [];
    for (var a = 0; a < push_content[index].length; a++) {
        var push_item = push_content[index][a];
        data[a] = '';

        if (push_item.type > 0) {
            data[a] += '<span class="text_block push fW">' + push_item.push + '</span>';
        } else {
            data[a] += '<span class="text_block push fy">' + push_item.push + '</span>';
        }

        data[a] += '<span class="text_block ID fY"> ' + push_item.ID + '</span>';

        var p = push_item.date;
        data[a] += '<span class="text_block date">'
            +p[4]+p[5]+'/'+p[6]+p[7]+' '+p[8]+p[9]+':'+p[10]+p[11]
            +'</span>';

        data[a] += '<span class="text_block push_content fy">：'
            + push_item.content
            + '</span>';

        data[a] = replace_color_tags(data[a]);
    }
    return data;
}

var down_one_line = function () {
    var cur_start = content_displayer.get_start();
    var cur_len = content_displayer.get_content_length();
    var cur_end = content_displayer.get_end();
    if (cur_end < cur_len - 1) {
        content_displayer.set_start(cur_start + 1);
    }
}

var up_one_line = function () {
    var cur_start = content_displayer.get_start();
    if (cur_start > 0) {
        content_displayer.set_start(cur_start - 1);
    }
}
    var visible_lines = get_visible_lines();
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
var signatures_list = {
    'hualien': [
            '--',
            '<gb>※ Origin: 交大次世代(bs2.to)</>',
            '<wb>◆ From: pi314@hualien</>'
        ],
    'nctu': [
            '--',
            '<gb>※ Origin: 交大次世代(bs2.to)</>',
            '<wb>◆ From: pi314@nctu</>'
        ],
};
    var articles_content = [];
    var push_content = [];
    var list_displayer = new Displayer('article_widget');
    var article_menu_panel = gen_article_menu_panel();
    list_displayer.adopt( $('#articles') );
    list_displayer.set_range(visible_lines - 3);
    list_displayer.set_content(article_menu_panel);
    list_displayer.set_end(articles_list.length - 1);
    get_article_content(articles_list.length - 1);
    var content_displayer = new Displayer('content');
    content_displayer.adopt( $('#article_content') );
    content_displayer.set_range(visible_lines);
    var focus_index = get_newest();
    var readed_article_title = '';
    console.log('focus_index', focus_index);
    $('#article_widget_'+focus_index).addClass('focused');
    var state = 'LIST';
    var color_state = 'NORMAL';
    KeyManager.namespace('LIST');
    KeyManager.keydown(['ENTER', 'RIGHT'], function () {
        enter_article();
    }).keydown(['j', 'DOWN'], function () {
        focus_bar_down();
    }).keydown(['k', 'UP'], function () {
        focus_bar_up();
    }).keydown('HOME', function () {
        set_focus(0);
        list_displayer.set_start(0);
    }).keydown(['$', 'END'], function () {
        set_focus(articles_list.length - 1);
        list_displayer.set_end(-1);
    }).keydown('[', function () {
        set_focus( get_last_same_title_index(focus_index) );
    }).keydown(']', function () {
        set_focus( get_next_same_title_index(focus_index) );
    }).keydown(['SPACE', 'PGDN'], function () {
        var cur_start = list_displayer.get_start();
        var cur_range = list_displayer.get_range();
        if (cur_start + cur_range < articles_list.length) {
            list_displayer.set_start(cur_start + cur_range);
        }
        if (focus_index + cur_range < articles_list.length) {
            set_focus(focus_index + cur_range);
        } else {
            set_focus(articles_list.length - 1);
        }
    }).keydown('PGUP', function () {
        var cur_start = list_displayer.get_start();
        var cur_range = list_displayer.get_range();
        console.log(cur_start - cur_range);
        if (cur_start - cur_range > 0) {
            list_displayer.set_start(cur_start - cur_range);
        } else {
            list_displayer.set_start(0);
        }
        if (focus_index - cur_range > 0) {
            set_focus(focus_index - cur_range);
        } else {
            set_focus(0);
        }
    });
    KeyManager.scroll_down(focus_bar_down).scroll_up(focus_bar_up);
    KeyManager.namespace('ARTICLE');
    KeyManager.keydown(['j', 'DOWN'], function () {
        down_one_line();
    }).keydown('ENTER', function () {
        if (color_state == 'NORMAL') {
            down_one_line();
        } else {
            color_state = 'NORMAL';
            coloring();
        }
    }).keydown(['k', 'UP'], function () {
        up_one_line();
    }).keydown(['q', 'LEFT'], function () {
        back_to_list();
    }).keydown('HOME', function () {
        content_displayer.set_start(0);
    }).keydown(['$', 'END'], function () {
        var cur_len = content_displayer.get_content_length();
        content_displayer.set_end(cur_len - 1);
    }).keydown(['g', '0'], function () {
        if (state == 'ARTICLE') {
            content_displayer.set_start(0);
        }
    }).keydown('BACKSLASH', function () {
        color_state = 'PLAIN';
        uncoloring();
    }).keydown('[', function () {
        set_focus( get_last_same_title_index(focus_index) );
        goto_article_by_index(focus_index);
    }).keydown(']', function () {
        set_focus( get_next_same_title_index(focus_index) );
        goto_article_by_index(focus_index);
    }).keydown(['SPACE', 'PGDN'], function () {
        var cur_start = content_displayer.get_start();
        var cur_range = content_displayer.get_range();
        var cur_length = content_displayer.get_content_length();
        if (cur_start + cur_range + cur_range < cur_length) {
            content_displayer.set_start(cur_start + cur_range);
        } else if (cur_start + cur_range == cur_length
            && focus_index < articles_list.length - 1) {
            set_focus(focus_index + 1);
            enter_article();
        } else if (cur_start + cur_range + cur_range > cur_length) {
            content_displayer.set_end(-1);
        }
    }).keydown('PGUP', function () {
        var cur_start = content_displayer.get_start();
        var cur_range = content_displayer.get_range();
        if (cur_start - cur_range > 0) {
            content_displayer.set_start(cur_start - cur_range);
        } else if (cur_start == 0 && focus_index > 0) {
            set_focus(focus_index - 1);
            enter_article();
        } else if (cur_start - cur_range < 0) {
            content_displayer.set_start(0);
        }
    });
    KeyManager.scroll_down(down_one_line).scroll_up(up_one_line);
    mouse_bindings();
    KeyManager.namespace('LIST');
    var bookmark_index = -1;
    if (window.location.hash != '') {
        console.log('found bookmark!');
        for (var a = 0; a < articles_list.length; a++) {
            if ('#' + articles_list[a].file == window.location.hash) {
                set_bookmark(a);
                get_article_content(a);
                break;
            }
        }
    }
});

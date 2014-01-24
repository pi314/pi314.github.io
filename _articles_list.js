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

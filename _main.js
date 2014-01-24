$(function () {
#_utils.js
#_articles_list.js
#_article_content.js

    var visible_lines = get_visible_lines();
#_articles.list
#_signatures.list
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

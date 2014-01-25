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

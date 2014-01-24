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
            back_to_list();
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

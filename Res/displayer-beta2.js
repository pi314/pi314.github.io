var Displayer = function (label) {
    var __displayer = null;
    var __range = 0;
    var __capacity = 0;
    var __content = [];
    var __start = 0;
    var cell1 = '<div id="' + label + '_';
    var cell2 = '" class="belt '+label+'">';
    var cell3 = '</div>';

    var __add_belt_to = function (new_index) {
        if (__capacity <= new_index) {
            for (var a = __capacity; a <= new_index; a++) {
                __displayer.append(cell1 + a + cell2 + cell3);
            }
            __capacity = new_index + 1;
        }
    };

    var __redraw_line = function (linenum) {
        __get_nth_belt(linenum).html(__content[linenum]);
    };

    var __redraw_content = function () {
        for (var a = 0; a < __content.length; a++ ) {
            __get_nth_belt(a).html(__content[a]);
        }
        for (var a = __content.length; a < __capacity; a++) {
            __get_nth_belt(a).html('');
        }
    };

    var __display_content = function () {
        for (var a = 0; a < __start; a++) {
            __get_nth_belt(a).css('display', 'none');
        }
        for (var a = __start; a < __start + __range; a++) {
            __get_nth_belt(a).css('display', 'block');
        }
        for (var a = __start + __range; a < __capacity; a++) {
            __get_nth_belt(a).css('display', 'none');
        }
    };

    var __redraw = function () {
        __redraw_content();
        __display_content();
    };

    var __get_nth_belt = function (linenum) {
        if (linenum >= __capacity) {
            __add_belt_to(linenum);
        }
        return $('#' + label + '_' + linenum);
    };

    this.adopt = function (elem) {
        __displayer = elem;
    };

    this.set_range = function (range) {
        __range = range;
        __display_content();
    };

    this.set_content = function (content) {
        if (content != undefined) {
            __content = content.concat([]);
            __add_belt_to(content.length);
            __redraw();
        }
    };

    this.set_line = function (data, linenum) {
        if (linenum >= __content.length) {
            for (var a = __content.length; a < linenum; a++) {
                __content[a] = '';
            }
        }
        __content[linenum] = data;
        __redraw_line(linenum);
    };

    this.set_start = function (start) {
        __start = start;
        __display_content();
    };

    this.set_end = function (end) {
        __start = end - __range + 1;
        __display_content();
    };

    this.get_content = function () {
        return __content.concat([]);
    };

    this.get_start = function () {
        return __start;
    };

    this.get_end = function () {
        return __start + __range - 1;
    };

    this.get_range = function () {
        return __range;
    };

    this.get_content_length = function () {
        return __content.length;
    };
}

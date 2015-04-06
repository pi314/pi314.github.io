var FRAME_DELAY = 70;
var MAX_FLOWS = 100;
var MAX_ENVELOPE_SIZE = 10;
var MOUSE_MOVE_THRESHOLD = 20;
var total_flows = 0;
var flows = {};
var WINDOW_WIDTH = 0;
var WINDOW_HEIGHT = 0;
var flow_text_height = 0;
var flow_text_width = 0;

var envelopes = [];
var new_envelopes = [];
var envelopes_used = 0;

var mouse_down = false;
var last_mouse_x = null;
var last_mouse_y = null;

$(function () {
    WINDOW_WIDTH  = $(window).width();
    WINDOW_HEIGHT = $(window).height();
    generate_flow();
    var tid = setInterval(move_flow, FRAME_DELAY);

    KeyManager.keydown('PGDN', function () {
        if (MAX_FLOWS > 0) {
            MAX_FLOWS -= 1;
        }
        console.log(MAX_FLOWS);
    }).keydown('PGUP', function () {
        MAX_FLOWS += 1;
        console.log(MAX_FLOWS);
    });

    $(window).mouseup(function (e) {
        mouse_down = false;
    });
    $(window).mousedown(function (e) {
        mouse_down = true;
        generate_evelope(e);
    });
    $(window).mousemove(detect_mouse_move);

});

function generate_evelope (e) {
    var new_envelope = {};
    new_envelope.x = e.clientX - flow_text_width / 2;
    new_envelope.y = e.clientY - flow_text_height / 2;
    new_envelope.layer = 0;
    new_envelope.id = envelopes_used;
    envelopes_used += 1;
    new_envelopes.push(new_envelope);
    if (envelopes.length == 0 && new_envelopes.length == 1) {
        setTimeout(move_envelope, FRAME_DELAY / 2);
    }

}

function detect_mouse_move (e) {
    if (mouse_down == false) { return; }
    var xx = e.clientX;
    var yy = e.clientY;
    if (last_mouse_x != null) {
        if ( dist(last_mouse_x, last_mouse_y, xx, yy) >= MOUSE_MOVE_THRESHOLD) {
            generate_evelope(e);
        }

    }

    last_mouse_x = xx;
    last_mouse_y = yy;

}

function dist (x1, y1, x2, y2) {
    return Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) );
}

function move_envelope () {
    for (var a = 0; a < new_envelopes.length; a++) {
        envelopes.push(new_envelopes[a]);
    }
    new_envelopes = [];

    var body = $('body');
    for (var a = 0; a < envelopes.length; a++) {
        this_envelope = envelopes[a];
        console.log(this_envelope);
        if (this_envelope.layer == MAX_ENVELOPE_SIZE - 1) {
            $('.env'+ this_envelope.id).remove();

        } else if (this_envelope.layer == 0) {
            var text = generate_text(1);
            var new_drop = $('<div class="flow dark env'+ this_envelope.id +'">');
            new_drop.text(text);
            body.append(new_drop);
            new_drop.css({
                'top':  this_envelope.y,
                'left': this_envelope.x,
            });

        } else {
            $('.env'+ this_envelope.id).remove();
            var text = '';
            var new_env = null;
            
            // up text
            text = generate_text(this_envelope.layer * 2 + 1);
            new_env = $('<div class="flow dark env'+ this_envelope.id +'">');
            new_env.text(text);
            body.append(new_env);
            new_env.css({
                'top':  this_envelope.y - this_envelope.layer * flow_text_height,
                'left': this_envelope.x - this_envelope.layer * flow_text_width,
            });

            // down text
            text = generate_text(this_envelope.layer * 2 + 1);
            new_env = $('<div class="flow dark env'+ this_envelope.id +'">');
            new_env.text(text);
            body.append(new_env);
            new_env.css({
                'top':  this_envelope.y + this_envelope.layer * flow_text_height,
                'left': this_envelope.x - this_envelope.layer * flow_text_width,
            });

            // left text
            text = generate_text(this_envelope.layer * 2 - 1).split('').join('\n');
            new_env = $('<div class="flow dark env'+ this_envelope.id +'">');
            new_env.text(text);
            body.append(new_env);
            new_env.css({
                'top':  this_envelope.y - (this_envelope.layer - 1) * flow_text_height,
                'left': this_envelope.x - this_envelope.layer * flow_text_width,
                'width': flow_text_width,
            });

            // right text
            text = generate_text(this_envelope.layer * 2 - 1).split('').join('\n');
            new_env = $('<div class="flow dark env'+ this_envelope.id +'">');
            new_env.text(text);
            body.append(new_env);
            new_env.css({
                'top':  this_envelope.y - (this_envelope.layer - 1) * flow_text_height,
                'left': this_envelope.x + this_envelope.layer * flow_text_width,
                'width': flow_text_width,
            });

        }
        this_envelope.layer += 1;

    }

    envelopes = envelopes.filter( function (x) { return x.layer < MAX_ENVELOPE_SIZE;} );

    if (envelopes.length > 0) {
        setTimeout(move_envelope, FRAME_DELAY / 2);
    }

}

function generate_flow () {
    var flow_id = Math.floor(Math.random() * MAX_FLOWS);
    if (flow_id in flows) { return; }
    flows[flow_id] = {};
    flows[flow_id].x = Math.random() * WINDOW_WIDTH;
    flows[flow_id].start_y = Math.random() * WINDOW_HEIGHT / 2;
    flows[flow_id].end_y   = Math.random() * WINDOW_HEIGHT / 2 + WINDOW_HEIGHT / 2;
    flows[flow_id].len     = Math.floor( Math.random() * 35 ) + 5;
    flows[flow_id].chars   = [];
    flows[flow_id].color   = get_random_flow_color();
    total_flows += 1;

}

function move_flow () {
    if (flow_text_height == 0) {
        get_flow_text_height();
    }

    if (flow_text_width == 0) {
        get_flow_text_width();
    }

    if (total_flows < MAX_FLOWS) {
        generate_flow();
    }

    for (flow_id in flows) {
        if ( flows[flow_id].chars.length < flows[flow_id].len ) {
            var new_flow_char = $('<div class="flow '+ flows[flow_id].color +'">');
            new_flow_char.text('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 52)]);
            $('body').append(new_flow_char);
            flows[flow_id].chars.unshift(new_flow_char);
        } else {
            var char_length = flows[flow_id].chars.length;
            if ( (flows[flow_id].end_y - flows[flow_id].start_y) / flow_text_height > flows[flow_id].len) {
                flows[flow_id].start_y += flow_text_height;

            } else {
                var removed_flow_char = flows[flow_id].chars.pop();
                removed_flow_char.remove();
                flows[flow_id].len -= 1;
                flows[flow_id].start_y += flow_text_height;
                if (flows[flow_id].len == 0) {
                    delete flows[flow_id];
                    total_flows -= 1;
                    if (total_flows < MAX_FLOWS) {
                        generate_flow();
                    }
                    continue;
                }

            }
        }

        for (c in flows[flow_id].chars) {
            var char_new_top = flows[flow_id].start_y + (c * flow_text_height);
            if (char_new_top > flows[flow_id].end_y) {
                flows[flow_id].chars[c].addClass('hidden');
            } else {
                flows[flow_id].chars[c].css({
                    'top':  char_new_top,
                    'left': flows[flow_id].x,
                });
            }
        }

    }

}

function get_flow_text_height () {
    var a = $('.flow').height();
    if (a != null) {
        flow_text_height = a;
    }
}

function get_flow_text_width () {
    var a = $('.flow').width();
    if (a != null) {
        flow_text_width = a;
    }
}

function get_random_flow_color () {
    var r = Math.floor(Math.random() * 50);
    if ( r == 0) {
        return 'gold';
    }
    if ( r % 2 == 0) {
        return 'bright';
    }
    return 'dark';
}

function generate_text (l, join) {
    var ret = '';
    for (var a = 0; a < l; a++) {
        ret += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 52)];
    }
    return ret;
}


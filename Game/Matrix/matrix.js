var MAX_FLOWS = 100;
var total_flows = 0;
var flows = {};
var WINDOW_WIDTH = 0;
var WINDOW_HEIGHT = 0;
var flow_text_height = 0;

$(function () {
    WINDOW_WIDTH  = $(window).width();
    WINDOW_HEIGHT = $(window).height();
    generate_flow();
    setInterval(move_flow, 70);

    KeyManager.keydown('PGDN', function () {
        if (MAX_FLOWS > 0) {
            MAX_FLOWS -= 1;
        }
        console.log(MAX_FLOWS);
    }).keydown('PGUP', function () {
        MAX_FLOWS += 1;
        console.log(MAX_FLOWS);
    });

});

function generate_flow () {
    var flow_id = Math.floor(Math.random() * MAX_FLOWS);
    if (flow_id in flows) { console.log("flow_id", flow_id, "exists"); return; }
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

function get_random_flow_color () {
    if ( Math.floor(Math.random() * 50) == 0) {
        return 'gold';
    }
    if ( Math.floor(Math.random() * 2) == 0) {
        return 'bright';
    }
    return 'dark';
}

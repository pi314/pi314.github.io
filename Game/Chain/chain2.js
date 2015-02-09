var key_list = ['UP', 'LEFT', 'RIGHT', 'DOWN', 'PGUP', 'PGDN'];

var INIT_BALLS = 50;
var SPEED_UNIT = 3;
var WINDOW_WIDTH = 0;
var WINDOW_HEIGHT = 0;
var SQRT2 = Math.sqrt(2);
var INTERVAL = Math.floor(10 / SPEED_UNIT);

var move_thread_running = false;
var move_thread_id = 0;
var move_thread_sleep_count = 0;

var key_state = {
    'UP':    false,
    'LEFT':  false,
    'RIGHT': false,
    'DOWN':  false,
};

var hx = 0;
var hy = 0;

var following_balls = INIT_BALLS;
var tx = 0;
var ty = 0;

var sx = 0;
var sy = 0;

var pos_x = [];
var pos_y = [];
var ox = 0;
var oy = 0;

var dragging = false;

$(function () {
    WINDOW_WIDTH =  $(window).width();
    WINDOW_HEIGHT = $(window).height();
    $('#amount').text(INIT_BALLS);

    /* keyboard event bindings */
    KeyManager.keydown(key_list, function (k) {
        keydown(k)
    }).keyup(key_list, function (k) {
        keyup(k)
    });

    /* screen key bindings */
    for (var a = 0; a < key_list.length; a++) {
        $('#'+ key_list[a].toLowerCase() +'-key').mouseenter(function () {
            keydown(this.id.split('-')[0].toUpperCase())
        }).mouseleave(function () {
            keyup(this.id.split('-')[0].toUpperCase())
        });
    }

    setup_balls();

    move_thread_id = setInterval(move, 20);
    move_thread_running = true;

    $('#head').mousedown(function (e) {
        ox = e.offsetX;
        oy = e.offsetY;
        dragging = true;

    });

    $(window).mousemove(function (e) {
        if ( !dragging ) {return;}
        mx = e.clientX;
        my = e.clientY;
        move_balls(mx - ox, my - oy);
    });

    $(window).mouseup(function () {
        dragging = false;
    });

});

function keydown (key) {
    if (key == 'PGUP') {
        var new_ball_x = pos_x[INTERVAL * (following_balls + 1)];
        var new_ball_y = pos_y[INTERVAL * (following_balls + 1)];
        $('body').append($('<div class="ball" style="top:'+ new_ball_y +'px; left:'+ new_ball_x +'px">'));
        $('#amount').text($('.ball').length);
    } else if (key == 'PGDN') {
        var ball_elems = $('.ball');
        if (ball_elems.length > 3) {
            $('.ball').last().remove();
            $('#amount').text($('.ball').length);
        }
    }

    $('#'+ key.toLowerCase() +'-key').css({'background':'gray'});
    key_state[key] = true;
    if (!move_thread_running) {
        move_thread_sleep_count = 0;
        move_thread_id = setInterval(move, 20);
        move_thread_running = true;
        console.log('Running thread wakeup');
    }
}

function keyup (key) {
    key_state[key] = false;
    $('#'+ key.toLowerCase() +'-key').css({'background':'lightgray'});
}

function check_moving_state () {
    return ['UP', 'LEFT', 'RIGHT', 'DOWN'].reduce(function (p, c) {return p || key_state[c];}, false);
}

function move () {
    if ( !check_moving_state() ) {
        move_thread_sleep_count += 1;
        if (move_thread_sleep_count == 30) {
            clearInterval(move_thread_id);
            move_thread_running = false;
            console.log('Long time no move, sleep');
        }
        return;
    }
    move_thread_sleep_count = 0;

    var dx = (-SPEED_UNIT) * key_state['LEFT'] + SPEED_UNIT * key_state['RIGHT'];
    var dy = (-SPEED_UNIT) * key_state['UP']   + SPEED_UNIT * key_state['DOWN'];

    if (dx != 0 && dy != 0) {
        var dx = dx / SQRT2;
        var dy = dy / SQRT2;
    }

    move_balls( (hx + dx + WINDOW_WIDTH) % WINDOW_WIDTH, (hy + dy + WINDOW_HEIGHT) % WINDOW_HEIGHT);

}

function move_balls (nx, ny) {
    var ball_elems = $('.ball');

    pos_x.unshift(hx);
    pos_y.unshift(hy);
    if (pos_x.length > INTERVAL * (ball_elems.length) + 1 ) {
        pos_x.pop();
        pos_y.pop();
    }

    for (var a = 0; a < ball_elems.length; a++) {
        if (INTERVAL * a + INTERVAL < pos_x.length) {
            if (a > following_balls) {
                following_balls += 1;
                break;
            } else {
                $(ball_elems[a]).css({
                    'top':  pos_y[INTERVAL * a + INTERVAL],
                    'left': pos_x[INTERVAL * a + INTERVAL],
                });
            }
        } else {
            break;
        }
    }

    hx = nx;
    hy = ny;

    $('#head').css({
        'top':  hy,
        'left': hx,
    });

}

function setup_balls () {
    for (var a = 0; a < INIT_BALLS; a++) {
        $('body').append($('<div class="ball">'));
    }
}

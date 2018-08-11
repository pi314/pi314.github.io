var FRAME_DELAY_MIN = 70;
var FRAME_DELAY_MAX = 100;
var MAX_FLOWS_NUM = 50;
var TEXT_WIDTH = 0;
var TEXT_HEIGHT = 0;
var SPARK_PER_CLICK = 15;

var mouse_x = undefined;
var mouse_y = undefined;

var timestamp = [];
var overload = false;


function main () {
    TEXT_WIDTH = $('#sample').width();
    TEXT_HEIGHT = $('#sample').height();

    timestamp = [Date.now(), Date.now()]

    var app = new Vue({
        el: '#app',
        data: {
            flows: [],
            sparks: [],
            click: function (e) {
                var x = e.clientX;
                var y = e.clientY;
                var no_spark = (app.sparks.length == 0);
                for (var i = 0; i < SPARK_PER_CLICK; i++) {
                    if (!overload || no_spark) {
                        app.sparks.push(new spark(x, y, i));
                    }
                }
            },
            mousemove: function (e) {
                mouse_x = e.clientX;
                mouse_y = e.clientY;
            }
        }
    })

    setTimeout(function () {
        next_frame(app);
    }, FRAME_DELAY_MIN);
}


function next_frame (app) {
    timestamp = [timestamp[1], Date.now()];
    overload = ((timestamp[1] - timestamp[0]) > FRAME_DELAY_MAX);
    console.log(timestamp[1] - timestamp[0], overload, app.flows.length, MAX_FLOWS_NUM);

    if (app.flows.length < MAX_FLOWS_NUM && !overload) {
        app.flows.push(new flow());
    }

    for (var i = 0; i < app.flows.length; i++) {
        app.flows[i].step();
    }

    for (var i = 0; i < app.sparks.length; i++) {
        app.sparks[i].step();
    }

    app.sparks = app.sparks.filter(function (s) {
        return s.valid;
    });

    app.flows = app.flows.filter(function (f) {
        return f.valid;
    });

    if (overload) {
        MAX_FLOWS_NUM = Math.max(1, MAX_FLOWS_NUM - 1);
    } else if (app.flows.length == MAX_FLOWS_NUM) {
        MAX_FLOWS_NUM += 1;
    }

    setTimeout(function () {
        next_frame(app);
    }, FRAME_DELAY_MIN);
}


function flow () {
    this.top = rand_top();
    this.left = rand_left();
    this.len = Math.floor((rand_bot() - this.top) / TEXT_HEIGHT) + 5;
    this.data = ' '.repeat(this.len);
    var rl = rand_dlen();
    for (var i = 0; i < rl; i++) {
        this.data += rand_char();
    }
    this.cursor = this.data.length - 1;
    this.dark = rand_dark();
    this.gold = rand_gold();
    this.valid = true;

    this.pos = function () {
        return {
            'top': this.top + 'px',
            'left': this.left + 'px',
        }
    };

    this.text = function () {
        return this.data.substr(this.cursor, this.len).split('').join('\n');
    };

    this.step = function () {
        this.cursor -= 1;

        if (this.cursor <= 0) {
            this.valid = false;
        }
    };

    this.cls = function () {
        return [(this.dark ? 'dark' : 'bright'), (this.gold ? 'gold' : '')].join(' ');
    };
}


function spark (x, y, delay) {
    this.x = x;
    this.y = y;
    this.delay = Math.floor(delay);

    var vr = rand_int(20, 50);
    var vtheta = Math.random() * Math.PI * 2;

    this.vx = Math.cos(vtheta) * vr;
    this.vy = Math.sin(vtheta) * vr;

    this.chase = false;
    this.progress = 0;

    this.valid = true;

    this.pos = function () {
        return {
            'top': (this.y - TEXT_HEIGHT / 2) + 'px',
            'left': (this.x - TEXT_WIDTH / 2) + 'px',
        };
    };

    this.step = function () {
        if (!this.chase) {
            var mx = (mouse_x === undefined) ? this.x : mouse_x;
            var my = (mouse_y === undefined) ? this.y : mouse_y;
            this.progress += 1;
            this.x += this.vx;
            this.y += this.vy;
            var d = Math.sqrt(Math.pow(mx - this.x, 2) + Math.pow(my - this.y, 2));
            this.vx = this.vx / 1.1 + (mx - this.x) / d;
            this.vy = this.vy / 1.1 + (my - this.y) / d;

            if (this.progress >= 7 + this.delay) {
                this.chase = true;
                this.progress = 0;
            }
        } else {
            if (mouse_x === undefined || mouse_y === undefined) {
                return;
            }
            this.progress += 1;
            this.x = (this.x * (7 - this.progress) + mouse_x * this.progress) / 7;
            this.y = (this.y * (7 - this.progress) + mouse_y * this.progress) / 7;

            if (this.progress >= 7) {
                this.valid = false;
            }
        }
    };

    this.chr = rand_char();
}


function rand_top () {
    return Math.random() * window.innerHeight / 2;
}


function rand_bot () {
    return (Math.random() + 1) * window.innerHeight / 2;
}


function rand_left () {
    return Math.random() * (window.innerWidth - TEXT_WIDTH * 2) + TEXT_WIDTH;
}


function rand_dlen () {
    return Math.floor(Math.random() * 35) + 5;
}


function rand_char () {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 52)];
}


function rand_dark () {
    return (Math.floor(Math.random() * 50) % 2 == 0) ? true : false;
}


function rand_gold () {
    return (Math.floor(Math.random() * 50) == 0) ? true : false;
}


function rand_spark_v () {
    return (rand_int(0, 1) ? 1 : (-1)) * rand_int(100, window.innerWidth / 10);
}


function rand_int (a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
}


function sgn (n) {
    return (n > 0) - (n < 0);
}

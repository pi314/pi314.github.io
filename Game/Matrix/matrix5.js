var FRAME_DELAY = 70;
var MAX_FLOWS_NUM = 50;
var TEXT_WIDTH = 0;
var TEXT_HEIGHT = 0;

var mouse_x = 0;
var mouse_y = 0;


function main () {
    TEXT_WIDTH = $('#sample').width();
    TEXT_HEIGHT = $('#sample').height();

    var app = new Vue({
        el: '#app',
        data: {
            flows: [],
            sparks: [],
            click: function (e) {
                var x = e.clientX;
                var y = e.clientY;
                for (var i = 0; i < 15; i++) {
                    app.sparks.push(new spark(x, y, i));
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
    }, FRAME_DELAY);
}


function next_frame (app) {
    if (app.flows.length < MAX_FLOWS_NUM) {
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

    setTimeout(function () {
        next_frame(app);
    }, FRAME_DELAY);
}


function flow () {
    this.top = 0;
    this.left = 0;
    this.data = '';
    this.cursor = 0;
    this.len = 0;
    this.dark = false;
    this.gold = false;

    this.restart = function () {
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
    };

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
            this.restart();
        }
    };

    this.cls = function () {
        return [(this.dark ? 'dark' : 'bright'), (this.gold ? 'gold' : '')].join(' ');
    };

    this.restart();
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
            this.progress += 1;
            this.x += this.vx;
            this.y += this.vy;
            var d = Math.sqrt(Math.pow(mouse_x - this.x, 2) + Math.pow(mouse_y - this.y, 2));
            this.vx = this.vx / 1.1 + (mouse_x - this.x) / d;
            this.vy = this.vy / 1.1 + (mouse_y - this.y) / d;

            if (this.progress >= 7 + this.delay) {
                this.chase = true;
                this.progress = 0;
            }
        } else {
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

unit = 2;
posRef = 10/unit;
posRef = 70/unit;
balls = 7;
recordLength = balls*posRef+1;
vx = 0;
vy = 0;
hx = 0;
hy = 0;
moving = false;
keyStat = {
    'left':false,
    'up':false,
    'right':false,
    'down':false,
    'shift':false,
    'pgup':false,
    'pgdn':false
};
//color = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
$(function () {
    var str = '';
    for (var a = 0; a < balls; a++) {
        str += '<div id="ball'+a+'" class="ball"></div>';
    }
    str += '<div id="head"></div>';
    $('#wrapper').append(str);
    
    /*
    //color
    $('.ball').map(function (index, elem) {
        var element = $(elem);
        element.css({'background':color[index%(color.length)]});
    });
    */
    
    positionx = new Array(recordLength);
    positiony = new Array(recordLength);
    for (var a = 0; a < recordLength; a++) {
        positionx[a] = 0;
        positiony[a] = 0;
    }
    ballx = new Array(balls);
    bally = new Array(balls);
    for (var a = 0; a < balls; a++) {
        ballx[a] = 0;
        bally[a] = 0;
    }
    $('body').keydown(keyDownEvent);
    $('body').keyup(keyUpEvent);
    $('#upKey')
        .mouseenter(function () {keydown('up');})
        .mouseleave(function () {keyup('up');});
    $('#leftKey')
        .mouseenter(function () {keydown('left');})
        .mouseleave(function () {keyup('left');});
    $('#rightKey')
        .mouseenter(function () {keydown('right');})
        .mouseleave(function () {keyup('right');});
    $('#downKey')
        .mouseenter(function () {keydown('down');})
        .mouseleave(function () {keyup('down');});
    $('#shiftKey').mouseenter(function () {
            if (keyStat['shift']) {
                keyup('shift');
            }else{
                keydown('shift');
            }
        });
    moveID = setInterval(move, 10);
});
function isMoving () {
    var movingKey = ['left', 'up', 'right', 'down'];
    var l = movingKey.length;
    var r = false;
    for (var a in movingKey.set())
        r = r || keyStat[a];
    return r;
}
function move () {
    if (!isMoving()) return;
    if (keyStat['shift']) {
        if (vx * vy != 0) {
            hx += vx/Math.sqrt(2);
            hy += vy/Math.sqrt(2);
        }else{
            hx += vx;
            hy += vy;
        }
        $('#head').css({'top':hy, 'left':hx});
        $('.ball').map(function (index, elem) {
            var element = $(elem);
            if (vx * vy != 0) {
                ballx[index] += vx/Math.sqrt(2);
                bally[index] += vy/Math.sqrt(2);
            }else{
                ballx[index] += vx;
                bally[index] += vy;
            }
            element.css({'top':bally[index], 'left':ballx[index]});
        });
    }else{
        if (vx * vy != 0) {
            hx += vx/Math.sqrt(2);
            hy += vy/Math.sqrt(2);
            positionx.unshift(vx/Math.sqrt(2));
            positionx.pop();
            positiony.unshift(vy/Math.sqrt(2));
            positiony.pop();

        }else{
            hx += vx;
            hy += vy;
            positionx.unshift(vx);
            positionx.pop();
            positiony.unshift(vy);
            positiony.pop();
        }
        $('#head').css({'top':hy, 'left':hx});
        $('.ball').map(function (index, elem) {
            var element = $(elem);
            var dx = positionx[posRef*(index+1)];
            var dy = positiony[posRef*(index+1)];
            ballx[index] += dx;
            bally[index] += dy;
            element.css({'top':bally[index], 'left':ballx[index]});
        });
    }
}

function parseKeyCode (input) {
    switch (input) {
        case 37:return 'left';
        case 38:return 'up';
        case 39:return 'right';
        case 40:return 'down';
        case 27:return 'esc';
        case 16:return 'shift';
        case 33:return 'pgup';
        case 34:return 'pgdn';
        default:console.log(input);return 'unknown';
    }
}
function keyDownEvent () {
    var k = parseKeyCode(event.which);
    console.log(k);
    keydown(k);
}
function keydown (k) {
    if (keyStat[k])
        return;
    keyStat[k] = true;
    switch (k) {
        case 'left'://left
            vx += -unit;
            $('#leftKey').css({'background':'gray'});
            break;
        case 'up'://up
            vy += -unit;
            $('#upKey').css({'background':'gray'});
            break;
        case 'right'://right
            vx += unit;
            $('#rightKey').css({'background':'gray'});
            break;
        case 'down'://down
            vy += unit;
            $('#downKey').css({'background':'gray'});
            break;
        case 'shift':
            $('#shiftKey').css({'background':'gray'});
            break;
        default:;
    }
}
function keyUpEvent () {
    var k = parseKeyCode(event.which);
    keyup(k);
}
function keyup (k) {
    if (!keyStat[k])
        return;
    keyStat[k] = false;
    
    switch (k) {
        case 'left'://left
            vx += unit;
            $('#leftKey').css({'background':'lightgray'});
            break;
        case 'up'://up
            vy += unit;
            $('#upKey').css({'background':'lightgray'});
            break;
        case 'right'://right
            vx -= unit;
            $('#rightKey').css({'background':'lightgray'});
            break;
        case 'down'://down
            vy -= unit;
            $('#downKey').css({'background':'lightgray'});
            break;
        case 'shift':
            $('#shiftKey').css({'background':'lightgray'});
            break;
        case 'esc':
            clearInterval(moveID);
            break;
        case 'pgup':
            addBall();
            break;
        case 'pgdn':
            removeBall();
            break;
        default:;
    }
}
function addBall () {
    balls++;
    var oldLength = recordLength;
    recordLength = balls*posRef+1;
    
    for (var a = 0; a < posRef; a++) {
        positionx.push(0);
        positiony.push(0);
    }
    
    var lastx = ballx.last();
    var lasty = bally.last();
    ballx.push(lastx);
    bally.push(lasty);
    $('#wrapper').append('<div id="ball'+(balls-1)+'" class="ball"></div>');
    $($('.ball')[balls-1]).css({
        'top':bally[balls-1],
        'left':ballx[balls-1]
        //'background':color[(balls-1)%color.length]
    });
}
function removeBall () {
    if (balls == 1)return;
    balls--;
    var oldLength = recordLength;
    recordLength = balls*posRef+1;
    
    for (var a = 0; a < posRef; a++) {
        positionx.pop();
        positiony.pop();
    }
    
    ballx.pop();
    bally.pop();
    $($('.ball')[balls-1]).remove();
}
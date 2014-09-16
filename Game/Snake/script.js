DEBUG = false;
MAINMENU = 0;
GAME = 1;
HELPPAGE = 2;
CHOOSE = 3;
PORTAL_NOT_EXIST = -1;
PORTAL_CLOSE = 0;
PORTAL_OPEN = 1;
gameModeName = ['經典模式','競技場1','競技場2','驚喜模式'];
gameModeName2 = ['經典','競技場1','競技場2','驚喜'];
gameModeName3 = ['CLASSIC', 'FIGHTER1', 'FIGHTER2', 'SURPRICE'];
statement =['經典的吃方塊模式,<br/>以不斷長大為最高目標!',
            '不以長大,<br/>而是以擊敗對手為第一優先!',
            '尾巴固定,<br/>以不斷伸長的蛇身包圍對手!',
            '除了可以吃的方塊,<br/>隨時會有更奇特的方塊出現在場上!'];
pauseStr = ['請','按','空','白','鍵','開','始','遊','戲','~'],
portalMoveTime = 0;
portalTimer = 0;
portalState = 'PORTAL_NOT_EXIST';
bornAnimateID = [0,0,0];
/*
eggSystem = (function(){
    //b = 66
    var egg = [ [87,87,83,83,65,68,65,68,66,65], //wads
                [73,73,75,75,74,76,74,76,66,65], //ijlk
                [38,38,40,40,37,39,37,39,66,65]];//arrow key
    var type = ['NORMAL', 'BLACK', 'WHITE'];
    var snakeType = [0,0,0,0];
    var eggJudgeQueue = [];
    return {
        getKey : function(input){
            eggJudgeQueue.push(input);
            if(eggJudgeQueue.length > 10)
                eggJudgeQueue.shift();
            
            judgeResult = this.judge();
            if(snakeType[judgeResult] < 2)
                snakeType[judgeResult]++;
        },
        judge : function(){
            if(eggJudgeQueue.length < 10)
                return 3;
            var match;
            for(var a = 0; a < 3; a++)
            {
                match = true;
                for(var b = 0; b < 10; b++)
                {
                    if(eggJudgeQueue[b] != egg[a][b])
                    {
                        match = false;
                        break;
                    }
                }
                if(match)
                {
                    return a;
                }
            }
            return 3;
        }
    };
})();
*/
$(
    function(){
        init();
        $('#wrapper').keydown(onKeyDown).keyup(onKeyUp);
        gameState = ['MAINMENU'];
        if(DEBUG)
            enterMainMenuPortal('GAME');
        else
            animatePortal();
    }
);
function init(){
    MAPX = 25;
    MAPY = 25;
    map = new Array(MAPX);
    for(var a = 0; a < MAPX; a++)
    {
        map[a] = new Array(MAPY);
        for(var b = 0; b < MAPY; b++)
            map[a][b] = new Pair();
    }
    detectingTime = 10;//150;
    setTimeout(timeMaster, detectingTime);
    pause = true;
}
function timeMaster()
{
    if(!pause)
    {
        if(gameState[0] == 'GAME')
        {
            snake[0].move();
            snake[1].move();
            snake[2].move();
            if(portalState != 'PORTAL_NOT_EXIST')
                portalMaster();
        }
    }
    setTimeout(timeMaster, detectingTime);
}
function reset(){
    noCheckIn = false;
    gameState[0] = 'GAME';
    gameMode = gameModeName3[gameModeNum];
    $('#wrapper').html('<div id="info"><div id="gameModeStr">遊戲模式：'+gameModeName2[gameModeNum]+'</div></div><div id="field"></div><div>style="float:clear"></div>');
    for(var a = 0; a < MAPX; a++)
    {
        for(var b = 0; b < MAPY; b++)
            map[a][b].setValue(0,0);
    }
    setTimeout(function(){putField(0)},1);
    snakeInfo('greenHead','greenBody','w','a','d','s',1,20);
    snakeInfo('blueHead','blueBody','i','j','l','k',2,143);
    snakeInfo('yellowHead','yellowBody','↑','←','→','↓',3,266);
    snake = [];
    snake.push(new Snake(87,65,68,83,'greenHead','greenBody',1));//wads
    snake.push(new Snake(73,74,76,75,'blueHead','blueBody',2));//ijlk
    snake.push(new Snake(38,37,39,40,'yellowHead','yellowBody',3));//arrow key
    starAmount = 0;
    $('#info').append('<div id="reset" class="gameButton">Reset</div>');
    resetButton = $('#reset');
    resetButton.css('top', '385px');
    resetButton.css('left', '40px');
    resetButton.click(function(){
        closePortal();
        portalState = 'PORTAL_NOT_EXIST';
        return (function(){
            reset(GAME);
        })();
    });
    $('#info').append('<div id="backToMain" class="gameButton">Menu</div>');
    backToMainButton = $('#backToMain');
    backToMainButton.css('top', '450px');
    backToMainButton.css('left', '40px');
    backToMainButton.click(function(){
        closePortal();
        portalState = 'PORTAL_NOT_EXIST';
        return (function(){
            enterMainMenuPortal('GAME');
        })();
    });
    checkIn = 0;
    checkInList = [];
    pause = true;
}
function portalMaster()
{
    switch(portalState)
    {
    case 'PORTAL_CLOSE':
        openPortal();
    break;
    case 'PORTAL_OPEN':
        portalTimer++;
        if(portalTimer % 100 == 0)
            portalShine();
        if(portalTimer == 3000)//3000 * 10ms = 30 sec
            closePortal();
    break;
    }
}
function openPortal()
{
    portalMoveTime = 30;
    portalState = 'PORTAL_OPEN';
    
    portal0 = randCoord();
    portal0x = portal0.getx();
    portal0y = portal0.gety();
    map[portal0x][portal0y].setPortal(0);
    
    portal1 = randCoord();
    portal1x = portal1.getx();
    portal1y = portal1.gety();
    map[portal1x][portal1y].setPortal(1);
    
    map[portal0x][portal0y].setMirror(portal1);
    map[portal1x][portal1y].setMirror(portal0);
    
    portalID0 = cellID(portal0x,portal0y);
    $('#'+portalID0).removeClass('ground');
    $('#'+portalID0).addClass('portal');
    $('#'+portalID0).html('30');
    
    portalID1 = cellID(portal1x,portal1y);
    $('#'+portalID1).removeClass('ground');
    $('#'+portalID1).addClass('portal');
    $('#'+portalID1).html('30');
    console.log('portal0 : ('+portal0x+' , '+portal0y+')');
    console.log('portal1 : ('+portal1x+' , '+portal1y+')');
    portalTimer = 0;
}
function portalShine()
{
    portalMoveTime--;
    $('#'+portalID0).html(portalMoveTime);
    $('#'+portalID1).html(portalMoveTime);
}
function closePortal()
{
    if(portalState != 'PORTAL_OPEN')
        return;
    (function(){
        snake[0].startCut();
        snake[1].startCut();
        snake[2].startCut();
        return function(){
            map[portal0x][portal0y].clear();
            map[portal1x][portal1y].clear();
        }
    })()();
    $('#'+portalID0).removeClass('portal');
    $('#'+portalID0).addClass('ground');
    $('#'+portalID0).html('');
    $('#'+portalID1).removeClass('portal');
    $('#'+portalID1).addClass('ground');
    $('#'+portalID1).html('');
    portalState = 'PORTAL_CLOSE';
    portalTimer = 0;
}
var snakeInfo = function(headSkin, bodySkin, UP, LEFT, RIGHT, DOWN, snakeID, alignTop){
    $('#info').append('<div id="snakeInfo'+snakeID+'" class="snakeInfo"></div>');
    $('#snakeInfo'+snakeID).css('top',alignTop+'px');
    var infoWindow = $('#snakeInfo'+snakeID);
    
    //put head sample and body sample
    //head sample
    infoWindow.append('<div id="headSample'+snakeID+'" class="wall"></div>');
    temp = $('#headSample'+snakeID);
    temp.css('top', '20px');
    temp.css('left', '64px');
    
    //body sample
    infoWindow.append('<div id="bodySample'+snakeID+'" class="wall"></div>');
    temp = $('#bodySample'+snakeID);
    temp.css('top', '20px');
    temp.css('left', '42px');
    
    //tail(body) sample
    infoWindow.append('<div id="tailSample'+snakeID+'" class="wall"></div>');
    temp = $('#tailSample'+snakeID);
    temp.css('top', '20px');
    temp.css('left', '20px');
    
    //snake length
    infoWindow.append('<div id="length'+snakeID+'" class="snakeLength"></div>');
    temp = $('#length'+snakeID);
    temp.html(0);
    temp.css('color','gray');
    
    //snake speed
    infoWindow.append('<div id="speed'+snakeID+'" class="snakeSpeed"></div>')
    temp = $('#speed'+snakeID);
    temp.html(0);
    temp.css('color','gray');
    
    //control up
    infoWindow.append('<span id="controlUP'+snakeID+'" class="snakeInfo_control"></span>');
    temp = $('#controlUP'+snakeID);
    temp.css('top', '40px');
    temp.css('left', '46px');
    temp.html(UP);
    temp.css('color','gray');
    
    //control left
    infoWindow.append('<span id="controlLEFT'+snakeID+'" class="snakeInfo_control"></span>');
    temp = $('#controlLEFT'+snakeID);
    temp.css('top', '65px');
    temp.css('left', '20px');
    temp.html(LEFT);
    temp.css('color','gray');
    
    //control right
    infoWindow.append('<span id="controlRIGHT'+snakeID+'" class="snakeInfo_control"></span>');
    temp = $('#controlRIGHT'+snakeID);
    temp.css('top', '65px');
    temp.css('left', '71px');
    temp.html(RIGHT);
    temp.css('color','gray');
    
    //control down
    infoWindow.append('<span id="controlDOWN'+snakeID+'" class="snakeInfo_control"></span>');
    temp = $('#controlDOWN'+snakeID);
    temp.css('top', '65px');
    temp.css('left', '46px');
    temp.html(DOWN);
    temp.css('color','gray');
};
var Pair = function(){
    var x = 0;
    var y = 0;
    var backx = 0;
    var backy = 0;
    var portalID = -1;
    var mirror = null;
    var snakeWho = 0;
    this.setValue = function(a,b){
        x = a;
        y = b;
    };
    this.setStar = function(){
        x = 1;
        y = 1;
    };
    this.setHead = function(a){
        x = -1;
        y = -1;
        snakeWho = a;
    };
    this.setPortal = function(a){
        if(a == 0){
            x = 1;
            y = -1;
            portalID = 0;
        }
        else{
            x = -1;
            y = 1;
            portalID = 1;
        }
    };
    this.setMirror = function(a){
        mirror = a;
    }
    this.getx = function(){
        return x;
    };
    this.gety = function(){
        return y;
    };
    this.getMirror = function(){
        return mirror;
    }
    this.setBackValue = function(a,b){
        backx = a;
        backy = b;
    };
    this.getbackx = function(){
        return backx;
    };
    this.getbacky = function(){
        return backy;
    };
    this.isOccupied = function(){
        if(x == 0 && y == 0)
            return false;
        return true;
    };
    this.isStar = function(){
        if(x == 1 && y == 1)
            return true;
        if(x == -1 && y == -1)
        {
            console.log('trying to eat head : '+snakeWho);
            if(snakeWho > 0)
            {
                console.log(!snake[snakeWho - 1].isMoving());
                return !snake[snakeWho - 1].isMoving();
            }
        }
        return false;
    };
    this.isHead = function(){
        return snakeWho;
    };
    this.isPortal = function(){
        if(x+y == 0 && x*y != 0)
            return true;
        return false;
    }
    this.clear = function(){
        x = 0;y = 0;portalID = -1;backx = 0;backy = 0;
        mirror = null;snakeWho = 0;
    };
};
function onKeyDown(){
    var input = event.keyCode;
    switch(gameState[0])
    {
    case 'GAME':
        switch(input)
        {
        case 27://ESC
            (function(){
                closePortal();
                portalState = 'PORTAL_NOT_EXIST';
                return (function(){
                    enterMainMenuPortal('GAME');
                })();
            })();
        break;
        case 32://space
            if(gameState[1] == 'NEXT_ROUND'){
                for(var a = 0; a < checkInList.length; a++)
                {
                    snake[checkInList[a]-1].reset();
                }
                clearMap();
                pause = true;
                if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2'){
                    var temp = checkInList;
                    checkIn = 0;
                    checkInList = [];
                    for(var a = 0; a < temp.length; a++){
                        snake[temp[a]-1].born();
                    }
                }else{
                    noCheckIn = false;
                    checkIn = 0;
                    checkInList = [];
                }
                gameState.pop();
            }else{
                if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')
                {
                    if(checkIn < 2)
                        return;
                }
                noCheckIn = true;
                pause = !pause;
                if(pause){
                    for(var a = 0; a < 10; a++)
                    {
                        $('#'+(a+257)).html(pauseStr[a]);
                    }
                }else{
                    for(var a = 0; a < 10; a++)
                    {
                        $('#'+(a+257)).html('');
                    }
                }
            }
        break;
        default:
            snake[0].pushBuffer(input);snake[0].highlight(input);
            snake[1].pushBuffer(input);snake[1].highlight(input);
            snake[2].pushBuffer(input);snake[2].highlight(input);
        }
    break;
    case 'MAINMENU':
        switch(input)
        {
        case 13://enter
            leaveMainMenuPortal('MAINMENU', 'CHOOSE');
        break;
        case 72://H
            leaveMainMenuPortal('MAINMENU', 'HELPPAGE');
        break;
        //wads
        case 87:case 65:case 68:case 83:
        //ijlk
        case 73:case 74:case 76:case 75:
        //up left right down
        case 38:case 37:case 39:case 40:
            //eggSystem.getKey(input);
        break;
        }
    break;
    case 'CHOOSE':
        switch(input)
        {
        case 27://esc
            leaveChooseModePortal('MAINMENU');
        break;
        case 37://left
            flipLeft();
        break;
        case 39://right
            flipRight();
        break;
        case 13://enter
            leaveChooseModePortal('GAME');
        break;
        }
    break;
    case 'HELPPAGE':
        switch(input)
        {
        case 27://esc
            enterMainMenuPortal('HELPPAGE');
        break;
        case 37://left
            helpFlipLeft();
        break;
        case 39://right
            helpFlipRight();
        }
    }
}
function onKeyUp(){
    var input = event.keyCode;
    //$('#info').html(input);
    if(gameState[0] == 'GAME')
    {
        snake[0].unLight(input);
        snake[1].unLight(input);
        snake[2].unLight(input);
    }
}
function cellID(a,b){
    return a*MAPX+b;
}
function putStar(input)
{
    if(gameMode == "FIGHTER1" || gameMode == "FIGHTER2")
        return;
    //$(this).css('background', 'yellow');
    //$(this).addClass('star');
    //$(this).removeClass('ground');
    //$('#info').html('star');
    map[input.getx()][input.gety()].setStar();
    var temp = cellID(input.getx(),input.gety());
    $('#'+temp).removeClass('ground');
    $('#'+temp).addClass('star');
    starAmount++;
}
function randCoord()
{
    var coordSample = new Pair();
    do
    {
        var randx = Math.floor(Math.random() * MAPX);
        var randy = Math.floor(Math.random() * MAPY);
    }while(map[randx][randy].isOccupied());
    coordSample.setValue(randx, randy);
    return coordSample;
}
function showMode()
{
    $('#chooseMode').fadeOut(100);
    $('#modeStatement1').fadeOut(100,function(){
        $('#chooseMode').html(gameModeName[gameModeNum]);
        $('#modeStatement1').html(statement[gameModeNum]);
        $('#chooseMode').fadeIn(100);
        $('#modeStatement1').fadeIn(100);
    });
    //mainMenuAnimateID = setTimeout(function(){statementFade()},1);
}
function roundEnd()
{
    for(var a = 0; a < checkInList.length; a++)
    {
        snake[checkInList[a]-1].stop();
        if(snake[checkInList[a]-1].getLifeState() == 'NORMAL')
            snake[checkInList[a]-1].winner();
    }
    gameState.push('NEXT_ROUND');
}
function clearMap()
{    
    for(var a = 0; a < MAPX; a++){
        for(var b = 0; b < MAPY; b++){
            map[a][b].clear();
        }
    }
    $('#field').html('');
    fastPutField();
    console.log('map cleared');
}
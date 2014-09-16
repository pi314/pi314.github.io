var Snake = function(up,left,right,down,headSkin,bodySkin,snakeID){
    this.getLifeState = function(){
        return lifeState;
    };
    this.getID = function(){
        return snakeID;
    };
    this.winner = function(){
        wins++;
        if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')
        {
            $('#headSample'+snakeID).html(wins);
            $('#tailSample'+snakeID).html(loses);
        }
    };
    var lifeState = 'WAITING';
    var movex = 0;
    var movey = 0;
    var length = 0;
    var remainLength = 0;
    var bornx = 0;
    var borny = 0;
    var headx = 0;
    var heady = 0;
    var tailx = 0;
    var taily = 0;
    //set control keys
    var UP = up;
    var LEFT = left;
    var RIGHT = right;
    var DOWN = down;
    var moveQueue = [];
    var judge = 1;
    var rgb = 0;
    var speed = 10000;
    var speedUp = 0;
    var delay = 0;
    var escapeAbility = 0;
    var escapeDelay = 0;
    var inPortal = 0;
    var cutQueuex = [];
    var cutQueuey = [];
    var cool = 0;
    var fighter1_acc = 0;
    var isStop = false;
    var wins = 0;
    var loses = 0;
    this.bye = function(){
        lifeState = 'DEAD';
        $('#'+cellID(headx, heady)).removeClass(headSkin);
        $('#length'+snakeID).css('color', 'gray');
        $('#speed'+snakeID).css('color', 'gray');
        headx = -1;
        checkIn--;
        if((checkIn <= 1 && (gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')) ||
            (checkIn <= 0 && (gameMode == 'CLASSIC' || gameMode == 'SURPRICE')))
        {
            roundEnd();
            for(var a = 0; a < 10; a++)
            {
                $('#'+(a+257)).html(pauseStr[a]);
            }
        }
        loses++;
        if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')
            $('#tailSample'+snakeID).html(loses);
    };
    this.stop = function(){
        isStop = true;
    };
    this.isMoving = function(){
        return !(movex + movey == 0);
    };
    this.reset = function(){
        judge = 1;
        rgb = 256;
        moveQueue = [];
        movex = 0;
        movey = 0;
        remainLength = 9;
        delay = 0;
        inPortal = 0;
        $('#controlUP'+snakeID).css('color', 'gray');
        $('#controlLEFT'+snakeID).css('color', 'gray');
        $('#controlRIGHT'+snakeID).css('color', 'gray');
        $('#controlDOWN'+snakeID).css('color', 'gray');
        $('#length'+snakeID).html(0).css('color', 'gray');
        $('#speed'+snakeID).html(0).css('color', 'gray');
        if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')
        {
            $('#headSample'+snakeID).html(wins);
            $('#tailSample'+snakeID).html(loses);
        }
        lifeState = 'WAITING';
        length = 1;
        escapeDelay = 0;
        fighter1_acc = 0;
        isStop = false;
    };
    this.startCut = function(){
        if(inPortal == 0)
        {
            return;
        }
        
        while(inPortal > 0)
        {
            var tempx = map[tailx][taily].getx();
            var tempy = map[tailx][taily].gety();
            cutQueuex.push(tailx);
            cutQueuey.push(taily);
            tailx = (tailx + MAPX + tempx) % MAPX;
            taily = (taily + MAPY + tempy) % MAPY;
            while(map[tailx][taily].isPortal())
            {
                var temp = map[tailx][taily].getMirror();
                tailx = (temp.getx() + tempx + MAPX) % MAPX;
                taily = (temp.gety() + tempy + MAPY) % MAPY;
                inPortal--;
            }
            length--;
        }
        while(map[tailx][taily].isPortal())
        {
            var temp = map[tailx][taily].getMirror();
            tailx = (temp.getx() + tempx + MAPX) % MAPX;
            taily = (temp.gety() + tempy + MAPY) % MAPY;
        }
    };
    this.preBorn = function(input){
        if(noCheckIn){
            if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2'){
                if(lifeState == 'WAITING')
                    return;
            }
            else
                return;
        }
        if(input == UP && judge % 2 != 0)
        {
            judge *= 2;
        }
        else if(input == LEFT && judge % 3 != 0)
        {
            judge *= 3;
        }
        else if(input == RIGHT && judge % 5 != 0)
        {
            judge *= 5;
        }
        else if(input == DOWN && judge % 7 != 0)
        {
            judge *= 7;
        }
        if(judge == 210)
            this.born();
    };
    this.born = function(){
        bornPosition = randCoord();
        //put head
        bornx = bornPosition.getx();
        borny = bornPosition.gety();
        headx = bornx;
        heady = borny;
        tailx = bornx;
        taily = borny;
        var temp = cellID(bornx, borny);
        $('#'+temp).removeClass('ground');
        $('#'+temp).addClass(headSkin);
        map[headx][heady].setHead(snakeID);
        $('#length'+snakeID).css('color', 'white');
        $('#length'+snakeID).html(1);
        $('#speed'+snakeID).css('color', 'white');
        $('#speed'+snakeID).html(1);
        if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')
        {
            $('#headSample'+snakeID).html(wins);
            $('#tailSample'+snakeID).html(loses);
        }
        switch(gameMode)
        {
            case 'CLASSIC':speed = 12;break;
            case 'FIGHTER1':
            case 'FIGHTER2':speed = 10;break;
            case 'SURPRICE':speed = 12;break;
            default:speed = 0;
        }
        $('#headSample'+snakeID).removeClass('wall');
        $('#headSample'+snakeID).addClass(headSkin);
        $('#bodySample'+snakeID).removeClass('wall');
        $('#bodySample'+snakeID).addClass(bodySkin);
        $('#tailSample'+snakeID).removeClass('wall');
        $('#tailSample'+snakeID).addClass(bodySkin);
        
        $('#controlUP'+snakeID).css('color', 'gray');
        $('#controlLEFT'+snakeID).css('color', 'gray');
        $('#controlRIGHT'+snakeID).css('color', 'gray');
        $('#controlDOWN'+snakeID).css('color', 'gray');
        rgb = 256;
        bornAnimateID[snakeID-1] = setTimeout(snake[snakeID-1].bornAnimate,20);
        lifeState = 'NORMAL';
        length = 1;
        remainLength = 9;//10-1=9
        if(headSkin == 'black' || headSkin == 'white')
            escapeAbility = 100;
        else
            escapeAbility = 20;
        escapeDelay = 0;
        delay = 0;
        fighter1_acc = 0;
        checkIn++;
        checkInList.push(snakeID);
        if(checkIn > 0)
        {
            for(var a = 0; a < 10; a++)
            {
                $('#'+(a+257)).html(pauseStr[a]);
            }
        }
        isStop = false;
    };
    this.popBuffer = function(){
        if(moveQueue.length == 0)
            return;
        if(!noCheckIn)
        {            
            if(gameMode == "SURPRICE")
                portalState = 'PORTAL_CLOSE';
        }
        var temp = moveQueue.shift();
        if(temp == UP){
            if(movex != 0)
                return;
            movex = -1;
            movey = 0;
        }
        else if(temp == LEFT){
            if(movey != 0)
                return;
            movex = 0;
            movey = -1;
        }
        else if(temp == RIGHT){
            if(movey != 0)
                return;
            movex = 0;
            movey = 1;
        }
        else if(temp == DOWN){
            if(movex != 0)
                return;
            movex = 1;
            movey = 0;
        }
    };
    this.pushBuffer = function(input){
        if(lifeState == 'WAITING')
        {
            this.preBorn(input);
            return;
        }
        if(input == moveQueue[moveQueue.length - 1] || (pause && !noCheckIn))
            return;
        switch(input)
        {
            case UP://up w 87 38
            case LEFT://left a 65 37
            case RIGHT://right d 68 39
            case DOWN://down s 83 40
                moveQueue.push(input);
            break;
            default:
            break;
        }
    };
    this.move = function(){
        if(delay < speed)
        {
            delay++;
            fighter1_acc++;
            return;
        }
        delay = 0;
        if(lifeState == 'WAITING')
            return;
        if(lifeState != 'DIEING_AND_COOLING' && lifeState != 'COOLING')
        {
            this.popBuffer();
            if(movex + movey == 0)
                return;
        }
        //head move away
        switch(lifeState)
        {
            case 'NORMAL':
                if(isStop)
                    return;
                nextBlock = map[(headx + MAPX + movex) % MAPX][(heady + MAPY + movey) % MAPY];
                if(nextBlock.isPortal() || nextBlock.isStar() || !nextBlock.isOccupied())
                {
                    escapeDelay = 0;
                }
                else if(nextBlock.isOccupied())
                {
                    escapeDelay += speed;
                    if(escapeDelay < escapeAbility)
                    {
                        return;
                    }
                }
                map[headx][heady].setValue(movex,movey);
                $('#'+cellID(headx, heady)).removeClass(headSkin);
                $('#'+cellID(headx, heady)).addClass(bodySkin);
                headx = (headx + MAPX + movex) % MAPX;
                heady = (heady + MAPY + movey) % MAPY;
                this.cutTail();
                while(map[headx][heady].isPortal())
                {
                    var temp = map[headx][heady].getMirror();
                    headx = (temp.getx() + movex + MAPX) % MAPX;
                    heady = (temp.gety() + movey + MAPY) % MAPY;
                    inPortal++;
                }
                
                if(map[headx][heady].isStar())//eat star
                {
                    if(map[headx][heady].isHead() > 0 && map[headx][heady].isHead() != snakeID)
                    {
                        snake[map[headx][heady].isHead() - 1].bye();
                    }
                    else
                    {
                        $('#'+cellID(headx, heady)).removeClass('star');
                        $('#'+cellID(headx, heady)).addClass(headSkin);
                        starAmount--;
                    }
                    length++;
                    if(starAmount <= 0)
                        putStar(randCoord());
                    speedUp++;
                    if(speedUp == 7)
                    {
                        speedUp = 0;
                        speed--;
                        $('#speed'+snakeID).html(13-speed);
                    }
                }
                else if(map[headx][heady].isOccupied())//smash other snake or wall
                {
                    lifeState = 'DIEING';
                    remainLength = length;
                    checkIn--;
                    loses++;
                    if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')
                        $('#tailSample'+snakeID).html(loses);
                    if(checkIn <= 1)
                    {
                        roundEnd();
                        for(var a = 0; a < 10; a++)
                        {
                            $('#'+(a+257)).html(pauseStr[a]);
                        }
                    }
                    $('#length'+snakeID).css('color', 'gray');
                    $('#speed'+snakeID).css('color', 'gray');
                }
                else if(remainLength <= 0)
                {//death to die : 625
                    length++;
                    if(gameMode == 'FIGHTER2')
                        ;
                    else if(gameMode == 'FIGHTER1' && fighter1_acc >= 700)//7sec
                        fighter1_acc = 0;
                    else
                    {
                        this.moveTail();
                    }
                }
                else//normal
                {
                    length++;
                    remainLength--;
                }
                if(lifeState == 'NORMAL')
                {
                    $('#'+cellID(headx,heady)).removeClass('ground');
                    $('#'+cellID(headx,heady)).addClass(headSkin);
                    map[headx][heady].setBackValue(-movex,-movey);
                    map[headx][heady].setHead(snakeID);
                }
                else
                {
                    if(gameMode == 'FIGHTER1' || gameMode == 'FIGHTER2')
                    {
                        lifeState = 'DIEING';
                    }
                    remainLength = length;
                    headx = (headx + MAPX - movex) % MAPX;
                    heady = (heady + MAPY - movey) % MAPY;
                    while(map[headx][heady].isPortal())
                    {
                        var temp = map[headx][heady].getMirror();
                        headx = (temp.getx() - movex + MAPX) % MAPX;
                        heady = (temp.gety() - movey + MAPY) % MAPY;
                    }
                }
                $('#length'+snakeID).html(length);
                break;
            case 'DIEING_AND_COOLING':
            case 'DIEING':
                $('#'+cellID(headx,heady)).removeClass(bodySkin);
                if(lifeState == 'DIEING_AND_COOLING')
                    $('#'+cellID(headx,heady)).addClass('ground');
                else
                    $('#'+cellID(headx,heady)).addClass('wall');
                var tempx = map[headx][heady].getbackx();
                var tempy = map[headx][heady].getbacky();
                if(lifeState == 'DIEING_AND_COOLING')
                    map[headx][heady].clear();
                headx = (headx + MAPX + tempx) % MAPX;
                heady = (heady + MAPY + tempy) % MAPY;
                while(map[headx][heady].isPortal())
                {
                    var temp = map[headx][heady].getMirror();
                    headx = (temp.getx() + tempx + MAPX) % MAPX;
                    heady = (temp.gety() + tempy + MAPY) % MAPY;
                }
                remainLength--;
                this.cutTail();
                if(remainLength <= 0 && cutQueuex.length <= 0)
                {
                    if(lifeState == 'DIEING')
                        lifeState = 'DEAD';
                }
                break;
            case 'COOLING':
                cool += speed;
                if(cool >= 300)
                {
                    this.reset();
                }
            break;
        }
    };
    this.moveTail = function(){
        $('#'+cellID(tailx,taily)).removeClass(bodySkin);
        $('#'+cellID(tailx,taily)).addClass('ground');
        length--;
        var tempx = map[tailx][taily].getx();
        var tempy = map[tailx][taily].gety();
        map[tailx][taily].clear();
        //tailx += tempx;
        //taily += tempy;
        tailx = (tailx + MAPX + tempx) % MAPX;
        taily = (taily + MAPY + tempy) % MAPY;
        while(map[tailx][taily].isPortal())
        {
            var temp = map[tailx][taily].getMirror();
            tailx = (temp.getx() + tempx + MAPX) % MAPX;
            taily = (temp.gety() + tempy + MAPY) % MAPY;
            inPortal--;
        }
    };
    this.cutTail = function(){
        if(cutQueuex.length <= 0)
            return;
        var tempx = cutQueuex.shift();
        var tempy = cutQueuey.shift();
        $('#'+cellID(tempx,tempy)).removeClass(bodySkin);
        $('#'+cellID(tempx,tempy)).addClass('wall');
    };
    this.bornAnimate = function(){ //amazing!
        $('#controlUP'+snakeID).css('color', 'rgb('+rgb+','+rgb+','+rgb+')');
        $('#controlLEFT'+snakeID).css('color', 'rgb('+rgb+','+rgb+','+rgb+')');
        $('#controlRIGHT'+snakeID).css('color', 'rgb('+rgb+','+rgb+','+rgb+')');
        $('#controlDOWN'+snakeID).css('color', 'rgb('+rgb+','+rgb+','+rgb+')');
        rgb--;
        if(rgb >= 128)
            bornAnimateID[snakeID-1] = setTimeout(snake[snakeID-1].bornAnimate,2);
    };
    this.highlight = function(input){
        if(lifeState == 'DIEING_AND_COOLING' || lifeState == 'COOLING')
            return;
        if(input == UP)
        {
            $('#controlUP'+snakeID).css('color', 'white');
            return;
        }
        if(input == LEFT)
        {
            $('#controlLEFT'+snakeID).css('color', 'white');
            return;
        }
        if(input == RIGHT)
        {
            $('#controlRIGHT'+snakeID).css('color', 'white');
            return;
        }
        if(input == DOWN)
        {
            $('#controlDOWN'+snakeID).css('color', 'white');
            return;
        }
    };
    this.unLight = function(input){
        if(lifeState == 'DIEING_AND_COOLING' || lifeState == 'COOLING')
            return;
        if(input == UP)
        {
            $('#controlUP'+snakeID).css('color', 'gray');
            return;
        }
        if(input == LEFT)
        {
            $('#controlLEFT'+snakeID).css('color', 'gray');
            return;
        }
        if(input == RIGHT)
        {
            $('#controlRIGHT'+snakeID).css('color', 'gray');
            return;
        }
        if(input == DOWN)
        {
            $('#controlDOWN'+snakeID).css('color', 'gray');
            return;
        }
    };
}
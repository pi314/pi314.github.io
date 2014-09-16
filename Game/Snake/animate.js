function animateMainMenuWidth()
{
    if(mainMenuRGB > 20)
        mainMenuRGB--;
    $('#mainMenu').css({
        width:mainMenuWidth,
        background:'rgb('+mainMenuRGB+','+mainMenuRGB+','+mainMenuRGB+')'
    });
    if(mainMenuWidth < 100)
        mainMenuWidth += 10;
    else if(mainMenuWidth < 200)
        mainMenuWidth += 5;
    else if(mainMenuWidth < 320)
        mainMenuWidth += 3;
    else
        mainMenuWidth += 1;
    if(mainMenuWidth < 350)
        mainMenuAnimateID = setTimeout(animateMainMenuWidth,1);
    else
    {
        $('#mainMenu').css({width:350});
        mainMenuAnimateID = setTimeout(animateMainMenuHeight,1);
    }
}
function animateMainMenuHeight()
{
    if(mainMenuRGB > 20)
        mainMenuRGB--;
    $('#mainMenu').css({
        height:mainMenuHeight,
        background:'rgb('+mainMenuRGB+','+mainMenuRGB+','+mainMenuRGB+')'
    });
    if(mainMenuHeight < 100)
        mainMenuHeight += 10;
    else if(mainMenuHeight < 250)
        mainMenuHeight += 5;
    else if(mainMenuHeight < 350)
        mainMenuHeight += 3;
    else
        mainMenuHeight += 1;
    if(mainMenuHeight < 400)
        mainMenuAnimateID = setTimeout(animateMainMenuHeight,1);
    else
    {
        mainMenu.html('<div id="logoHead"></div>');
        mainMenuLogoHead = $('#logoHead');
        mainMenuLogoHeadTop = 98;//73
        mainMenuLogoHeadLeft = 98;
        mainMenuLogoHeadSize = 0;//50
        mainMenuLogoHead.css({
            position : 'absolute',
            top : mainMenuLogoHeadTop,
            left : mainMenuLogoHeadLeft,
            width : mainMenuLogoHeadSize,
            height : mainMenuLogoHeadSize,
            'border-radius' : 3,
            background : 'rgb(0,255,0)'
        });
        mainMenuAnimateID = setTimeout(animateMainMenu_LogoShowHead,300);
    }
}
function animateMainMenu_LogoShowHead()
{
    if(mainMenuLogoHeadTop > 73)
    {
        mainMenuLogoHeadTop--;
        mainMenuLogoHeadLeft--;
        mainMenuLogoHeadSize += 2;
        mainMenuLogoHead.css({
            top : mainMenuLogoHeadTop,
            left : mainMenuLogoHeadLeft,
            width : mainMenuLogoHeadSize,
            height : mainMenuLogoHeadSize
        });
        mainMenuAnimateID = setTimeout(animateMainMenu_LogoShowHead,1);
    }
    else
    {
        mainMenu.append('<div id="logoBody"></div>');
        mainMenuLogoBody = $('#logoBody');
        mainMenuLogoBodyTop = 98;//73
        mainMenuLogoBodyLeft = 98;
        mainMenuLogoBodySize = 0;//50
        mainMenuLogoBody.css({
            position : 'absolute',
            top : mainMenuLogoBodyTop,
            left : mainMenuLogoBodyLeft,
            width : mainMenuLogoBodySize,
            height : mainMenuLogoBodySize,
            'border-radius' : 3,
            background : 'rgb(0,128,0)'
        });
        mainMenuAnimateID = setTimeout(animateMainMenu_LogoHeadLeft,300);
    }
}
function animateMainMenu_LogoHeadLeft()
{
    clearTimeout(mainMenuAnimateID);
    if(mainMenuLogoHeadLeft > 20)
    {
        mainMenuLogoHeadLeft--;
        mainMenuLogoHead.css({left : mainMenuLogoHeadLeft});
        if(mainMenuLogoBodyTop > 73 && mainMenuLogoHeadLeft < 45)
        {
            mainMenuLogoBodyTop--;//73
            mainMenuLogoBodyLeft--;
            mainMenuLogoBodySize+=2;
            mainMenuLogoBody.css({
                top : mainMenuLogoBodyTop,
                left : mainMenuLogoBodyLeft,
                width : mainMenuLogoBodySize,
                height : mainMenuLogoBodySize,
            });
        }
        mainMenuAnimateID = setTimeout(animateMainMenu_LogoHeadLeft,1);
    }
    else
    {
        mainMenu.append('<div id="logoTail"></div>');
        mainMenuLogoTail = $('#logoTail');
        mainMenuLogoTailTop = 98;//73
        mainMenuLogoTailLeft = 45;
        mainMenuLogoTailSize = 0;//50
        
        mainMenuLogoTail.css({
            position : 'absolute',
            top : mainMenuLogoTailTop,
            left : mainMenuLogoTailLeft,
            width : mainMenuLogoTailSize,
            height : mainMenuLogoTailSize,
            'border-radius' : 3,
            background : 'rgb(0,128,0)'
        });
        mainMenuAnimateID = setTimeout(animateMainMenu_LogoHeadUp,300);
    }
}
function animateMainMenu_LogoHeadUp()
{
    clearTimeout(mainMenuAnimateID);
    if(mainMenuLogoHeadTop > 20)
    {
        mainMenuLogoHeadTop--;
        mainMenuLogoHead.css({top : mainMenuLogoHeadTop});
        if(mainMenuLogoTailTop > 73 && mainMenuLogoHeadTop < 45)
        {
            mainMenuLogoTailTop--;//73
            mainMenuLogoTailLeft--;
            mainMenuLogoTailSize+=2;
            mainMenuLogoTail.css({
                top : mainMenuLogoTailTop,
                left : mainMenuLogoTailLeft,
                width : mainMenuLogoTailSize,
                height : mainMenuLogoTailSize,
            });
        }
        mainMenuAnimateID = setTimeout(animateMainMenu_LogoHeadUp,1);
    }
    else
    {
        mainMenu.append('<div id="englishName"></div>');
        englishName = ['S','n','a','k','e',' ','V'];
        nameLength = 0;
        mainMenuAnimateID = setTimeout(animateMainMenu_ShowName,300);
    }
}
function animateMainMenu_ShowName()
{
    clearTimeout(mainMenuAnimateID);
    mainMenuLogoName = $('#englishName');
    mainMenuLogoName.append(englishName[nameLength]);
    nameLength++;
    if(nameLength < 6)
        mainMenuAnimateID = setTimeout(animateMainMenu_ShowName,100);
    else if(nameLength == 6)
        mainMenuAnimateID = setTimeout(animateMainMenu_ShowName,200);
    else
    {   //show option
        mainMenu.append('<div id="chineseName">π蛇5.0</div>');
        mainMenu.append('<div id="authorName">by pi314</div>');
        mainMenu.append('<div id="option1" class="option"></div><div id="option2" class="option"></div>');
        $('#option1').css({
            top : 160,
            left : 95
        });
        $('#option2').css({
            top : 265,
            left : 95
        });
        
        mainMenuRGB = 255;
        mainMenuAnimateID = setTimeout(animateMainMenu_Shine,1);
    }
}
function animateMainMenu_Shine()
{
    clearTimeout(mainMenuAnimateID);
    if(mainMenuRGB > 35)
    {
        mainMenu.css({
            background : 'rgb('+mainMenuRGB+','+mainMenuRGB+','+mainMenuRGB+')'
        });
        if(mainMenuRGB >= 60)
        {
            if(mainMenuRGB == 60)
            {
                $('#option1').html('開始遊戲').click(
                    function(){
                        leaveMainMenuPortal('MAINMENU', 'CHOOSE');
                });
                
                $('#option2').html('說明').click(
                    function(){
                        leaveMainMenuPortal('MAINMENU', 'HELPPAGE');
                });
            }
            $('#option1').css({
                background : 'rgb('+mainMenuRGB+','+mainMenuRGB+','+mainMenuRGB+')'
            });
            $('#option2').css({
                background : 'rgb('+mainMenuRGB+','+mainMenuRGB+','+mainMenuRGB+')'
            });
        }
        mainMenuRGB--;
        mainMenuAnimateID = setTimeout(animateMainMenu_Shine,1);
    }
    else
    {
        $('#option1').remove();
        $('#option2').remove();
        mainMenu.append('<div id="option1" class="option"></div><div id="option2" class="option"></div>');
        $('#option1').css({
            top : 160,
            left : 95
        }).html('開始遊戲').click(
            function(){
                leaveMainMenuPortal('MAINMENU', 'CHOOSE');
        });
        $('#option2').css({
            top : 265,
            left : 95
        }).html('說明').click(
            function(){
                leaveMainMenuPortal('MAINMENU', 'HELPPAGE');
        });
    }
}
function enterMainMenu(from)
{
    clearTimeout(mainMenuAnimateID);
    logoDelta++;
    logoWidth += 2;
    textColor += 8;
    if(from == 'HELPPAGE' || from == 'GAME')
    {
        $('#logoHead').css({
            top : (45-logoDelta),
            left : (45-logoDelta),
            width : logoWidth,
            height : logoWidth
        });
        $('#logoBody').css({
            top : (98-logoDelta),
            left : (45-logoDelta),
            width : logoWidth,
            height : logoWidth
        });
        $('#logoTail').css({
            top : (98-logoDelta),
            left : (98-logoDelta),
            width : logoWidth,
            height : logoWidth
        });
        $('#englishName').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
        $('#chineseName').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    }
    optionWidth += 6;
    optionHeight += 2;
    optionTopDelta += 1;
    optionLeftDelta += 3;
    $('#option1').css({
        top : (185-optionTopDelta),
        left : (170-optionLeftDelta),
        width : optionWidth,
        height : optionHeight
    });
    $('#option2').css({
        top : (290-optionTopDelta),
        left : (170-optionLeftDelta),
        width : optionWidth,
        height : optionHeight
    });
    if(logoDelta < 25)
        mainMenuAnimateID = setTimeout(function(){enterMainMenu(from)},1);
    else
    {
        $('#option1').css('height', '70px').html('選擇模式').click(
            function(){
                leaveMainMenuPortal('MAINMENU', 'CHOOSE');
        });;
        
        $('#option2').css('height', '70px').html('說明').click(
            function(){
                leaveMainMenuPortal('MAINMENU', 'HELPPAGE');
        });
        $('#englishName').css({color : 'white'});
        $('#chineseName').css({color : 'white'});
    }
}
function leaveMainMenu(destination)
{
    clearTimeout(mainMenuAnimateID);
    logoDelta++;
    if(destination == 'HELPPAGE' || destination == 'GAME')
    {
        logoWidth -= 2;
        textColor -= 8;
        $('#logoHead').css({
            top : (20+logoDelta),
            left : (20+logoDelta),
            width : logoWidth,
            height : logoWidth
        });
        $('#logoBody').css({
            top : (73+logoDelta),
            left : (20+logoDelta),
            width : logoWidth,
            height : logoWidth
        });
        $('#logoTail').css({
            top : (73+logoDelta),
            left : (73+logoDelta),
            width : logoWidth,
            height : logoWidth
        });
        $('#englishName').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
        $('#chineseName').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    }
    optionWidth -= 6;
    optionHeight -= 2;
    optionTopDelta += 1;
    optionLeftDelta += 3;    
    $('#option1').css({
        top : (160+optionTopDelta),
        left : (95+optionLeftDelta),
        width : optionWidth,
        height : optionHeight
    });
    $('#option2').css({
        top : (265+optionTopDelta),
        left : (95+optionLeftDelta),
        width : optionWidth,
        height : optionHeight
    });
    if(logoDelta < 25)
        mainMenuAnimateID = setTimeout(function(){leaveMainMenu(destination)},1);
    else
    {
        if(destination == 'CHOOSE')
        {
            $('#option1').remove();
            $('#option2').remove();
            enterChooseModePortal();
        }
        else if(destination == 'HELPPAGE')
        {
            helpPagePortal();
        }
        else if(destination == 'GAME')
        {
            reset();
        }
    }
}
function enterHelpPage()
{
    clearTimeout(mainMenuAnimateID);
    helpPageNumberDelta++;
    $('#backToMainButtonLight').css('top', (10-helpPageNumberDelta)+'px');
    $('#backToMainButtonLight').css('left', (65-helpPageNumberDelta)+'px');
    $('#backToMainButtonLight').css('width', helpPageNumberDelta*2);
    $('#backToMainButtonLight').css('height', helpPageNumberDelta*2);
    //animate
    if(helpPageNumberDelta < 10)
        mainMenuAnimateID = setTimeout(enterHelpPage,1);
    else
    {
        currentHelpPage = 0;
        helpPageAnimateID = setTimeout(showHelpPage,1);
    }
}
function showHelpPage()
{
    $('#helpPageNumber').html((currentHelpPage+1)+' / '+pages);
    if(currentHelpPage == 0 || currentHelpPage == 1 || currentHelpPage == 2 || currentHelpPage == 4)
    {
        $('#helpPageText').css('top', '160px');
        $('#helpPageText').css('height', '200px');
        $('#helpPagePic').html('<div id="snakeInfo" class="snakeInfo"></div>');
        $('#helpPagePic').css('color', 'rgb(30,30,30)');
        $('#snakeInfo').css('left','0px');
        var infoWindow = $('#snakeInfo');
        
        //put head sample and body sample
        //head sample
        infoWindow.append('<div id="headSample" class="greenHead"></div>');
        temp = $('#headSample');
        temp.css('top', '20px');
        temp.css('left', '64px');
        
        //body sample
        infoWindow.append('<div id="bodySample" class="greenBody"></div>');
        temp = $('#bodySample');
        temp.css('top', '20px');
        temp.css('left', '42px');
        
        //tail(body) sample
        infoWindow.append('<div id="tailSample" class="greenBody"></div>');
        temp = $('#tailSample');
        temp.css('top', '20px');
        temp.css('left', '20px');
        
        //snake length
        infoWindow.append('<div id="length" class="snakeLength"></div>');
        temp = $('#length');
        temp.html(0);
        temp.css('color','gray');
        
        //snake speed
        infoWindow.append('<div id="speed" class="snakeSpeed"></div>')
        temp = $('#speed');
        temp.html(0);
        temp.css('color','gray');
        
        //control up
        infoWindow.append('<span id="controlUP" class="snakeInfo_control"></span>');
        temp = $('#controlUP');
        temp.css('top', '40px');
        temp.css('left', '46px');
        temp.html('w');
        temp.css('color','gray');
        
        //control left
        infoWindow.append('<span id="controlLEFT" class="snakeInfo_control"></span>');
        temp = $('#controlLEFT');
        temp.css('top', '65px');
        temp.css('left', '20px');
        temp.html('a');
        temp.css('color','gray');
        
        //control right
        infoWindow.append('<span id="controlRIGHT" class="snakeInfo_control"></span>');
        temp = $('#controlRIGHT');
        temp.css('top', '65px');
        temp.css('left', '71px');
        temp.html('d');
        temp.css('color','gray');
        
        //control down
        infoWindow.append('<span id="controlDOWN" class="snakeInfo_control"></span>');
        temp = $('#controlDOWN');
        temp.css('top', '65px');
        temp.css('left', '46px');
        temp.html('s');
        temp.css('color','gray');
        
        judgeDirKeys = 1;
        $('#wrapper').keydown(helpKeyHighlight).keyup(function(){
            switch(event.keyCode)
            {
                case 87:
                    $('#controlUP').css('color', 'gray');
                break;
                case 65:
                    $('#controlLEFT').css('color', 'gray');
                break;
                case 68:
                    $('#controlRIGHT').css('color', 'gray');
                break;
                case 83:
                    $('#controlDOWN').css('color', 'gray');
                break;
            }
        });
        if(currentHelpPage == 4)
        {
            $('#headSample').html(0);
            $('#tailSample').html(0);
        }
    }
    else if(currentHelpPage == 3)
    {
        $('#helpPagePic').html('');
        $('#helpPagePic').css('color', 'rgb(20,20,20)');
        for(var a = 0; a < 35; a++)
        {
            $('#helpPagePic').append('<div id="'+a+'" class="ground"></div>');
            $('#'+a).css('top', (1+(parseInt(a/7))*22)+'px');
            $('#'+a).css('left', (a%7)*22+'px');
        }
        $('#1').removeClass('ground');
        $('#1').addClass('greenBody');
        $('#8').removeClass('ground');
        $('#8').addClass('greenBody');
        $('#15').removeClass('ground');
        $('#15').addClass('greenBody');
        $('#16').removeClass('ground');
        $('#16').addClass('greenBody');
        $('#17').removeClass('ground');
        $('#17').addClass('greenHead');
        $('#19').removeClass('ground');
        $('#19').addClass('star');
    }
    else
    {
        $('#helpPagePic').fadeOut(100);
    }
    switch(currentHelpPage)
    {
    case 0:
        $('#helpPageText').fadeOut(100,function(){
            $('#helpPageText').html('這是一個蛇蛇資訊框，<br/>顯示這條蛇的資訊。<br/><br/>蛇的右邊是它的長度，<br/>若為亮白色表示蛇在場上。<br/><br/>右下方的數字代表它的速度，<br/>範圍是 1 ~ 13。');
        }).fadeIn(100);
    break;
    case 1:
        $('#helpPageText').fadeOut(100,function(){
            $('#helpPageText').html('加入遊戲的方式是，把那條蛇的上下左右鍵都按一次。<br/><br/>每按下一個方向鍵，<br/>對應的鍵就會亮起。<br/><br/>這能讓你熟悉那條蛇的控制鍵，<br/>並確定控制鍵沒有問題。');
        }).fadeIn(100);
    break;
    case 2:
        $('#helpPageText').fadeOut(100,function(){
            $('#helpPageText').html('要注意的是，為了遊戲平衡，<br/>只要按了空白鍵開始遊戲，<br/>就不能再有蛇加入遊戲。');
        }).fadeIn(100);
    break;
    case 3:
        $('#helpPageText').fadeOut(100,function(){
            $('#helpPageText').html('<br/>粉紅色有圓角的方塊不是蛇，是讓蛇吃的方塊。<br/><br/>每吃 1 個，蛇蛇就會長大一節。<br/><br/>每吃 7 個，蛇蛇就會跑得更快。');
        }).fadeIn(100);
    break;
    case 4:
        $('#helpPageText').fadeOut(100,function(){
            $('#helpPageText').html('在競技場中，<br/>資訊框會多出兩個數字<br/>一個在頭，代表獲勝的場數<br/>一個在尾，代表失敗的場數。');
        }).fadeIn(100);
    break;
    default:
        $('#helpPageText').fadeOut(100,function(){
            $('#helpPageText').html('');
        }).fadeIn(100);
    break;
    }
}
function helpKeyHighlight()
{
    switch(event.keyCode)
    {
        case 87:
            if(judgeDirKeys % 2 == 0)
                return;
            judgeDirKeys *= 2;
            $('#controlUP').css('color', 'white');
        break;
        case 65:
            if(judgeDirKeys % 3 == 0)
                return;
            judgeDirKeys *= 3;
            $('#controlLEFT').css('color', 'white');
        break;
        case 68:
            if(judgeDirKeys % 5 == 0)
                return;
            judgeDirKeys *= 5;
            $('#controlRIGHT').css('color', 'white');
        break;
        case 83:
            if(judgeDirKeys % 7 == 0)
                return;
            judgeDirKeys *= 7;
            $('#controlDOWN').css('color', 'white');
        break;
    }
    if(judgeDirKeys == 210)
    {
        helpBornAnimateRGB = 255;
        judgeDirAnimateID = setTimeout(helpBornAnimate,2);
    }
}
function helpBornAnimate()
{
    $('#controlUP').css('color', 'rgb('+helpBornAnimateRGB+','+helpBornAnimateRGB+','+helpBornAnimateRGB+')');
    $('#controlLEFT').css('color', 'rgb('+helpBornAnimateRGB+','+helpBornAnimateRGB+','+helpBornAnimateRGB+')');
    $('#controlRIGHT').css('color', 'rgb('+helpBornAnimateRGB+','+helpBornAnimateRGB+','+helpBornAnimateRGB+')');
    $('#controlDOWN').css('color', 'rgb('+helpBornAnimateRGB+','+helpBornAnimateRGB+','+helpBornAnimateRGB+')');
    clearTimeout(judgeDirAnimateID);
    helpBornAnimateRGB--;
    if(helpBornAnimateRGB >= 128)
        judgeDirAnimateID = setTimeout(helpBornAnimate,2);
    else
        judgeDirKeys = 1;
}
function putField(a)
{
    for(var b = 0; b < MAPY; b++)
    {
        $('#field').append('<div id="'+cellID(a,b)+'"class="ground"></div>');
        $('#'+cellID(a,b)).css('top', (22*a) + 'px');
        $('#'+cellID(a,b)).css('left', (22*b) + 'px');
    }
    a++;
    if(a < MAPX)
        putFieldAnimateID = setTimeout(function(){putField(a)},5);
    else
    {
        putStar(randCoord());
    }
}
function fastPutField()
{
    var str = '';
    for(var a = 0; a < MAPX; a++){
        for(var b = 0; b < MAPY; b++){
            str += '<div id="'+cellID(a,b)+'"class="ground"></div>';
        }
    }
    $('#field').append(str);
    for(var a = 0; a < MAPX; a++){
        for(var b = 0; b < MAPY; b++){
            $('#'+cellID(a,b)).css('top', (22*a) + 'px');
            $('#'+cellID(a,b)).css('left', (22*b) + 'px');
        }
    }
    putStar(randCoord());
}
function enterChooseMode()
{
    optionWidth += 4;
    optionHeight += 2;
    optionTopDelta += 1;
    optionLeftDelta += 2;
    $('#backToMain2').css('top', (325-optionTopDelta)+'px');
    $('#backToMain2').css('left', (100-optionLeftDelta)+'px');
    $('#backToMain2').css('width', optionWidth+'px');
    $('#backToMain2').css('height', optionHeight+'px');
    $('#enterGame').css('top', (325-optionTopDelta)+'px');
    $('#enterGame').css('left', (225-optionLeftDelta)+'px');
    $('#enterGame').css('width', optionWidth+'px');
    $('#enterGame').css('height', optionHeight+'px');
    flipBackground += 3;
    flipColor += 6;
    $('#chooseFlipLeft').css('background', 'rgb('+flipBackground+','+flipBackground+','+flipBackground+')');
    $('#chooseFlipRight').css('background', 'rgb('+flipBackground+','+flipBackground+','+flipBackground+')');
    $('#chooseFlipLeft').css('color', 'rgb('+flipColor+','+flipColor+','+flipColor+')');
    $('#chooseFlipRight').css('color', 'rgb('+flipColor+','+flipColor+','+flipColor+')');
    
    textColor += 8;
    $('#chooseMode').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    $('#modeStatement1').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    
    if(optionHeight < 50)
        mainMenuAnimateID = setTimeout(enterChooseMode,1);
    else
    {
        $('#chooseFlipLeft').remove();
        $('#chooseFlipRight').remove();
        $('#mainMenu').append('<div id="chooseFlipRight" class="helpFlip">></div><div id="chooseFlipLeft" class="helpFlip"><</div>');
        $('#chooseFlipLeft').click(flipLeft);
        $('#chooseFlipRight').click(flipRight);
        
        $('#backToMain2').css('width', '120px');
        $('#backToMain2').css('left', '40px');
        $('#enterGame').css('width', '120px');
        $('#enterGame').css('left', '40px');
        $('#chooseMode').css('color', 'white');
        $('#modeStatement1').css('color', 'white');
        $('#backToMain2').html('回主選單');
        
        $('#backToMain2').click(function(){
            leaveChooseModePortal('MAINMENU');
        });
        $('#enterGame').html('開始遊戲');
        $('#enterGame').css('left', '190px').click(function(){
            leaveChooseModePortal('GAME');
        });
    }
}
function leaveChooseMode(destination)
{
    logoDelta++;
    textColor -= 8;
    if(destination == 'GAME')
    {
        logoWidth -= 2;
        $('#logoHead').css('top',(20+logoDelta)+'px');
        $('#logoHead').css('left',(20+logoDelta)+'px');
        $('#logoHead').css('width',logoWidth+'px');
        $('#logoHead').css('height',logoWidth+'px');
        $('#logoBody').css('top',(73+logoDelta)+'px');
        $('#logoBody').css('left',(20+logoDelta)+'px');
        $('#logoBody').css('width',logoWidth+'px');
        $('#logoBody').css('height',logoWidth+'px');
        $('#logoTail').css('top',(73+logoDelta)+'px');
        $('#logoTail').css('left',(73+logoDelta)+'px');
        $('#logoTail').css('width',logoWidth+'px');
        $('#logoTail').css('height',logoWidth+'px');
        $('#englishName').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
        $('#chineseName').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
        $('#authorName').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    }
    $('#chooseMode').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    $('#modeStatement1').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    optionWidth -= 4;
    optionHeight -= 2;
    optionTopDelta += 1;
    optionLeftDelta += 2;
    $('#backToMain2').css('top', (300+optionTopDelta)+'px');
    $('#backToMain2').css('left', (40+optionLeftDelta)+'px');
    $('#backToMain2').css('width', optionWidth+'px');
    $('#backToMain2').css('height', optionHeight+'px');
    $('#enterGame').css('top', (300+optionTopDelta)+'px');
    $('#enterGame').css('left', (190+optionLeftDelta)+'px');
    $('#enterGame').css('width', optionWidth+'px');
    $('#enterGame').css('height', optionHeight+'px');
    flipBackground -= 3;
    flipColor -= 6;
    $('#chooseFlipLeft').css('background', 'rgb('+flipBackground+','+flipBackground+','+flipBackground+')');
    $('#chooseFlipRight').css('background', 'rgb('+flipBackground+','+flipBackground+','+flipBackground+')');
    $('#chooseFlipLeft').css('color', 'rgb('+flipColor+','+flipColor+','+flipColor+')');
    $('#chooseFlipRight').css('color', 'rgb('+flipColor+','+flipColor+','+flipColor+')');
    
    if(logoDelta < 25)
        mainMenuAnimateID = setTimeout(function(){leaveChooseMode(destination)},1);
    else
    {
        $('#chooseMode').remove();
        $('#modeStatement1').remove();
        $('#chooseFlipLeft').remove();
        $('#chooseFlipRight').remove();
        $('#backToMain2').remove();
        $('#enterGame').remove();
        if(destination == 'GAME')
        {
            reset();
        }
        else if(destination == 'MAINMENU')
        {
            enterMainMenuPortal('CHOOSE');
        }
    }
}
function flipLeft()
{
    gameModeNum = (gameModeNum-1+gameModeName.length) % gameModeName.length;
    showMode(gameModeNum);
}
function flipRight()
{
    gameModeNum = (gameModeNum+1) % gameModeName.length;
    showMode(gameModeNum);
}
function animatePortal()
{
    var wrapper = $('#wrapper');
    wrapper.html('<div id="mainMenu"></div>');
    mainMenuWidth = 0;
    mainMenuHeight = 20;
    mainMenuRGB = 255;
    $('#mainMenu').css({
        width:0,
        height:20,
        background:'rgb('+mainMenuRGB+','+mainMenuRGB+','+mainMenuRGB+')'
    });
    mainMenu = $('#mainMenu');
    mainMenuAnimateID = setTimeout(animateMainMenuWidth,1000);
}
function enterMainMenuPortal(from)
{
    logoDelta = 0;
    logoWidth = 0;
    textColor = 36;
    optionWidth = 0;
    optionHeight = 0;
    optionTopDelta = 0;
    optionLeftDelta = 0;
    if(from == 'GAME' || from == 'HELPPAGE')
    {
        $('#wrapper').html('<div id="mainMenu"></div>');
        mainMenu = $('#mainMenu');
        mainMenu.css('width', '350px');
        mainMenu.css('height', '400px');
        mainMenu.css('background', 'rgb(36,36,36)');
        
        //head
        mainMenu.append('<div id="logoHead"></div>');
        mainMenuLogoHead = $('#logoHead');
        mainMenuLogoHead.css('position','absolute');
        mainMenuLogoHead.css('border-radius','3px');
        mainMenuLogoHead.css('background','rgb(0,255,0)');
        
        //body
        mainMenu.append('<div id="logoBody"></div>');
        mainMenuLogoBody = $('#logoBody');
        mainMenuLogoBody.css('position','absolute');
        mainMenuLogoBody.css('border-radius','3px');
        mainMenuLogoBody.css('background','rgb(0,128,0)');
        
        //tail
        mainMenu.append('<div id="logoTail"></div>');
        mainMenuLogoTail = $('#logoTail');
        mainMenuLogoTail.css('position','absolute');
        mainMenuLogoTail.css('border-radius','3px');
        mainMenuLogoTail.css('background','rgb(0,128,0)');
        
        mainMenu.append('<div id="englishName">Snake V</div>');
        mainMenu.append('<div id="chineseName">π蛇5.0</div>');
        mainMenu.append('<div id="authorName">by pi314</div>');
    }
    mainMenu.append('<div id="option1" class="option"></div><div id="option2" class="option"></div>');
    gameState[0] = 'MAINMENU';
    mainMenuAnimateID = setTimeout(function(){enterMainMenu(from)},1);
}
function leaveMainMenuPortal(from, destination)
{
    logoDelta = 0;
    logoWidth = 50;
    textColor = 255;
    optionWidth = 150;
    optionHeight = 70;
    optionTopDelta = 0;
    optionLeftDelta = 0;
    $('#option1').html('');
    $('#option2').html('');
    mainMenuAnimateID = setTimeout(function(){leaveMainMenu(destination)},1);
}
function helpPagePortal()
{
    gameState[0] = 'HELPPAGE';
    helpPageNumberDelta = 0;
    $('#mainMenu').html('<div id="authorName">by pi314</div>');
    $('#mainMenu').append('<div id="helpPagePic"></div><div id="helpPageText"></div>');
    $('#mainMenu').append('<div id="backToMainButton"><div id="backToMainText">主選單</div><div id="backToMainButtonLight"></div></div>');
    $('#backToMainButtonLight').css('top', '0px');
    $('#backToMainButtonLight').css('left', (55+10)+'px');
    $('#backToMainButtonLight').css('background', 'rgb(150,0,0)');
    $('#backToMainButton').click(function(){
        enterMainMenuPortal('HELPPAGE');
    }).mouseenter(function(){
        $('#backToMainButtonLight').css('background', 'rgb(255,0,0)');
        $('#backToMainText').css('color', 'white');
    }).mouseleave(function(){
        $('#backToMainButtonLight').css('background', 'rgb(150,0,0)');
        $('#backToMainText').css('color', 'rgb(200,200,200)');
    });
    $('#mainMenu').append('<div id="helpFlipLeft" class="helpFlip"><</div><div id="helpFlipRight" class="helpFlip">></div>');
    pages = 5;
    currentHelpPage = 0;
    $('#helpFlipLeft').click(helpFlipLeft);
    $('#helpFlipRight').click(helpFlipRight);
    $('#mainMenu').append('<div id="helpPageNumber"></div>');
    mainMenuAnimateID = setTimeout(enterHelpPage,1);
}
function enterChooseModePortal()
{
    textColor = 36;
    optionWidth = 0;//120
    optionHeight = 0;//50
    optionTopDelta = 0;
    optionLeftDelta = 0;
    flipBackground = 36;//128
    flipColor = 36;//128
    
    gameState[0] = 'CHOOSE';
    gameModeNum = 0;
    var str = '';
    str += '<div id="chooseFlipLeft" class="helpFlip"><</div>';
    str += '<div id="chooseFlipRight" class="helpFlip">></div>';
    str += '<div id="chooseMode">經典模式</div>';
    str += '<div id="modeStatement1">'+statement[0]+'</div>';
    str += '<div id="backToMain2" class="modeOption"></div>';
    str += '<div id="enterGame" class="modeOption"></div>';
    $('#mainMenu').append(str);
    mainMenuAnimateID = setTimeout(enterChooseMode,1);
}
function leaveChooseModePortal(destination)
{
    logoDelta = 0;
    logoWidth = 50;
    textColor = 255;
    optionWidth = 120;
    optionHeight = 50;
    optionTopDelta = 0;
    optionLeftDelta = 0;
    flipBackground = 128;
    flipColor = 200;
    $('#backToMain2').html('');
    $('#enterGame').html('');
    mainMenuAnimateID = setTimeout(function(){leaveChooseMode(destination)},1);
}
function statementFade()
{
    textColor -= 10;
    $('#chooseMode').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    $('#modeStatement1').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    if(textColor > 36)
        mainMenuAnimateID = setTimeout(statementFade,1);
    else
    {
        $('#chooseMode').html(gameModeName[gameModeNum]);
        $('#modeStatement1').html(statement[gameModeNum]);
        mainMenuAnimateID = setTimeout(statementShow,1);
    }
}
function statementShow()
{
    textColor += 10;
    $('#chooseMode').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    $('#modeStatement1').css('color', 'rgb('+textColor+','+textColor+','+textColor+')');
    if(textColor < 255)
        mainMenuAnimateID = setTimeout(statementShow,1);
}
function helpFlipLeft(){
    if(currentHelpPage > 0)
    {
        currentHelpPage--;
        showHelpPage();
    }
}
function helpFlipRight(){
    if(currentHelpPage < pages-1)
    {
        currentHelpPage++;
        showHelpPage();
    }
}
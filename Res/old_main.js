(function () {
    var inrange = false;
    var totalWidth = 1000;
    var data = {};
    var sign = [
        '--\n'+
        '<cgd>※ Origin: 交大次世代(bs2.to)</cgd>\n'+
        '<cwd>◆ From: pi314@hualien</cwd>\n',
        '--\n'+
        '<cgd>※ Origin: 交大次世代(bs2.to)</cgd>\n'+
        '<cwd>◆ From: pi314@nctu</cwd>\n',
    ];
    var articleID = [];
    var amount = 0;
    var select = 0;
    var state = '';
    var light = false;
    var markedTitle = '';
    
    var init = function () {
        amount = data.length;
        select = data.length-1;
        state = 'list';
        light = false;
        markedTitle = '';
        for (var a = 0; a < amount; a++) {
            data[a]['readed'] = false;
        }
    };
    
    var adjustHead = function () {
        var boardAdminWidth = parseInt($('#boardAdmin').css('width'));
        var boardNameWidth = parseInt($('#boardName').css('width'));
        var boardComment = totalWidth - boardAdminWidth - boardNameWidth;
        $('#boardComment').css({'width':boardComment});
        
        var padding = 30;
        var articleAuthorItem = parseInt($('#articleAuthorItem').css('width'));
        var inStation = parseInt($('#inStation').css('width'));
        var P_pi314 = parseInt($('#P_pi314').css('width'));
        var articleAuthor = totalWidth - articleAuthorItem - inStation - P_pi314 - 2*padding;
        $('#articleAuthor').css({'width':articleAuthor});
        
        var articleTitleItem = parseInt($('#articleTitleItem').css('width'));
        var articleTitle = totalWidth - articleTitleItem - padding;
        $('#articleTitle').css({'width':articleTitle});
        
        var articleTimeItem = parseInt($('#articleTimeItem').css('width'));
        var articleTime = totalWidth - articleTimeItem - padding;
        $('#articleTime').css({'width':articleTime});
    };
    var list2html = function (index, base) {
        var str = '';
        str += '<div class="line">';
        if (base) {
            str += '<div class="seqNum cell baseSeq">重要</div>';
        }else{
            str += '<div class="seqNum cell">'+(index+1)+'</div>';
        }
        if (data[index].base) {
            str += '<div class="like likecell">B</div>';
        }else if (data[index].like){
            str += '<div class="like likecell">M</div>';
        }else{
            str += '<div class="likecell">+</div>';
        }
        if (data[index].push) {
            str += '<div class="pushNum cell">'+data[index].pushNum+'</div>';
        } else {
            str += '<div class="pushNum cell"></div>';
        }
        str += '<div class="date cell">'+data[index].date.slice(5)+'</div>';
        str += '<div class="author cell">pi314</div>';
        if (data[index].re) {
            str += '<div class="square cell">Re</div>';
        } else {
            str += '<div class="square cell">◇</div>';
        }
        str += '<div class="workName cell">'+data[index].title+'</div>';
        str += '</div>';
        return str;
    };
    var fillList = function () {
        var listStr = '';
        var baseStr = '';
        var baseArticle = [];
        for (var a = 0; a < data.length; a++) {
            var str = '';
            var bstr = '';
            str = list2html(a, false);
            if (data[a].base == true) {
                bstr = list2html(a, true);
                baseStr += bstr;
                amount++;
                baseArticle.push(a);
            }
            articleID.push(a);
            listStr += str;
        }
        articleID = articleID.concat(baseArticle);
        $('#list').append(listStr);
        $('#base').append(baseStr);
        $('#list .line').last().addClass('selLine');
        
        var dateColor = {
            'Sun':'rgb(255,0,0)',//red
            'Mon':'rgb(0,255,0)',//green
            'Tue':'rgb(255,255,0)',//yellow
            'Wed':'rgb(0,0,255)',//blue
            'Thr':'rgb(255,0,255)',//purple
            'Fri':'rgb(0,255,255)',//cyan
            'Sat':'rgb(255,255,255)'//white
            };
        $('.date').slice(1).map(function (index, elem) {
            var element = $(elem);
            element.css({'color':dateColor[data[articleID[index]].week]});
        });
    };
    var setReaded = function (value) {
        if (value){
            data[articleID[select]].readed = true;
            if (data[articleID[select]].base) {
                var readedList = articleID.find(articleID[select]);
                for (var a = 0; a < 2; a++)
                    $($('.likecell')[ readedList[a]+1 ]).html('b');
            }else if (data[articleID[select]].like){
                $($('.likecell')[ articleID[select]+1 ]).html('m');
            }else{
                $($('.likecell')[ articleID[select]+1 ]).html('');
            }
        } else {
            data[articleID[select]].readed = false;
            if (data[articleID[select]].base) {
                var readedList = articleID.find(articleID[select]);
                for (var a = 0; a < 2; a++)
                    $($('.likecell')[ readedList[a]+1 ]).html('B');
            }else if (data[articleID[select]].like){
                $($('.likecell')[ articleID[select]+1 ]).html('M');
            }else{
                $($('.likecell')[ articleID[select]+1 ]).html('+');
            }
        }
    };
    var fillContent = function () {
        var titleStr = data[articleID[select]].title;
        if (data[articleID[select]].re) {
            titleStr = 'Re: '+titleStr;
        }
        $('#articleTitle').html(titleStr);
        if (data[articleID[select]].week === undefined)
            data[articleID[select]].week = 'Unknown';
        if (data[articleID[select]].time === undefined)
            data[articleID[select]].time = 'Unknown';
        var timeStr = data[articleID[select]].date+' '+
            data[articleID[select]].week+' '+data[articleID[select]].time;
        $('#articleTime').html(timeStr);
        
        if (data[articleID[select]].content === undefined)
            data[articleID[select]].content = '';
        
        var contentStr = '';
        contentStr += data[articleID[select]].content;
        contentStr += '<br>';
        contentStr += sign[data[articleID[select]].sign];
        
        var listUrl = window.location.href+'/Game';
        listUrl = listUrl.replace('/index.html', '');
        while (contentStr.search('ROOTURL') != -1) {
            contentStr = contentStr.replace('ROOTURL', listUrl);
        }
        
        contentStr = contentStr.split('\n').map(function (line) {
            console.log(line[0]);
            if (line[0]+line[1] == '> ') {
                return '<ccd>'+line+'</ccd>';
            } else if (line[0] == '※') {
                return '<clcd>'+line+'</clcd>';
            }
            return line;
        }).join('\n');
        /*
        while (contentStr.search('\n') != -1) {
            contentStr = contentStr.replace('\n', '<br>');
        }*/
        $('#content').html(contentStr);
        
        var pushStr = '';
        if (data[articleID[select]].push) {
            for (var a = 0; a < data[articleID[select]].push.length; a++) {
                var pushCharColor = '';
                switch (data[articleID[select]].push[a].type) {
                    case -1:pushCharColor = 'clrd';break;
                    case  0:pushCharColor = 'cyd';break;
                    case  1:pushCharColor = 'clwd';break;
                }
                pushStr += '<div class="line">';
                pushStr += '<div class="pushChar cell"><'+pushCharColor+'>'
                    +data[articleID[select]].push[a].push+'</'+pushCharColor+'></div>';
                pushStr += '<div class="pushID cell"><clyd>'
                    +data[articleID[select]].push[a].ID+'</clyd><cyd>：</cyd></div>';
                var s = data[articleID[select]].push[a].date;
                var dateStr = s.slice(4,6)+'/'+s.slice(6,8)+' '
                    +s.slice(8,10)+':'+s.slice(10);
                pushStr += '<div class="pushDate cell">'
                    +dateStr+'</div>';
                pushStr += '<div class="pushContent cell"><cyd>'
                    +data[articleID[select]].push[a].content+'</cyd></div>';
                pushStr += '</div>';
            }
            $('#pushes').html(pushStr);
        }
        coloring();
        unMarkTitle();
        markTitle();
        setReaded(true);
    };
    var gotoList = function () {
        state = 'list';
        
        //clean up article
        var loadingPleaseWaitStr = 'Loading...Please wait';
        $('#articleTitle').html(loadingPleaseWaitStr);
        $('#articleTime').html(loadingPleaseWaitStr);
        $('#content').html(loadingPleaseWaitStr);
        $('#pushes').html(loadingPleaseWaitStr);
        
        $('#article').css({'display':'none'});
        $('#list').css({'display':'block'});
        $('#base').css({'display':'block'});
    };
    var gotoArticle = function () {
        state = 'article';            
        $('#article').css({'display':'block'});
        $('#list').css({'display':'none'});
        $('#base').css({'display':'none'});
        console.log(select);
        if (!data[articleID[select]].readed) {
            var listUrl = './Articles/';
            listUrl = listUrl.replace('/index.html', '');
            $.ajax({
                url:listUrl+data[articleID[select]].file
            }).done(function (msg) {
                data[articleID[select]]['content'] = msg;
                //data[articleID[select]].readed = true;
                fillContent();
            });
        } else {
            fillContent();
        }
    };
    var markTitle = function () {
        markedTitle = data[articleID[select]].title;
        for (var a = 0; a < articleID.length; a++) {
            if (data[articleID[a]].title == markedTitle) {
                if (data[articleID[a]].re) {
                    $($('.square')[a]).css({'color':'yellow'});
                    $($('.square')[a]).text('=>');
                    $($('.workName')[a+1]).css({'color':'yellow'});
                } else {
                    $($('.square')[a]).css({'color':'lime'});
                    $($('.square')[a]).text('◆');
                    $($('.workName')[a+1]).css({'color':'lime'});
                }
            }
        }
    };
    var unMarkTitle = function () {
        console.log(articleID, articleID.length);
        for (var a = 0; a < articleID.length; a++) {
            if (data[articleID[a]].re) {
                $($('.square')[a]).text('Re');
            } else {
                $($('.square')[a]).text('◇');
            }
            $($('.square')[a]).css({'color':'lightgray'});
            $($('.workName')[a+1]).css({'color':'lightgray'});
        }
        markedTitle = '';
    };
    
    var coloring = function () {
        for (t in colorTable) {
            $(t).css(colorTable[t]);
        }
    };
    var uncoloring = function () {
        for (t in colorTable) {
            $(t).css(colorTable['cwd']);
        }
    };
    
    KeyManager.keydown(['UP', 'k'], function () {
        if (state == 'list') {
            selectArticle(select-1);
        }
    }).keydown(['DOWN', 'j'], function () {
        if (state == 'list') {
            selectArticle(select+1);
        }
    }).keydown('RIGHT', function () {
        if (state == 'list') {
            gotoArticle();
        }
    }).keydown('ENTER', function () {
        if (state == 'list') {
            gotoArticle();
        }else if (state == 'article' && light){
            light = false;
            coloring();
        }
    }).keydown(['LEFT', 'q'], function () {
        if (state == 'article') {
            gotoList();
        }
    }).keydown('BACKSLASH', function (){
        if (state == 'article') {
            if (light == false) {
                light = true;
                uncoloring();
            }else{
                light = false;
                coloring();
            }
        }
    }).keydown('END', function () {
        if (state == 'list') {
            selectArticle(amount-1);
        }
    }).keydown('HOME', function () {
        if (state == 'list') {
            selectArticle(0);
        }
    }).keydown('ESC', function () {
        setReaded(false);
    }).keydown('[', function () {
        for (var a = select-1; a >= 0; a--) {
            if (data[articleID[a]].title == markedTitle) {
                selectArticle(a);
                break;
            }
        }
    }).keydown(']', function () {
        for (var a = select+1; a < articleID.length; a++) {
            if (data[articleID[a]].title == markedTitle) {
                selectArticle(a);
                break;
            }
        }
    });
    
    var selectArticle = function (index) {
        if (state  != 'list') return;
        if (index < 0) return;
        if (index >= amount) return;
        if (index == select) return;
        $($('.line')[select+3]).removeClass('selLine');
        select = index;
        $($('.line')[select+3]).addClass('selLine');
    };
    
    var bindMouseEvent = function () {
        //mouse function
        $('.line').mouseenter(function () {
            selectArticle( $('.line').index(this)-3 );
        }).click(function () {
            if ($('.line').index(this)-3 != select) return;
            gotoArticle();
        });
        //when click the black area, back to list
        $('#wrapper').mouseenter(function () {
            inrange = true;
        }).mouseleave(function () {
            inrange = false;
        });
        $('body').click(function () {
            if (!inrange) {
                gotoList();
            }
        });
    };
    var afterDataArrived = function () {
        //console.log(data[0]);
        fillList();
        coloring();
        bindMouseEvent();
    };
    
    $(function () {
        adjustHead();
        var listUrl = './Articles/list.txt';
        listUrl = listUrl.replace('/index.html', '');
        $.ajax({
            'url':listUrl
        }).done(function (msg) {
            data = JSON.parse(msg);
            init();
            var waiting = 0;
            for (var a = 0; a < amount; a++) {
                if (data[a].push) {
                    waiting++;
                    (function () {
                        var waitingID = a;
                        $.ajax({
                            'url':'./Articles/'
                                    +data[waitingID].push
                        }).done(function (msg) {
                            waiting--;
                            data[waitingID].push = JSON.parse(msg);
                            var point = 0;
                            for (var a = 0; a < data[waitingID].push.length; a++) {
                                point += data[waitingID].push[a].type;
                            }
                            data[waitingID].pushNum = point;
                            //console.log(data[waitingID].push[0].push);
                            if (waiting == 0) {
                                afterDataArrived();
                            }
                        });
                    })();
                }
            }
        });
        $('#article').css('display','none');
    });
})();

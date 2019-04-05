var ST_LIST = 'LIST';
var ST_ARTICLE = 'ARTICLE';
var ST_WAITING = 'WAITING';

var StateMachine = { };
var last_readed = 0;
var scroll_top = 0;

StateMachine.state = '';
StateMachine.waiting_article_index = -1;

StateMachine.state_init = function () {
    StateMachine.state = ST_LIST;
    if (window.location.hash != '') {
        StateMachine.waiting_article_index = ARTICLE_FILES_LIST.indexOf(window.location.hash.replace(/^#/, ''));
        StateMachine.state = (StateMachine.waiting_article_index == -1) ? ST_LIST : ST_WAITING;
    }
};

StateMachine.enter_article = function (index) {
    if ( !(index in articles_info) ) {
        return;
    }
    StateMachine.state = ST_ARTICLE;
    $('#articles-list-panel').addClass('hidden');
    $('#article-content-panel').removeClass('hidden');
    $('#article-content'+ index).removeClass('hidden');
    $('#back-button').removeClass('hidden');
    switch (articles_info[index]['readed']) {
    case 'M':
        $('#article-line'+ index +' > .like').text('m');
        break
    case '+':
        $('#article-line'+ index +' > .like').text(' ');
        break
    }
    articles_info[index]['readed'] = 'true';
    // uncolor all same titled articles
    for (var a = 0; a < articles_info.length; a++) {
        if (articles_info[a] == undefined || articles_info[last_readed] == undefined) {
            continue;
        }

        if (articles_info[a]['title'] == articles_info[last_readed]['title']) {
            if (articles_info[a]['re'] == 'true') {
                $('#article-line'+ a +' > .title').removeClass('fY');
                $('#article-line'+ a +' > .re').removeClass('fY').text('Re');
            } else {
                $('#article-line'+ a +' > .title').removeClass('fG');
                $('#article-line'+ a +' > .re').removeClass('fG');
            }
        }
    }
    last_readed = index;
    // color all same titled articles
    for (var a = 0; a < articles_info.length; a++) {
        if (articles_info[a] == undefined || articles_info[last_readed] == undefined) {
            continue;
        }
        if (articles_info[a]['title'] == articles_info[last_readed]['title']) {
            if (articles_info[a]['re'] == 'true') {
                $('#article-line'+ a +' > .title').addClass('fY');
                $('#article-line'+ a +' > .re').addClass('fY').text('=>');
            } else {
                $('#article-line'+ a +' > .title').addClass('fG');
                $('#article-line'+ a +' > .re').addClass('fG');
            }
        }
    }
    scroll_top = $('body').scrollTop();
    $('body').scrollTop(0);
    window.location.hash = ARTICLE_FILES_LIST[index];

};

StateMachine.leave_article = function () {
    if (StateMachine.state == ST_LIST) { return; }
    StateMachine.state = ST_LIST;
    $('#articles-list-panel').removeClass('hidden');
    $('#article-content-panel').addClass('hidden');
    $('#article-content-panel > div').addClass('hidden');
    $('#back-button').addClass('hidden');
    window.location.hash = '';
    $('body').scrollTop(scroll_top);
};


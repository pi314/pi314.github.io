var ST_LIST = 'LIST';
var ST_ARTICLE = 'ARTICLE';

var StateMachine = { };
var last_readed = 0;

StateMachine.state = '';

StateMachine.state_init = function () {
    StateMachine.state = ST_LIST;
};

StateMachine.enter_article = function (index) {
    console.log('enter article ' + index);
    if ( !(index in articles_info) ) {
        console.log('skip article ' + index);
        return;
    }
    StateMachine.state = ST_ARTICLE;
    $('#articles-list-panel').addClass('hidden');
    $('#article-content-panel').removeClass('hidden');
    $('#article-content'+ index).removeClass('hidden');
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

};

StateMachine.leave_article = function () {
    StateMachine.state = ST_LIST;
    $('#articles-list-panel').removeClass('hidden');
    $('#article-content-panel').addClass('hidden');
    $('#article-content-panel > div').addClass('hidden');
    console.log('leave article');
};


var ST_LIST = 'LIST';
var ST_ARTICLE = 'ARTICLE';
var state = '';

function state_init () {
    state = ST_LIST;
}

function enter_article (index) {
    console.log('enter article ' + index);
    if ( !articles_ready[index] ) {
        console.log('skip article ' + index);
        return;
    }
    state = ST_ARTICLE;
    $('#articles-list-panel').addClass('hidden');
    $('#article-content-panel').removeClass('hidden');
    $('#article-content'+ index).removeClass('hidden');
}

function leave_article () {
    state = ST_LIST;
    $('#articles-list-panel').removeClass('hidden');
    $('#article-content-panel').addClass('hidden');
    $('#article-content-panel > div').addClass('hidden');
    console.log('leave article');
}

var ST_LIST = 'LIST';
var ST_ARTICLE = 'ARTICLE';

var StateMachine = { };

StateMachine.state = '';

StateMachine.state_init = function () {
    StateMachine.state = ST_LIST;
};

StateMachine.enter_article = function (index) {
    console.log('enter article ' + index);
    if ( !articles_ready[index] ) {
        console.log('skip article ' + index);
        return;
    }
    StateMachine.state = ST_ARTICLE;
    $('#articles-list-panel').addClass('hidden');
    $('#article-content-panel').removeClass('hidden');
    $('#article-content'+ index).removeClass('hidden');
};

StateMachine.leave_article = function () {
    StateMachine.state = ST_LIST;
    $('#articles-list-panel').removeClass('hidden');
    $('#article-content-panel').addClass('hidden');
    $('#article-content-panel > div').addClass('hidden');
    console.log('leave article');
};

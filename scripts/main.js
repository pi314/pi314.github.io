var state = 'list';


function article (fname) {
    this.fname = fname;
    this.index = 0;
}


$(function () {
    var articles = [];

    for (var i = 0; i < ARTICLE_FILES_LIST.length; i++) {
        var atc = new article(ARTICLE_FILES_LIST[i]);
        atc.index = i + 1;
        articles.push(atc);
    }

    var app = new Vue({
        el: '#articles-list-panel',
        data: {
            message: 'Hello Vue!',
            articles: articles,
        }
    })

    // // display state, (*)ST_LIST / ST_ARTICLE
    // StateMachine.state_init();
    //
    // $.ajax({
    //     url: 'Articles/signatures.txt',
    //     cache: false,
    // }).done(function (msg) {
    //     ArticleContentManager.handle_signatures(msg);
    //
    //     // article contents must be fetched after the signature file
    //     ArticleListManager.article_list_panel_init();
    //     ArticleListManager.article_list_panel_mouse_binding();
    // });

});

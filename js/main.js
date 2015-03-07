$(function () {

    // display state, (*)ST_LIST / ST_ARTICLE
    StateMachine.state_init();

    $.ajax({
        url: 'Articles/signatures.txt',
        cache: false,
    }).done(function (msg) {
        ArticleContentManager.handle_signatures(msg);

        // article contents must be fetched after the signature file
        ArticleListManager.article_list_panel_init();
        ArticleListManager.article_list_panel_mouse_binding();
    });

});

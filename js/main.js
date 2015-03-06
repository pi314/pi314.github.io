$(function () {

    // display state, (*)ST_LIST / ST_ARTICLE
    StateMachine.state_init();

    ArticleListManager.article_list_panel_init();
    ArticleListManager.article_list_panel_mouse_binding();

});

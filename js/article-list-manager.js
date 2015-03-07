var mouse_on_widget = false;

var ArticleListManager = { };

ArticleListManager.article_list_panel_init = function () {
    for (var index = 0; index < ARTICLE_FILES_LIST.length; index++) {
        filename = ARTICLE_FILES_LIST[index];
        $('#articles-list').append(
            '<div id="article-line'+ index +'" class="line">'+
            '<div class="text-block index">'+ (index+1) +'</div>'+
            '<div class="text-block like">?</div>'+
            '<div class="text-block pushes">?</div>'+
            '<div class="text-block date">??/??</div>'+
            '<div class="text-block author">pi314</div>'+
            '<div class="text-block re">◇</div>'+
            '<div class="text-block title">'+ filename +'</div>'+
            '</div>'
            );
        ArticleContentManager.download_article(index);
    }
};

ArticleListManager.article_list_panel_mouse_binding = function () {
    
    $('#articles-list > .line').mouseenter(function () {
        $(this).addClass('focused');
    }).mouseleave(function () {
        $(this).removeClass('focused');
    }).click(function () {
        StateMachine.enter_article( this.id.substring(12) );
    });

    $('#wrapper').mouseenter(function () {
        mouse_on_widget = true;
    }).mouseleave(function () {
        mouse_on_widget = false;
    });

    $('html').click(function () {
        if ( !mouse_on_widget ) {
            StateMachine.leave_article();
        }
    });
};

ArticleListManager.set_article_into = function (index, article_info) {
    var t = {
        'base':  'bB',
        'true':  'mM',
        'false': '  ',
    };
    $('#article-line'+ index +' > .like').text(t[article_info['like']][0]).addClass(t[article_info['like']][1]);
    $('#article-line'+ index +' > .date').text( article_info['date'].substring(5) );
    $('#article-line'+ index +' > .title').text( article_info['title'] );
};


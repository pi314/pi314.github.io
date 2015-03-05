// This file contains all functions that related to article list

var mouse_on_widget = false;

var ArticleListManager = { };

ArticleListManager.article_list_panel_init = function () {
    for (var index = 0; index < article_files_list.length; index++) {
        filename = article_files_list[index];
        $('#articles-list').append(
            '<div id="article-line'+ index +'" class="line">'+
            '<div class="text-block index">'+ (index+1) +'</div>'+
            '<div class="text-block like">?</div>'+
            '<div class="text-block pushes">?</div>'+
            '<div class="text-block date">??/??</div>'+
            '<div class="text-block author">pi314</div>'+
            '<div class="text-block re"></div>'+
            '<div class="text-block article_title">'+ filename +'</div>'+
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
        enter_article( this.id.substring(12) );
    });

    $('#wrapper').mouseenter(function () {
        mouse_on_widget = true;
    }).mouseleave(function () {
        mouse_on_widget = false;
    });

    $('body').click(function () {
        if ( !mouse_on_widget ) {
            leave_article();
        }
    });
};


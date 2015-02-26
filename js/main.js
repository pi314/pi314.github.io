$(function () {
    var ST_LIST = 'LIST';
    var ST_ARTICLE = 'ARTICLE';

    // display state
    var state = ST_LIST;

    for (var f = 0; f < article_files_list.length; f++) {
        filename = article_files_list[f];
        $('#articles-list').append(
            '<div id="article-line'+ f +'" class="line">'+
            '<div class="text-block index">'+ (f+1) +'</div>'+
            '<div class="text-block like"></div>'+
            '<div class="text-block pushes"></div>'+
            '<div class="text-block date"></div>'+
            '<div class="text-block author">pi314</div>'+
            '<div class="text-block re"></div>'+
            '<div class="text-block article_title">'+ filename +'</div>'+
            '</div>'
            );
    }

});

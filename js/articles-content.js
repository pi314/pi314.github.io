var articles_ready = [];

var ArticleContentManager = { };

ArticleContentManager.download_article = function (index) {
    $.ajax({
        url: 'Articles/' + article_files_list[index],
        cache: false,
    }).done(function (msg) {
        ArticleContentManager.parse_and_set_article_content(index, msg);
    });
}

ArticleContentManager.parse_and_set_article_content = function (index, raw_content) {
    var article_content_object = $('<div id="article-content'+ index +'" class="hidden">');

    console.log(raw_content);
    lines = raw_content.split('\n');
    article_info = {};
    // parsing article informations
    // ...

    // set article content
    for (var l = 0; l < lines.length; l++) {
        article_content_object.append('<div class="line"><div class="text-block">'+ lines[l] +'</div></div>');
    }
    $('#article-content-panel').append(article_content_object);
    articles_ready[index] = true;

}

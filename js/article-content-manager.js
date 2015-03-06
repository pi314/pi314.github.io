var articles_ready = [];

var ArticleContentManager = { };

ArticleContentManager.download_article = function (index) {
    $.ajax({
        url: 'Articles/' + ARTICLE_FILES_LIST[index],
        cache: false,
    }).done(function (msg) {
        ArticleContentManager.handle_article_content(index, msg);
    });
};

ArticleContentManager.handle_article_content = function (index, raw_content) {
    var article_content_object = $('<div id="article-content'+ index +'" class="hidden">');

    lines = raw_content.split(/\r?\n/g);
    article_info = {};
    // parsing article informations
    // ...

    // set article content
    var in_header = true;
    for (var l = 0; l < lines.length; l++) {
        console.log(lines[l], in_header);
        if (in_header) {
            if ( lines[l] == '' ) {
                in_header = false;
            }

            var match = /^:(.*?): *(.*)$/.exec(lines[l]);
            if (match == null) {
                in_header = false;
            }
            console.log(match);

            if (in_header == false) {
                // commit article header
                continue;
            }
            article_content_object.append('<div class="line"><div class="text-block">['+ match[1] +']:['+ match[2] +']</div></div>');
            continue;
        }

        if (lines[l] == '') {
            article_content_object.append('<div class="line"><div class="text-block"> </div></div>');
        } else {
            article_content_object.append('<div class="line"><div class="text-block">'+ lines[l] +'</div></div>');
        }

    }
    $('#article-content-panel').append(article_content_object);
    articles_ready[index] = true;

};

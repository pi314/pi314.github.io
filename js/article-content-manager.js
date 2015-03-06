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
    // the article content container
    var article_content_object = $('<div id="article-content'+ index +'" class="hidden">');

    lines = raw_content.split(/\r?\n/g);

    var in_header = true;
    var article_info = {};
    for (var l = 0; l < lines.length; l++) {
        console.log(lines[l], in_header);
        // still in article header
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
                // commit article header into container
                continue;
            }
            article_content_object.append('<div class="line"><div class="text-block">['+ match[1] +']:['+ match[2] +']</div></div>');
            continue;
        }

        // article content, plane text
        if (lines[l] == '') {
            // this does not work, I need another method to display an empty line
            article_content_object.append('<div class="line"><div class="text-block"> </div></div>');
        } else {
            article_content_object.append('<div class="line"><div class="text-block">'+ lines[l] +'</div></div>');
        }

    }

    // put the article content container into page
    $('#article-content-panel').append(article_content_object);

    // this article is ready now
    articles_ready[index] = true;

};

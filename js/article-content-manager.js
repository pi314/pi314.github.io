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
    var article_info = {
        'like':'true',
        'datetime':'yyyy/mm/dd.HH:MM',
        'week':'What',
        'sign':'nctu',
        'title':'(empty)',
        'push':'',
    };
    for (var l = 0; l < lines.length; l++) {
        console.log(lines[l], in_header);
        // still in article header
        if (in_header) {
            if ( lines[l] == '' ) {
                in_header = false;
            }

            var match = /^:(.*?): *(.*)$/.exec(lines[l]);
            if (match == null) {
                ArticleContentManager.commit_header(article_content_object, article_info);
                article_content_object.append('<div class="line"><div class="text-block">'+ lines[l] +'</div></div>');
                in_header = false;
                continue;
            }
            article_info[ match[1] ] = match[2];
            console.log(match);

            if (in_header == false) {
                ArticleContentManager.commit_header(article_content_object, article_info);
            }
            continue;
        }

        // article content, plane text
        if (lines[l] == '') {
            // this does not work, I need another method to display an empty line
            article_content_object.append('<div class="line"><div class="text-block"><br></div></div>');
        } else {
            article_content_object.append('<div class="line"><div class="text-block">'+ lines[l] +'</div></div>');
        }

    }

    // put the article content container into page
    $('#article-content-panel').append(article_content_object);

    ArticleListManager.set_article_into(index, article_info);

    // this article is ready now
    articles_ready[index] = true;

};

ArticleContentManager.commit_header = function (article_content_object, article_info) {
    var header_line;
    var header_prompt;
    var header_value;
    header_line = $('<div class="line article-header"></div>');
    header_prompt = $('<div class="text-block prompt">作者</div>');
    header_value = $('<div class="text-block value">pi314 (圓周率)</div>');
    header_line.append(header_prompt);
    header_line.append(header_value);
    header_prompt = $('<div class="text-block prompt right">站內</div>');
    header_value = $('<div class="text-block value right">P_pi314</div>');
    header_line.append(header_value);
    header_line.append(header_prompt);
    article_content_object.append(header_line);

    header_line = $('<div class="line article-header"></div>');
    header_prompt = $('<div class="text-block prompt">標題</div>');
    header_value = $('<div class="text-block value">'+ article_info['title'] +'</div>');
    header_line.append(header_prompt);
    header_line.append(header_value);
    article_content_object.append(header_line);

    header_line = $('<div class="line article-header"></div>');
    header_prompt = $('<div class="text-block prompt">時間</div>');
    var d = article_info['datetime'].split('.');
    header_value = $('<div class="text-block value">'+ d[0] +' '+ article_info['week'] +' '+ d[1] +'</div>');
    header_line.append(header_prompt);
    header_line.append(header_value);
    article_content_object.append(header_line);
    article_content_object.append('<div class="line"><div class="text-block"><br></div></div>');
};

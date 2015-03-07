var articles_ready = [];

var signatures = {'':[]};
var ArticleContentManager = { };

ArticleContentManager.handle_signatures = function (raw_content) {
    var lines = raw_content.split(/\r?\n/g);
    var parsing_content = false;
    var signature_name = '';
    for (var l = 0; l < lines.length; l++) {
        if (parsing_content) {
            if (lines[l] == ':end:') {
                parsing_content = false;
            } else {
                signatures[signature_name].push(lines[l]);
            }
        } else {
            var match = /^:start: *(.*)$/.exec(lines[l]);
            if (match != null) {
                signature_name = match[1];
                signatures[signature_name] = [];
                parsing_content = true;
            }
        }
    }

}

ArticleContentManager.download_article = function (index) {
    // download article, parse it, and show it on webpage
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
    var lines = raw_content.split(/\r?\n/g);
    var in_header = true;
    var article_info = {
        'like':     'true',
        'date':     '????/??/??',
        'time':     '??:??',
        'week':     '?',
        'sign':     '',
        'title':    ARTICLE_FILES_LIST[index],
        'push':     '',
        're':       'false',
    };

    // iterate article content line by line
    for (var l = 0; l < lines.length; l++) {
        if (in_header) {
            // still in article header
            if ( lines[l] == '' ) {
                in_header = false;
            }

            var match = /^:(.*?): *(.*)$/.exec(lines[l]);
            if (match == null) {
                ArticleContentManager.commit_header(article_content_object, article_info);
                ArticleContentManager.add_line(article_content_object, lines[l]);
                in_header = false;
                continue;
            }
            article_info[ match[1] ] = match[2];

            if (in_header == false) {
                ArticleContentManager.commit_header(article_content_object, article_info);
            }
            continue;
        }

        // article content, plane text
        if (lines[l] == '') {
            ArticleContentManager.add_line(article_content_object, '<br>');
        } else {
            ArticleContentManager.add_line(article_content_object, lines[l]);
        }

    }

    // add signature content
    ArticleContentManager.add_line(article_content_object, '--');
    for (l = 0; l < signatures[ article_info['sign'] ].length; l++) {
        ArticleContentManager.add_line(article_content_object, signatures[ article_info['sign'] ][l]);
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
    header_value = $('<div class="text-block value">'+ article_info['date'] +' '+ article_info['week'] +' '+ article_info['time'] +'</div>');
    header_line.append(header_prompt);
    header_line.append(header_value);
    article_content_object.append(header_line);
    ArticleContentManager.add_line(article_content_object, '<br>');
};

ArticleContentManager.add_line = function (article_content_object, line_content) {
    if (line_content[0] == '>') {
        line_content = '<div class="text-block fc">'+ line_content +'</div>';
    } else if (line_content[0] == '※') {
        line_content = '<div class="text-block fg">'+ line_content +'</div>';
    }
    article_content_object.append('<div class="line"><div class="text-block">'+ line_content +'</div></div>');
}

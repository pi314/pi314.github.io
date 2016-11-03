var articles_info = [];

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
    if (index in articles_info) {
        return;
    }

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

    // itevote article content line by line
    for (var l = 0; l < lines.length; l++) {
        if (in_header) {
            // still in article header
            if (lines[l] == '') {
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

    ArticleContentManager.add_signature(article_content_object, article_info['sign']);

    // put the article content container into page
    $('#article-content-panel').append(article_content_object);

    ArticleListManager.set_article_into(index, article_info);

    // this article is ready now
    articles_info[index] = article_info;
    var t = {
        'true':  'M',
        'false': '+',
    };
    articles_info[index]['readed'] = t[ article_info['like'] ];

    if (StateMachine.state == ST_WAITING && window.location.hash == '#'+ ARTICLE_FILES_LIST[index]) {
        StateMachine.enter_article(index);
    }

    ArticleContentManager.add_pushes(index, article_info['push']);

};

ArticleContentManager.commit_header = function (article_content_object, article_info) {
    var header_line;
    var header_prompt;
    var header_value;
    header_line = $('<div class="line article-header bn"></div>');
    header_prompt = $('<div class="text-block prompt fn bw">作者</div>');
    header_value = $('<div class="text-block value">pi314 (圓周率)</div>');
    header_line.append(header_prompt);
    header_line.append(header_value);
    header_prompt = $('<div class="text-block prompt fn bw right">站內</div>');
    header_value = $('<div class="text-block value right">P_pi314</div>');
    header_line.append(header_value);
    header_line.append(header_prompt);
    article_content_object.append(header_line);

    header_line = $('<div class="line article-header bn"></div>');
    header_prompt = $('<div class="text-block prompt fn bw">標題</div>');
    header_value = $('<div class="text-block value">'+ article_info['title'] +'</div>');
    header_line.append(header_prompt);
    header_line.append(header_value);
    article_content_object.append(header_line);

    header_line = $('<div class="line article-header bn"></div>');
    header_prompt = $('<div class="text-block prompt fn bw">時間</div>');
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

    // replace color codes: [XY; -> class="fX bY"
    // stroke: [XY-; -> class="fX bY stroke"
    line_content = line_content.replace(
        /\[([brgynpcwoBRGYNPCWO])([brgynpcwoBRGYNPCWO])(-?);/g,
        function (match, g1, g2, g3) {
            return '<div class="text-block f'+ g1 +' b'+ g2 +' '+ (g3 == '' ? '' : 'stroke') +'">';
        });
    line_content = line_content.replace(/\[;/g, '</div>');
    // hyper links, not accurate but I think it's enough
    line_content = line_content.replace(/(^|[^"<])(https?:\/\/[^ ]*)(?![">])/g, '$1<a href="$2" target="_blank">$2</a>');
    line_content = line_content.replace(/`([^`]*) +<([^`]*)>`_/g, '<a href="$2" target="_blank">$1</a>');
    article_content_object.append('<div class="line"><div class="text-block">'+ line_content +'</div></div>');
};

ArticleContentManager.add_signature = function (article_content_object, signature_data) {
    ArticleContentManager.add_line(article_content_object, '--');
    for (l = 0; l < signatures[ signature_data ].length; l++) {
        ArticleContentManager.add_line(article_content_object, signatures[ signature_data ][l]);
    }
};

ArticleContentManager.add_pushes = function (index, push_file) {
    if (push_file == '') {
        // no push file needed
        ArticleListManager.set_pushes(index, null);
        return;
    }

    $.ajax({
        url: 'Articles/'+ push_file,
        cache: false,
    }).done(function (raw_content) {
        var article_content_object = $('#article-content'+ index);
        var lines = raw_content.split(/\r?\n/g);
        var pushes = 0;
        for (var l = 0; l < lines.length; l++) {
            var match = /^([-^v])[0-9?]{4}\/([0-9?]{2}\/[0-9?]{2})-([0-9?]{2}:[0-9?]{2})\|(.*)$/.exec(lines[l]);
            if (match == null) {
                continue;
            }
            var push_flag = match[1];
            var push_str = '<div class="text-block '+{'^':'fW', '-':'fy', 'v':'fW'}[push_flag]+' push">'
                + {'^':'推','-':'→','v':'噓'}[push_flag]
                +'</div>';
            var author_str = '<div class="text-block fY">pi314</div>';
            var content_str = '<div class="text-block fy">：'+ match[4] +'</div>';
            var date_str = '<div class="text-block date fw">'+ match[2] +'</div>';
            var time_str = '<div class="text-block time fw">'+ match[3] +'</div>';
            var line_str = push_str + author_str + content_str + time_str + date_str;
            article_content_object.append('<div class="line">'+ line_str +'</div>');
            pushes += {'^':1, '-':0, 'v':-1}[push_flag];
        }
        ArticleListManager.set_pushes(index, pushes);
    });
};

var state = 'list';


var WEEK_COLOR = {
    'Mon': 'fG',
    'Tue': 'fY',
    'Wed': 'fN',
    'Thu': 'fP',
    'Fri': 'fC',
    'Sat': 'fW',
    'Sun': 'fR',
};


function Article (fname) {
    // static info
    this.fname = fname;
    this.index = 0;
    this.like = false;
    this.date = '????/??/??';
    this.time = '??:??';
    this.week = '?';
    this.sign = '';
    this.title = this.fname;
    this.push = [];
    this.re = false;

    // dynamic info
    this.loaded = false;
    this.read = false;

    this.parse = function (raw_content) {
        var lines = raw_content.split(/\r?\n/g);
        var in_header = true;

        for (var l = 0; l < lines.length; l++) {
            if (in_header) {
                // still in article header
                if (lines[l] == '') {
                    in_header = false;
                }

                var match = /^:(.*?): *(.*)$/.exec(lines[l]);
                if (match == null) {
                    in_header = false;
                    continue;
                }
                // article_info[ match[1] ] = match[2];
                switch (match[1]) {
                    case 'like':
                        this.like = (match[2] === 'true');
                        break;
                    default:
                    this[match[1]] = match[2];
                }
                console.log(match);

                if (in_header == false) {
                }
                continue;
            }
        }

        this.loaded = true;
    }
}


$(function () {
    var articles = [];

    for (var i = 0; i < ARTICLE_FILES_LIST.length; i++) {
        var atc = new Article(ARTICLE_FILES_LIST[i]);
        atc.index = i + 1;
        articles.push(atc);
    }

    var article_list_render = new Vue({
        el: '#articles-list-panel',
        data: {
            WEEK_COLOR: WEEK_COLOR,
            articles: articles,
        },
    });

    var article_content_render = new Vue({
        el: '#article-content-panel',
        data: {
        },
    });

    download_article(articles);

    // // display state, (*)ST_LIST / ST_ARTICLE
    // StateMachine.state_init();
    //
    // $.ajax({
    //     url: 'Articles/signatures.txt',
    //     cache: false,
    // }).done(function (msg) {
    //     ArticleContentManager.handle_signatures(msg);
    //
    //     // article contents must be fetched after the signature file
    //     ArticleListManager.article_list_panel_init();
    //     ArticleListManager.article_list_panel_mouse_binding();
    // });
});


function download_article (articles) {
    for (var i in articles) {
        console.log(i);
        if (!articles[i].loaded) {
            (function (idx) {
                $.ajax({
                    url: 'Articles/' + articles[idx].fname,
                    cache: false,
                }).done(function (msg) {
                    articles[idx].parse(msg);
                    download_article(articles);
                });
            })(i);
            break;
        }
    }
}

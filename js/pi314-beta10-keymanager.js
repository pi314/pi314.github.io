/*******************************************************************************
This module creates a global object which is named KeyManager.
KeyManager is for handle user keyboard on web pages.
I made this module for practice.

Usage:
KeyManager.keydown(key, callback);
KeyManager.keyup(key, callback);
KeyManager.keyup(key, callback).keyup(key, callback)...;

KeyManager.namespace();
KeyManager.namespace('test');

Key can be:
.   A string includes normal characters like 'pi314'.
.   A string includes special characters like '!@#$%^&*(asdf'.
.   A string presents special alias like 'ENTER', 'BACKSPACE', 'BACKSLASH', etc.
.   A string presents combined keys like '<C-x>', I use Vim's notation.
.   An arrry includes many strings like ['a', 'b', 'ENTER', 'BACKSLASH', '@#']

Callback must be a function, but I didn't do related check, so be careful please.
The first argument of callback will be the key being pressed.
When you use

    KeyManager.keydown('abcde', function (user_input_key) {});

to catch a key, the variable user_input_key helps you to recognize which key is being pressed.

Combined keys
<C-c>   ctrl+c
<S-c>   shift+c
<A-c>   alt+c
The first symbol presents control keys must in uppercase.

pi314 @ nctu
2013/05/30
I love JavaScript, Python, and Vim.
michael66230@gmail.com

update on 20130701
    add macros: NUMBER, LOWER, UPPER, ...
    _alias_key_table may be deprecated.

update on 20130701
    do alias in _keydown and _keyup to make <C-[> become ESC

update on 20130704
    do alias in _keydown and _keyup to make <C-h> become BACKSPACE
    return false so that <C-h> event will not propogate

update on 20130714
    add check: if a callback function returns undefined,
    KeyManager return false to keep event propogate,
    but F5 and F12 event will still be propogated.

    add message shows the constants that KeyManager provides.

update on 20130907
    set version number to beta-4
    fix the problem that disables input tags and textarea tags.

    add KeyManager.ignore_input() to ignore input tags and textarea tags.

update on 20130925
    %s/^ *$//g
    add namespaces
        add KeyManager._add_namespace()
        add KeyManager.namespace()
    set version number to beta-5

update on 20131003
    fix bug: the 'DEFAULT' namespace wasn't been initialized.
    change 'DEFAULT' to '__DEFAULT__'

update on 20131012
    although this is a little bit strenge,
    I add scroll_down and scroll_up binding feature into KeyManager
    KeyManager.scroll_down(callback);
    KeyManager.scroll_up(callback);
    this can be used to bind event on mouse wheel scroll.

update on 20131030
    Fix error on scrolling: no namespace, and scroll down returns false.

update on 20131125
    Remove "return false" action on keydown and keyup /<.-.>/

update on 20140124
    Fix error on scrolling: wrongly usage of _wheel_down and _wheel_up object.
*******************************************************************************/

NUMBER = '1234567890';
LOWER = 'abcdefghijklmnopqrstuvwxyz';
UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
ALPHABET = LOWER + UPPER;
ARROW = ['UP', 'LEFT', 'RIGHT', 'DOWN'],
CONTROL = ['SHIFT',   'CTRL',      'ALT',
           'CAPSLOCK','BACKSPACE', 'TAB',   'ENTER',   'SPACE',
           'INSERT',  'DELETE',    'ESC',
           'PGUP',    'PGDN',      'END',   'HOME',
           'LEFT',    'UP',        'RIGHT', 'DOWN',
           'F1',      'F2',        'F3',    'F4',
           'F5',      'F6',        'F7',    'F8',
           'F9',      'F10',       'F11',   'F12'
          ],
SYMBOL = ['`~!@#$%^&*()-=_+[]{}|;\':",./<>?', 'BACKSLASH']
console.log('KeyManager provides:');
console.log('NUMBER:', NUMBER);
console.log('LOWER:', LOWER);
console.log('UPPER:', UPPER);
console.log('ALPHABET:', ALPHABET);
console.log('ARROW:', ARROW);
console.log('CONTROL:', CONTROL);
console.log('Methods: keydown(), keyup(), namespace(), scroll_down(), scroll_up()');

KeyManager = (function () {
    var _alias_key_table = {
        'NUMBER' : '1234567890',
        'LOWER'  : 'abcdefghijklmnopqrstuvwxyz',
        'UPPER'  : 'ABCDEFGHIJKLMNOPQRTSUVWXYZ',
        'ALPHABET':'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ',
        'ARROW'  : ['UP', 'LEFT', 'RIGHT', 'DOWN'],
        'CONTROL': ['SHIFT',   'CTRL',      'ALT',
            'CAPSLOCK','BACKSPACE', 'TAB',   'ENTER',   'SPACE',
            'INSERT',  'DELETE',    'ESC',
            'PGUP',    'PGDN',      'END',   'HOME',
            'LEFT',    'UP',        'RIGHT', 'DOWN',
            'F1',      'F2',        'F3',    'F4',
            'F5',      'F6',        'F7',    'F8',
            'F9',      'F10',       'F11',   'F12'
        ],
        'SYMBOL' : ['`~!@#$%^&*()-=_+[]{}|;\':",./<>?', 'BACKSLASH'],
    };

    var _named_key_list = {
        'SHIFT':'',   'CTRL':'',      'ALT':'',
        'CAPSLOCK':'','BACKSPACE':'', 'TAB':'',   'ENTER':'',   'SPACE':'',
        'INSERT':'',  'DELETE':'',    'ESC':'',
        'PGUP':'',    'PGDN':'',      'END':'',   'HOME':'',
        'LEFT':'',    'UP':'',        'RIGHT':'', 'DOWN' :'',
        'F1':'',      'F2':'',        'F3':'',    'F4':'',
        'F5':'',      'F6':'',        'F7':'',    'F8':'',
        'F9':'',      'F10':'',       'F11':'',   'F12' :'',
        'BACKSLASH':''};

    var _shift_alias_table = {
        '~':'`', '!':'1', '@':'2', '#':'3', '$':'4', '%':'5',
        '^':'6', '&':'7', '*':'8', '(':'9', ')':'0', '_':'-',
        '+':'=', 'Q':'q', 'W':'w', 'E':'e', 'R':'r', 'T':'t',
        'Y':'y', 'U':'u', 'I':'i', 'O':'o', 'P':'p', '{':'[',
        '}':']', '|':'BACKSLASH', 'A':'a', 'S':'s', 'D':'d', 'F':'f',
        'G':'g', 'H':'h', 'J':'j', 'K':'k', 'L':'l', ':':';',
        'Z':'z', 'X':'x', 'C':'c', 'V':'v', 'B':'b', 'N':'n',
        'M':'m', '<':',', '>':'.', '?':'/', '"':'\''
    };

    var _reverse_shift_alias_table = {
        '`':'~', '1':'!', '2':'@', '3':'#', '4':'$', '5':'%',
        '6':'^', '7':'&', '8':'*', '9':'(', '0':')', '-':'_',
        '=':'+', 'q':'Q', 'w':'W', 'e':'E', 'r':'R', 't':'T',
        'y':'Y', 'u':'U', 'i':'I', 'o':'O', 'p':'P', '[':'{',
        ']':'}', 'BACKSLASH':'|','a':'A', 's':'S', 'd':'D', 'f':'F',
        'g':'G', 'h':'H', 'j':'J', 'k':'K', 'l':'L', ';':':',
        'z':'Z', 'x':'X', 'c':'C', 'v':'V', 'b':'B', 'n':'N',
        'm':'M', ',':'<', '.':'>', '/':'?', '\'':'"'
    };

    var _key_code_table = {
        8:'BACKSPACE',        9 :'TAB',        13:'ENTER',
        16:'SHIFT',           17:'CTRL',       18:'ALT',
        20:'CAPSLOCK',
        27:'ESC',             32:'SPACE',      33:'PGUP',
        34:'PGDN',            35:'END',        36:'HOME',
        37:'LEFT',            38:'UP',         39:'RIGHT',
        40:'DOWN',            45:'INSERT',     46:'DELETE',
        112:'F1',             113:'F2',        114:'F3',
        115:'F4',             116:'F5',        117:'F6',
        118:'F7',             119:'F8',        120:'F9',
        121:'F10',            122:'F11',       123:'F12',
        186:';',              187:'=',         188:',',
        189:'-',              190:'.',         191:'/',
        192:'`',              219:'[',         220:'BACKSLASH',
        221:']',              222:'\'',
    };

    var _keydown_table = {};
    var _ctrl_keydown_table = {};
    var _alt_keydown_table = {};
    var _shift_keydown_table = {};
    var _keyup_table = {};
    var _ctrl_keyup_table = {};
    var _alt_keyup_table = {};
    var _shift_keyup_table = {};
    var _ctrl_state = false;
    var _shift_state = false;
    var _alt_state = false;
    var _caps_state = false;

    var _cur_namespace = '__DEFAULT__';

    var _shift_alias_key = function (key) {
        if (key in _shift_alias_table) {
            return '<S-'+_shift_alias_table[key]+'>';
        }
        return key;
    };

    var _reverse_shift_alias_key = function (key) {
        if (key in _reverse_shift_alias_table) {
            return _reverse_shift_alias_table[key];
        }
        return key;
    };

    var _named_key = function (key) {
        if (key in _named_key_list) return true;
        return false;
    };

    var _combine_key = function (key) {
        if (/<.-.*>/.test(key)) return true;
        return false;
    };

    var _alias_key = function (key) {
        if (key in _alias_key_table) return _alias_key_table[key];
        return key;
    };

    var _parseCode = function (input) {
        if (typeof input !== 'number') return 'UNKNOWN';
        if (input in _key_code_table) {
            return _key_code_table[input];
        } else if (65 <= input && input <= 90) {
            return 'abcdefghijklmnopqrstuvwxyz'[input-65];
        } else if (48 <= input && input <= 57) {
            return '0123456789'[input-48];
        }
        console.log(input);
        return 'UNKNOWN';
    };

    var _parse_key = function (key) {
        if (/<C-.>/.test(key)) {
            return ['CTRL', key[3]];
        }
        if (/<S-.*>/.test(key)) {
            return ['SHIFT', key.substring(3, key.length-1)];
        }
        if (/<A-.>/.test(key)) {
            return ['ALT', key[3]];
        }
        return ['NORMAL', key];
    };

    var _add_namespace = function (i) {
        if (_keydown_table[i]       == undefined) {       _keydown_table[i] = {}; }
        if (_ctrl_keydown_table[i]  == undefined) {  _ctrl_keydown_table[i] = {}; }
        if (_alt_keydown_table[i]   == undefined) {   _alt_keydown_table[i] = {}; }
        if (_shift_keydown_table[i] == undefined) { _shift_keydown_table[i] = {}; }
        if (_keyup_table[i]         == undefined) {       _keyup_table[i]   = {}; }
        if (_ctrl_keyup_table[i]    == undefined) {  _ctrl_keyup_table[i]   = {}; }
        if (_alt_keyup_table[i]     == undefined) {   _alt_keyup_table[i]   = {}; }
        if (_shift_keyup_table[i]   == undefined) { _shift_keyup_table[i]   = {}; }
        if (_wheel_down[i]          == undefined) {   _wheel_down[i]        = {}; }
        if (_wheel_up[i]            == undefined) { _wheel_up[i]            = {}; }
    };

    var _keydown = function (event) {
        var k = _parseCode(event.which);
        if (k == 'CTRL') {
            _ctrl_state = true;
        } else if (k == 'ALT') {
            _alt_state = true;
        } else if (k == 'SHIFT') {
            _shift_state = true;
        }

        var target_table = null;
        var key_string = '';
        if (_ctrl_state) {
            target_table = _ctrl_keydown_table[_cur_namespace];
            key_string = '<C-'+k+'>';
        } else if (_alt_state) {
            target_table = _alt_keydown_table[_cur_namespace];
            key_string = '<A-'+k+'>';
        } else if (_shift_state) {
            target_table = _shift_keydown_table[_cur_namespace];
            key_string = _reverse_shift_alias_key(k);
        } else {
            target_table = _keydown_table[_cur_namespace];
            key_string = k;
        }

        if (disable) {
            if (key_string == 'ESC' || key_string == '<C-[>') {
                $('input, textarea').blur();
            }
            return true;
        }

        if (key_string == '<C-[>') {
            if ('ESC' in _keydown_table[_cur_namespace]) {
                return _keydown_table[_cur_namespace]['ESC']('ESC');
            }
        }
        if (key_string == '<C-h>') {
            if ('BACKSPACE' in _keydown_table[_cur_namespace]) {
                _keydown_table[_cur_namespace]['BACKSPACE']('BACKSPACE');
                return false;
            }
        }
        if (k in target_table) {
            var ret = target_table[k](key_string);
            if (key_string == 'F5' || key_string == 'F12') return true;
            if (ret == undefined) return false;
            return ret;
        }
        //if (/<.-.*>/.test(key_string)) return false;
        return true;
    };

    var _keyup = function (event) {
        var k = _parseCode(event.which);
        if (k == 'CTRL') {
            _ctrl_state = false;
        } else if (k == 'ALT') {
            _alt_state = false;
        } else if (k == 'SHIFT') {
            _shift_state = false;
        } else if (k == 'CAPSLOCK') {
            _caps_state = !_caps_state;
        }

        var target_table = null;
        var key_string = '';
        if (_ctrl_state) {
            target_table = _ctrl_keyup_table[_cur_namespace];
            key_string = '<C-'+k+'>';
        } else if (_alt_state) {
            target_table = _alt_keyup_table[_cur_namespace];
            key_string = '<A-'+k+'>';
        } else if (_shift_state) {
            target_table = _shift_keyup_table[_cur_namespace];
            key_string = _reverse_shift_alias_key(k);
        } else {
            target_table = _keyup_table[_cur_namespace];
            key_string = k;
        }

        if (disable) {
            if (key_string == 'ESC' || key_string == '<C-[>') {
                $('input, textarea').blur();
            }
            return true;
        }

        if (key_string == '<C-[>') {
            if ('ESC' in _keyup_table[_cur_namespace]) {
                return _keyup_table[_cur_namespace]['ESC']('ESC');
            }
        }
        if (key_string == '<C-h>') {
            if ('BACKSPACE' in _keyup_table[_cur_namespace]) {
                _keydown_table[_cur_namespace]['BACKSPACE']('BACKSPACE');
                return false;
            }
        }
        if (k in target_table) {
            var ret = target_table[k](key_string);
            if (key_string == 'F5' || key_string == 'F12') return true;
            if (ret == undefined) return false;
            return ret;
        }
        //if (/<.-.*>/.test(key_string)) return false;
        return true;
    };

    var _bind = function (key, edge, callback) {
        var key_tuple = _parse_key(key);
        var key_type = key_tuple[0];
        var key_content = key_tuple[1];
        var target_table = null;

        if (edge == 'DOWN') {
            if (key_type == 'NORMAL') {
                target_table = _keydown_table[_cur_namespace];
            } else if (key_type == 'CTRL') {
                target_table = _ctrl_keydown_table[_cur_namespace];
            } else if (key_type == 'ALT') {
                target_table = _alt_keydown_table[_cur_namespace];
            } else if (key_type == 'SHIFT') {
                target_table = _shift_keydown_table[_cur_namespace];
            }
        }

        if (edge == 'UP') {
            if (key_type == 'NORMAL') {
                target_table = _keyup_table[_cur_namespace];
            } else if (key_type == 'CTRL') {
                target_table = _ctrl_keyup_table[_cur_namespace];
            } else if (key_type == 'ALT') {
                target_table = _alt_keyup_table[_cur_namespace];
            } else if (key_type == 'SHIFT') {
                target_table = _shift_keyup_table[_cur_namespace];
            }
        }
        if (target_table != null) {
            target_table[key_content] = callback;
        }
        //if (key_content == 'ESC') {
        //    console.log('detect esc');
        //    if (edge == 'DOWN') {
        //        _ctrl_keydown_table['['] = callback;
        //    } else if (edge == 'UP') {
        //        _ctrl_keyup_table['['] = callback;
        //    }
        //}
    };

    // Some important bindings to browser
    $(window).blur(function () {
        _ctrl_state = false;
        _shift_state = false;
        _caps_state = false;
        _alt_state = false;
        console.log('blured and reset');
    });

    var disable = false;

    var ignore_input_flag = false;

    $(function () {
        $(document).keydown(_keydown).keyup(_keyup);

        $('input, textarea').focus(function () {
            if (ignore_input_flag) return;
            disable = true;
            console.log('input tag or textarea tag focused.');
        }).blur(function () {
            if (ignore_input_flag) return;
            disable = false;
        });

        $('body').bind('mousewheel DOMMouseScroll', function(event) {
            //var delta = event.originalEvent.wheelDelta || (-event.detail);
            var delta = 0;
            if (event.originalEvent.detail) { // Firefox
                delta = -event.originalEvent.detail;
            } else if (event.originalEvent.wheelDelta) { // Chrome, IE
                delta = event.originalEvent.wheelDelta;
            }
            if (delta > 0) {
                if (_cur_namespace in _wheel_up) {
                    return _wheel_up[_cur_namespace]();
                }
            } else if (delta < 0) {
                if (_cur_namespace in _wheel_down) {
                    return _wheel_down[_cur_namespace]();
                }
            }
            return true;
        });
    });

    var _wheel_up = {};
    var _wheel_down = {};

    _add_namespace(_cur_namespace);

    return {
        keydown : function (key, callback) {
            key = _alias_key(key);
            if (key instanceof Array) { // give an array to bind
                for (i in key) {
                    this.keydown(key[i], callback);
                }
            } else if (_named_key(key) || _combine_key(key)) { // special key and combine key
                _bind(key, 'DOWN', callback);
            } else if (key.length > 1 && !/<.-.*>/.test(key)) {
                for (var i in key) {
                    _bind(_shift_alias_key(key[i]), 'DOWN', callback);
                }
            } else {
                // translate shifted-keys like '!' to '<S-1>'
                // but normal key doesn't change like '1' to '1'
                _bind(_shift_alias_key(key), 'DOWN', callback);
            }
            return KeyManager;
        },
        keyup : function (key, callback) {
            key = _alias_key(key);
            if (key instanceof Array) { // give an array to bind
                for (i in key) {
                    this.keyup(key[i], callback);
                }
            } else if (_named_key(key) || _combine_key(key)) { // special key and combine key
                _bind(key, 'UP', callback);
            } else if (key.length > 1 && !/<.-*>/.test(key)) {
                for (var i in key) {
                    _bind(_shift_alias_key(key[i]), 'UP', callback);
                }
            } else {
                // translate shifted-keys like '!' to '<S-1>'
                // but normal key doesn't change like '1' to '1'
                _bind(_shift_alias_key(key), 'UP', callback);
            }
            return KeyManager;
        },
        ignore_input : function (i) {
            ignore_input_flag = i;
            if (i) {
                disable = false;
            }
        },
        namespace : function (i) {
            if (i == undefined) {
                i = '__DEFAULT__';
            }
            _cur_namespace = i;
            _add_namespace(_cur_namespace);
            return KeyManager;
        },
        scroll_down: function (i) {
            _wheel_down[_cur_namespace] = i;
            return KeyManager;
        },
        scroll_up: function (i) {
            _wheel_up[_cur_namespace] = i;
            return KeyManager;
        },
    };
})();

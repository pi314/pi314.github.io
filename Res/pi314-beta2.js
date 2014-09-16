(function () {
    ArrayExtension();
    StringExtension();
    defKeyManager();
})();

function ArrayExtension () {
    //clean all undefined
    Array.prototype.clean = function () {
        return this.filter(function (e) {return e !== undefined;});
    };
    
    //return a copy of array
    Array.prototype.copy = function () {
        return this.concat([]);
    };
    
    //remove [a, b] section of an array
    Array.prototype.cut = function (a, b) {
        if (b == undefined) {
            return this.slice(0,a).concat(this.slice(a+1));
        } else {
            if (a <= b) {
                return this.slice(0,a).concat(this.slice(b+1));
            }
            return this;
        }
    };
    
    if (!Array.prototype.each) {
        Array.prototype.each = function(fun) {
            var len = this.length;

            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                fun.call(thisp, i, this[i], this);
            }
        };
    }
    
    //return the all index of input value
    Array.prototype.find = function (input) {
        var l = this.length;
        var ary = [];
        for (var a = 0; a < l; a++) {
            if (input === this[a]){
                ary.push(a);
            }
        }
        return ary;
    };
    
    //check whether element in an array
    Array.prototype.has = function (input) {
        var l = this.length;
        for (var a = 0; a < l; a++) {
            if (this[a] === input) return true;
        }
        return false;
    };
    
    //return the first index of input value
    Array.prototype.index = function (input) {
        return this.find(input)[0];
    };
    
    Array.prototype.insert = function (index, elem) {
        if (index >= 0) {
            return this.slice(0, index).concat(elem)
                .concat(this.slice(index, this.length));
        } else {
            return elem + this;
        }
    };
    
    //return array's last element
    Array.prototype.last = function (input) {
        return this[this.length-1];
    };
    
    //return the max value of array
    Array.prototype.max = function () {
        var t = this.copy();
        return t.sort()[this.length-1];
    };
    
    //return all index of max value
    Array.prototype.maxindex = function () {
        var l = this.length;
        var m = this.max();
        return this.find(m);
    };
    
    //return the min calue of array
    Array.prototype.min = function () {
        var t = this.copy();
        return t.sort()[0];
    };
    
    Array.prototype.minindex = function () {
        var l = this.length;
        var m = this.min();
        return this.find(m);
    };
    
    Array.prototype.remove = function (input) {
        if (! (input instanceof Array) ) {
            input = [input];
        }
        var target = input;
        
        var r = this.copy();
        for (var i = 0; i < target.length; i++) {
            r = r.filter(function (e) {
                return !(e === target[i]);
            });
        }
        return r;
    };
    
    //not recommand to use, because javascript object's key is String
    Array.prototype.set = function () {
        var o = {};
        var l = this.length;
        for (var a = 0; a < l; a++) {
            o[this[a]] = '';
        }
        return o;
    };
    
    //remove all redundent element
    Array.prototype.sset = function (modify) {
        var r = [];
        var l = this.length;
        var o = this.set();
        for (var a = 0; a < l; a++) {
            if (this[a] in o) {
                r.push(this[a]);
                delete o[ this[a] ];
            }
        }
        
        return r;
    };
    
    //same as uniq command on freebsd
    Array.prototype.uniq = function (modify) {
        var l = this.length;
        var r = [this[0]];
        var last = this[0];
        for (var a = 1; a < l; a++) {
            if (this[a] != last) {
                r.push(this[a]);
                last = this[a];
            }
        }
        
        return r;
    };
}

function StringExtension () {
    String.prototype.array = function () {
        return this.split('');
    };
    
    String.prototype.cut = function (a, b) {
        if (b == undefined) {
            return this.slice(0,a) + this.slice(a+1);
        } else {
            if (a <= b) {
                return this.slice(0,a) + this.slice(b+1);
            }
            return this;
        }
    };
    
    //not recommand to use, because javascript object's key is String
    String.prototype.set = function () {
        var o = {};
        var l = this.length;
        for (var a = 0; a < l; a++) {
            o[this[a]] = '';
        }
        return o;
    };
    
    String.prototype.reverse = function () {
        return this.split('').reverse().join('');
    };
    
    String.prototype.upper = String.prototype.toUpperCase;
    String.prototype.lower = String.prototype.toLowerCase;
    String.prototype.index = String.prototype.indexOf;
    String.prototype.strip = String.prototype.trim;
    String.prototype.re = String.prototype.match;
    
    String.prototype.insert = function (index, input) {
        if (index >= 0) {
            return this.slice(0, index)+input+this.slice(index, this.length);
        } else {
            return input + this;
        }
    };
}
function defKeyManager () {
    var _keydown = function (event) {
        var k = _parseCode(event.which);
        _trigger(k, 'DOWN');
    };
    var _keyup = function (event) {
        var k = _parseCode(event.which);
        _trigger(k, 'UP');
    };
    var _bindKey = function (prefix, key, b, c) {
        if (typeof key != 'string') {
            console.log('Bind key error:', key);
            throw 'Bind key error:' + key;
        }
        //console.log('bind:', key, b, c);
        
        if (b.upper() === 'DOWN' && typeof c === 'function') {
            //bind key down
            if (prefix == 'CTRL') {
                //console.log('bind control key', key);
                _ctrlDown[key] = c;
            } else if (prefix == 'SHIFT') {
                //console.log('bind shift key', key);
                _shiftDown[key] = c;
            } else {
                _down[key] = c;
            }
        }else if (b.upper() === 'UP' && typeof c === 'function') {
            //bind key up
            if (prefix == 'CTRL') {
                //console.log('bind control key', key);
                _ctrlUp[key] = c;
            } else if (prefix == 'SHIFT') {
                //console.log('bind shift key', key);
                _shiftUp[key] = c;
            } else {
                _up[key] = c;
            }
        }else{
            console.log('Argument error');
            throw 'Argument error';
        }
    };
    var _bind = function (key, edge, func) {
        if (typeof key === 'string') {
            //key = key.upper().trim();
            if (key.upper() == 'UPPER') {
                _bind('ABCDEFGHIJKLMNOPQRSTUVWXYZ', edge, func);
            } else if (key.upper() == 'LOWER') {
                _bind('abcdefghijklmnopqrstuvwxyz', edge, func);
            } else if (key.upper() == 'DIGIT') {
                _bind('1234567890', edge, func);
            } else if (key.upper() == 'SYMBOL') {
                _bind(['`~!@#$%^&*()-=_+', '[]{}|',';:\'",.<>/?', '\\'],
                edge, func);
            } else if (key.upper() == 'EMPTY') {
                _bind(['SPACE', 'TAB', 'ENTER','BACKSPACE', 'DELETE', 'ESC'],
                edge, func);
            } else if (key.upper() == 'MOVING') {
                _bind(['UP','LEFT','RIGHT','DOWN','HOME','END','PGUP','PGDN'],
                edge, func);
            } else if (key.length == 1) {
                var keySymbol = '';
                if (key in _extendShift) _bind(_extendShift[key], edge, func);
                else if(key == '\\')     _bind('BACKSLASH', edge, func);
                else                     _bindKey('NONE', key, edge, func);
            } else if (key in _keywordSet) {
                //console.log(key);
                _bindKey('NONE', key, edge, func);
            } else if (key[0] == '^'){//Control key
                _bindKey('CTRL', key.slice(1), edge, func);
            } else if (key[0] == '$'){
                //console.log('Shift key!');
                _bindKey('SHIFT', key.slice(1), edge, func);
            } else {
                var l = key.length;
                for (var a = 0; a < l; a++) {
                    _bind(key[a], edge, func);
                }
            }
        }else if(key instanceof Array){
            var l = key.length;
            for (var a = 0; a < l; a++) {
                _bind(key[a], edge, func);
            }
        }else{
            console.log('First argument must be a String');
            throw 'First argument must be a String';
        }
        return KeyManager;
    };
    var _unbindKey = function (key, b) {
        if (typeof key != 'string') {
            console.log('Unbind key error:', key);
            throw 'Unbind key error:' + key;
        }
        
        if (b === undefined) {
            //unbind both key down and key up
            delete _down[key];
            delete _up[key];
        }else if (b.upper() === 'DOWN') {
            //only unbind key down
            delete _down[key];
        }else if (b.upper() === 'UP') {
            //only unbind key up
            delete _up[key];
        }else{
            throw 'Argument error';
        }
    };
    var _unbind = function (key, b, c) {
        if (typeof key === 'string') {
            key = key.upper().trim();
            if (key.length == 1) {
                _unbindKey(key, b, c);
            } else if (key in _keywordSet) {
                //console.log(key);
                _unbindKey(key, b, c);
            } else {
                var l = key.length;
                for (var a = 0; a < l; a++) {
                    _unbindKey(key[a], b, c);
                }
            }
        }else if(key instanceof Array){
            var l = key.length;
            for (var a = 0; a < l; a++) {
                _unbind(key[a], b, c);
            }
        }else{
            console.log('First argument must be a String');
            throw 'First argument must be a String';
        }
        return KeyManager;
    };
    var _trigger = function (key, edge) {
        //console.log('trigger',key);
        if (_caps && key in 'abcdefghijklmnopqrstuvwxyz'.set()) {
            //simulate shift key down
            _caps = false;
            _shiftState = true;
            _trigger(key, edge);
            _caps = true;
            _shiftState = false;
        } else {
            if (edge.upper() === 'DOWN') {
                if (_ctrlState) {
                    console.log('ctrl+?', key);
                    if (key in _ctrlDown) {
                        _ctrlDown[key]('^'+key);
                    }//down only
                } else if (_shiftState) {
                    console.log('shift+?', key);
                    if (key in _shiftDown) {
                        var keySymbol = '';
                        if (key in _foldShift) keySymbol = _foldShift[key];
                        else                   keySymbol = '$'+key;
                        _shiftDown[key](keySymbol);
                    }//down only
                } else {
                    if (key in _down) {
                        return (_down[key])(key);
                    }
                }
                //console.log(key+' down has not binded');
            }else if (edge.upper() === 'UP') {
                if (_ctrlState) {
                    console.log('ctrl+?', key);
                    if (key in _ctrlUp) {
                        _ctrlUp[key]('^'+key);
                    }//down only
                } else if (_shiftState) {
                    console.log('shift+?', key);
                    if (key in _shiftUp) {
                        var keySymbol = '';
                        if (key in _foldShift) keySymbol = _foldShift[key];
                        else                   keySymbol = '$'+key;
                        _shiftUp[key](keySymbol);
                    }//down only
                } else {
                    if (key in _up) {
                        return (_up[key])(key);
                    }
                }
                //console.log(key+' up has not binded');
            }
        }
        return KeyManager;
    };
    var _parseCode = function (input) {
        if (typeof input !== 'number') throw 'Must be a integer';
        if (input in _keyCodeTable){
            return _keyCodeTable[input];
        }else if (65 <= input && input <= 90) {
            return 'abcdefghijklmnopqrstuvwxyz'[input-65];
        }else if (48 <= input && input <= 57) {
            return '0123456789'[input-48];
        }
        console.log(input);
        return 'UNKNOWN';
    };
    
    var _keyCodeTable = {
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
    var _extendShift = {
        '~':'$`',        '!':'$1',        '@':'$2',
        '#':'$3',        '$':'$4',        '%':'$5',
        '^':'$6',        '&':'$7',        '*':'$8',
        '(':'$9',        ')':'$0',        '_':'$-',
        '+':'$=',        '{':'$[',        '}':'$]',
        ':':'$;',        '"':'$\'',       '<':'$,',
        '>':'$.',        '|':'$BACKSLASH',
        'A':'$a',        'B':'$b',        'C':'$c',
        'D':'$d',        'E':'$e',        'F':'$f',
        'G':'$g',        'H':'$h',        'I':'$i',
        'J':'$j',        'K':'$k',        'L':'$l',
        'M':'$m',        'N':'$n',        'O':'$o',
        'P':'$p',        'Q':'$q',        'R':'$r',
        'S':'$s',        'T':'$t',        'U':'$u',
        'V':'$v',        'W':'$w',        'X':'$x',
        'Y':'$y',        'Z':'$z',        '?':'$/',
    };
    var _foldShift = {
        '`':'~',        '1':'!',        '2':'@',
        '3':'#',        '4':'$',        '5':'%',
        '6':'^',        '7':'&',        '8':'*',
        '9':'(',        '0':')',        '-':'_',
        '=':'+',        '[':'{',        ']':'}',
        ';':':',        '\'':'"',        ',':'<',
        '.':'>',        'BACKSLASH':'|',
        'a':'A',        'b':'B',        'c':'C',
        'd':'D',        'e':'E',        'f':'F',
        'g':'G',        'h':'H',        'i':'I',
        'j':'J',        'k':'K',        'l':'L',
        'm':'M',        'n':'N',        'o':'O',
        'p':'P',        'q':'Q',        'r':'R',
        's':'S',        't':'T',        'u':'U',
        'v':'V',        'w':'W',        'x':'X',
        'y':'Y',        'z':'Z',        '/':'?',
    };
    var _keywordSet = {};
    var _keywords = [];
    var _down = {};
    var _up = {};
    var _ctrlDown = {};
    var _ctrlUp = {};
    var _shiftDown = {};
    var _shiftUp = {};
    var _ctrlState = false;
    var _shiftState = false;
    var _caps = false;
    
    for (var a in _keyCodeTable) {
        _keywordSet[_keyCodeTable[a]] = '';
        _keywords.push(_keyCodeTable[a]);
    }
    //console.log(_keywordSet);
    
    $(window).blur(function () {
        _ctrlState = false;
        _shiftState = false;
        _caps = false;
        console.log('blur and reset');
    });
    
    $(function () {
        _caps = false;
        $('body').keydown(_keydown).keyup(_keyup);
        $('body').keydown(function (event) {
            var k = _parseCode(event.which);
            switch (k) {
                case 'CTRL':
                    _ctrlState = true;
                    console.log('control:',_ctrlState);
                    break;
                case 'SHIFT':
                    _shiftState = true;
                    console.log('shift:',_shiftState);
                    break;

            }
            if (k == 'F5' || k == 'F12') return true;
            return false;
        }).keyup(function (event) {
            var k = _parseCode(event.which);
            switch (k) {
                case 'CTRL':
                    _ctrlState = false;
                    console.log('control:',_ctrlState);
                    break;
                case 'SHIFT':
                    _shiftState = false;
                    console.log('shift:',_shiftState);
                    break;
                case 'CAPSLOCK':
                    _caps = !_caps;
                    console.log('caps:',_caps);
                    break;
            }
        });
    });
    KeyManager = (function() {
        return {
            bind : _bind,
            keydown : function (key, callback) {
                return _bind(key, 'DOWN', callback);
            },
            keyup : function (key, callback) {
                return _bind(key, 'UP', callback);
            },
            unbind : _unbind,
            get : function () {
                return [_down, _up];
            },
            trigger : _trigger,
            parseCode : _parseCode,
            KeyNames : _keywords.copy()
        };
    })();
}

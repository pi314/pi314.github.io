/***************************************
* cychih's extension 0.6
* extenend some method for Array and String
* And a singleton object KeyManager
* date:2012/08/15

Update:
    Array.prototype.each

## Depend on JQuery ##
## May not compatiable to lower version ##

Most of these method doesn't change objects
it's self, but returns a new instance instead.

If you want to change the object it's self,
add a true to the end of parameters
when calling these methods.
Example:
a.method(b);
a.method(b, true);
****************************************/
/***************************************
* 池昌言的擴充套件
* 包含一些陣列和字串的擴充函式
* 以及一個單例物件 KeyManager

## 依賴 JQuery ##
## 可能和前版本不相容 ##

這裡大部份的函式都不改變物件本身，
而是產生一個新的實例並回傳

若想改變物件本身，
呼叫函式時在參數列尾端加上一參數 true
範例：
a.method(b);
a.method(b, true);
****************************************/
(function () {
    ArrayExtension();
    StringExtension();
    defKeyManager();
})();

function ArrayExtension () {
    //clear the array
    /* ## Modify the array ## */
    Array.prototype.__clear__ = function () {
        while (this.length) {
            this.shift();
        }
        return this;
    };
    
    /* ## Modify the array ## */
    Array.prototype.__replace__ = function (input) {
        if ( !(input instanceof Array)) return this;
        this.__clear__();
        var l = input.length;
        for (var a = 0; a < l; a++) {
            this.push(input[a]);
        }
        return this;
    };

    //merge two array together
    Array.prototype.add = function (input, modify) {
        var r = this.concat(input);
        if (modify) {
            return this.__replace__(r);
        } else {
            return r;
        }
    };
    
    //simular to C/C++ strcat
    /* ## Modify the array ## */
    Array.prototype.arycat = function (input) {
        if (_input instanceof Array) {
            this.add(input, true);
        }
        return this;
    };
    
    //clean all undefined
    /* ## Modify the array ## */
    Array.prototype.clean = function () {
        return this.remove(undefined);
    };
    
    //return a copy of array
    Array.prototype.copy = function () {
        return this.concat([]);
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
        if (input === undefined) return this.copy();
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
    
    //regular expression
    Array.prototype.re = Array.prototype.match;
    
    /* ## Modify the array ## */
    Array.prototype.remove = function (input) {
        var target = {};
        if (input instanceof Array) {
            target = input.set();
        } else {
            target[input] = '';
        }
        
        var r = [];
        var l = this.length;
        for (var a = 0; a < l; a++) {
            var elem = this.shift();
            if ( !(elem in target) ) {
                r.push(elem);
            }
        }
        l = r.length;
        for (var a = 0; a < l; a++) {
            this.push(r[a]);
        }
        return this;
    };
    
    Array.prototype.set = function () {
        var o = {};
        var l = this.length;
        for (var a = 0; a < l; a++) {
            o[this[a]] = '';
        }
        return o;
    };
    
    //remove all redundent element
    //still an Array
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
        
        if (modify) {
            return this.__replace__(r);
        } else {
            return r;
        }
    };
    
    //depend on remove()
    Array.prototype.sub = function (input, modify) {
        if (modify !== true) {
            return this.remove(input);
        } else {
            var r = this.copy();
            return r.remove(input);
        }
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
        
        if (modify) {
            return this.__replace__(r);
        } else {
            return r;
        }        
    };
}

function StringExtension () {
    String.prototype.array = function () {
        return this.split('');
    };
    
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
}
function defKeyManager () {
    var _keydown = function () {
        var k = _parseCode(event.which);
        _trigger(k, 'DOWN');
    };
    var _keyup = function () {
        var k = _parseCode(event.which);
        _trigger(k, 'UP');
    };
    var _bind = function (key, b, c) {
        if (typeof key === 'string') {
            key = key.upper().trim();
            if (typeof b === 'function' && c === undefined) {
                //bind both key down and key up
                _down[key] = b;
                _up[key] = b;
            }else if (b.upper() === 'DOWN' && typeof c === 'function') {
                //only bind key down
                _down[key] = c;
            }else if (b.upper() === 'UP' && typeof c === 'function') {
                //only bind key up
                _up[key] = c;
            }else{
                throw 'Argument error';
            }
        }else if(key instanceof Array){
            var l = key.length;
            for (var a = 0; a < l; a++) {
                _bind(key[a], b, c);
            }
        }else{
            throw 'First argument must be a String';
        }
        return KeyManager;
    };
    var _unbind = function (key, b) {
        if (typeof key === 'string') {
            key = key.upper().trim();
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
        }else if(key instanceof Array){
            var l = key.length;
            for (var a = 0; a < l; a++) {
                _unbind(key[a], b, c);
            }
        }else{
            throw 'First argument must be a String';
        }
        return KeyManager;
    };
    var _trigger = function (key, edge) {
        if (edge === undefined){
            //trigger both
            var result = '';
            if (key in _down) {
                result += 'Down : '+(_down[key])()+', ';
            }
            if (key in _up) {
                result += 'Up : '+(_up[key])();
            }
            return result.trim();
        }else if (edge.upper() === 'DOWN') {
            if (key in _down) {
                return (_down[key])();
            }
            //console.log(key+' down has not binded');
        }else if (edge.upper() === 'UP') {
            if (key in _up) {
                return (_up[key])();
            }
            //console.log(key+' up has not binded');
        }
        return KeyManager;
    };
    var _parseCode = function (input) {
        if (typeof input !== 'number') throw 'Must be a integer';
        if (input in _keyCodeTable){
            return _keyCodeTable[input];
        }else if (65 <= input && input <= 90) {
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[input-65];
        }else if (48 <= input && input <= 57) {
            return '0123456789'[input-48];
        }
        console.log(input);
        return 'UNKNOWN';
    };
    
    var _keyCodeTable = {
        32:'SPACE',
        38:'UP',
        37:'LEFT',
        39:'RIGHT',
        40:'DOWN',
        13:'ENTER',
        9 :'TAB',
        17:'CTRL',
        16:'SHIFT',
        20:'CAPSLOCK',
        27:'ESC',
        46:'DEL',
        36:'HOME',
        35:'END',
        33:'PGUP',
        34:'PGDN',
        188:',',
        190:'.',
        191:'/',
        220:'BACKSLASH'
    };
    var _down = {};
    var _up = {};
    
    $(function () {
        $('body').keydown(_keydown).keyup(_keyup);
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
            parseCode : _parseCode
        };
    })();
}
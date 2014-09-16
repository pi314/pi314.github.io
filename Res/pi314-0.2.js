/***************************************
* cychih's extension 0.2
* including additional method for array
* date:2012/07/29
* update:
    fix Array.prototype.has
    StringExtension
    add an Object, KeyManager
****************************************/
(function () {
    ArrayExtension();
    StringExtension();
    defKeyManager();
})();

function ArrayExtension () {
    //return a copy of array
    Array.prototype.copy = function () {
        return this.concat([])
    };
    
    //merge two array together
    Array.prototype.add = Array.prototype.concat;
    
    //return array's last element
    Array.prototype.last = function (input) {
        return this[this.length-1];
    };
    
    //return the first index of input value
    Array.prototype.index = function (input) {
        return this.find(input)[0];
    };
    
    //check whether element in an array
    Array.prototype.has = function (input) {
        if (input === undefined) return this.copy();
        var l = this.length;
        for (var a = 0; a < l; a++) {
            if (this[a] === input) return true;
        }
        return false;
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
    
    //same as uniq command on freebsd
    Array.prototype.uniq = function () {
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
    
    //remove all redundent element
    Array.prototype.sset = function () {
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
    }
    
    //regular expression
    Array.prototype.re = Array.prototype.match;
    
    Array.prototype.set = function () {
        var o = {};
        var l = this.length;
        for (var a = 0; a < l; a++) {
            o[this[a]] = '';
        }
        return o;
    };
    
    Array.prototype.remove = function (input) {
        var r = [];
        var l = this.length;
        for (var a = 0; a < l; a++) {
            if (this[a] !== input) {
                r.push(this[a]);
            }
        }
        return r;
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
            key = key.upper();
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
        }else{
            throw 'First argument must be a String';
        }
        return KeyManager;
    };
    var _unbind = function (key, b, c) {
        if (typeof key === 'string') {
            if (typeof b === 'function' && c === undefined) {
                //unbind both key down and key up
                delete down[key];
                delete up[key];
            }else if (b.upper() === 'DOWN' && typeof c === 'function') {
                //only unbind key down
                delete down[key];
            }else if (b.upper() === 'UP' && typeof c === 'function') {
                //only unbind key up
                delete up[key];
            }else{
                throw 'Argument error';
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
        //console.log(input);
        if (typeof input !== 'number') throw 'Must be a integer';
        if (input in _keyCodeTable){
            return _keyCodeTable[input];
        }else if (65 <= input && input <= 90) {
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[input-65];
        }else if (48 <= input && input <= 57) {
            return '0123456789'[input-48];
        }
        return 'UNKNOWN';
    };
    
    var _keyCodeTable = {
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
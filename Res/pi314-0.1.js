/***************************************
* cychih's extension 0.1
* including additional method for array
* date:2012/07/25
****************************************/
(function () {
    ArrayExtension();
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
        if (input == undefined) return this.copy();
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
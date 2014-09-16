//startswith
pi314 = (function () {
return {
    set: function (i) {
        var o = {};
        var l = i.length;
        for (var a = 0; a < l; a++) {
            o[i[a]] = '';
        }
        return o;
    },
    ary_eq: function (a, b) {
        if (a.length != b.length) return false;
        var ret = true;
        for (var i = 0; i < a.length; i++) {
            ret = ret && (a[i] == b[i]);
        }
        return ret;
    },
    ary_lt: function (a, b) {
        if (a.length != b.length) return (a.length < b.length);
        var i = 0;
        while (a[i] == b[i]) {
            i += 1;
            if (i >= a.length) return false;
        }
        if (a[i] < b[i]) return true;
        return false;
    },
    ary_gt: function (a, b) {
        if (a.length != b.length) return (a.length > b.length);
        var i = 0;
        while (a[i] == b[i]) {
            i += 1;
            if (i >= a.length) return false;
        }
        if (a[i] > b[i]) return true;
        return false;
    },
    ary_ne: function (a, b) {
        if (a.length != b.length) return true;
        var ret = true;
        for (var i = 0; i < a.length; i++) {
            ret = ret && (a[i] != b[i]);
        }
        return ret;
    },
    ary_le: function (a, b) {
        if (a.length != b.length) return (a.length < b.length);
        var i = 0;
        while (a[i] == b[i]) {
            i += 1;
            if (i >= a.length) return true;
        }
        if (a[i] <= b[i]) return true;
        return false;
    },
    repeat: function (s, t) {
        return Array(t+1).join(s);
    },
};
})();

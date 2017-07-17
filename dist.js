var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define("Prng", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function make(seed, uint32) {
        if (seed === void 0) { seed = 42; }
        if (uint32 === void 0) { uint32 = false; }
        var kind = uint32 ? 'Uint32' : 'Native';
        var newData;
        if (kind === 'Native') {
            newData = { kind: kind, Qc: new Array(4097), i: 0 };
        }
        else {
            newData = { kind: kind, Qc: new Uint32Array(4097), i: 0 };
        }
        var Qc = newData.Qc;
        var c = seed;
        for (var i = 0; i < 4096; i++) {
            c *= 129749;
            c %= 0x100000000;
            c *= 8505;
            c += 12345;
            c %= 0x100000000;
            Qc[i] = c;
        }
        c *= 129749;
        c %= 0x100000000;
        c *= 8505;
        c += 12345;
        c %= 0x100000000;
        c %= 809430660;
        Qc[4096] = c;
        return newData;
    }
    exports.make = make;
    function nextChunk(data) {
        var kind = data.kind;
        var newData;
        if (kind === 'Native') {
            newData = { kind: kind, Qc: new Array(4097), i: 0 };
        }
        else {
            newData = { kind: kind, Qc: new Uint32Array(4097), i: 0 };
        }
        var Qc = newData.Qc;
        var prevQc = data.Qc;
        var c = prevQc[4096];
        for (var i = 0; i < 4096; i++) {
            var t = 18782 * prevQc[i] + c;
            c = (t / 4294967296) | 0;
            var x = (t + c) % 0x100000000;
            if (x < c) {
                x++;
                c++;
            }
            if (x === 0xffffffff) {
                c++;
                x = 0;
            }
            Qc[i] = 0xfffffffe - x;
            if (Qc[i] < 0) {
                Qc[i] += 0x100000000;
            }
        }
        Qc[4096] = c;
        return newData;
    }
    function rand(data) {
        return data.Qc[data.i];
    }
    exports.rand = rand;
    function random(data, min, max) {
        if (min === void 0) { min = 0.0; }
        if (max === void 0) { max = 1.0; }
        if (min >= max) {
            return min;
        }
        else {
            return min + (max - min) * (rand(data) / 4294967296.0);
        }
    }
    exports.random = random;
    function random64(data, min, max) {
        if (min === void 0) { min = 0.0; }
        if (max === void 0) { max = 1.0; }
        if (min > max) {
            return min;
        }
        else {
            var a = Math.floor(rand(data) / 32);
            var b = Math.floor((data.Qc[(data.i === 0) ? 4095 : data.i - 1]) / 64);
            return min + (a * 67108864.0 + b) * (max - min) / 9007199254740992.0;
        }
    }
    exports.random64 = random64;
    function next(data) {
        var i = data.i;
        if (i < 4095) {
            return __assign({}, data, { i: i + 1 });
        }
        else {
            return nextChunk(data);
        }
    }
    exports.next = next;
    var Prng = (function () {
        function Prng(seed, uint32) {
            if (seed === void 0) { seed = 42; }
            if (uint32 === void 0) { uint32 = true; }
            this.data = nextChunk(make(seed, uint32));
        }
        Prng.prototype.rand = function () {
            return rand(this.data);
        };
        Prng.prototype.random = function (min, max) {
            if (min === void 0) { min = 0.0; }
            if (max === void 0) { max = 1.0; }
            return random(this.data, min, max);
        };
        Prng.prototype.random64 = function (min, max) {
            if (min === void 0) { min = 0.0; }
            if (max === void 0) { max = 1.0; }
            return random64(this.data, min, max);
        };
        Prng.prototype.next = function () {
            var result = Object.create(Object.getPrototypeOf(this));
            result.data = next(this.data);
            return result;
        };
        return Prng;
    }());
    exports.Prng = Prng;
});
define("index", ["require", "exports", "Prng"], function (require, exports, Prng_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(Prng_1);
});

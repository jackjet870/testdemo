(function () {

    "use strict";

    function Empty() { }

    var slice = Array.prototype.slice,
        hasDontEnumBug = (function () {
            for (var key in { "toString": null }) { //eslint-disable-line no-unused-vars
                return false;
            }
            return true;
        })(),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        isFunc = function(val){
            return Object.prototype.toString.call(val) === "[object Function]";
        },
        isStr = function (target) {
            return Object.prototype.toString.call(target) === "[object String]";
        },
        isNum = function (target) {
            return Object.prototype.toString.call(target) === "[object Number]";
        },
        isNumeric = function (target) {
            //文字列か数値以外を弾く
            //["123"]などは先頭の値を利用されるため
            if (isStr(target) || isNum(target)) {
                return !isNaN(parseFloat(target)) && isFinite(target);
            }
            return false;
        };

    if (!Object.keys) {
        Object.keys = function (value) {
            var keys = [],
                i = 0, l = dontEnumsLength, dontEnum;

            if ((typeof value !== "object" && typeof value !== "function") || value === null) {
                throw new TypeError("Object.keys called on a non-object");
            }

            for (var key in value) {
                if (hasOwnProperty.call(value, key)) {
                    keys.push(key);
                }
            }

            if (hasDontEnumBug) {
                for (; i < l; i++) {
                    dontEnum = dontEnums[i];
                    if (hasOwnProperty.call(value, dontEnum)) {
                        keys.push(dontEnum);
                    }
                }
            }
            return keys;
        };

    }

    // Function#bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(context) { //eslint-disable-line no-extend-native
            var target = this,
                args = slice.call(arguments, 1),
                bound = function () {
                    if (this instanceof bound) {
                        var result = target.apply(
                            this,
                            args.concat(slice.call(arguments))
                        );
                        /*jshint newcap: false*/
                        if (Object(result) === result) {
                            return result;
                        }
                        return this;
                    } else {
                        return target.apply(
                            context,
                            args.concat(slice.call(arguments))
                        );
                    }

                };
            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                Empty.prototype = null;
            }
            return bound;
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(item, fromIndex) { //eslint-disable-line no-extend-native
            var self = this,
                i = 0, l;
            if (isNumeric(fromIndex)) {
                i = Math.max(0, parseInt(fromIndex, 10));
            }
            for (l = self.length; i < l; i++) {
                if (i in self && self[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function lastIndexOf(item, fromIndex) { //eslint-disable-line no-extend-native
            var self = this,
                start = fromIndex, l;

            if (arguments.length < 2) {
                start = self.length;
            }
            if (isNumeric(start)) {
                l = Math.max(Math.min(parseInt(start, 10) + 1, self.length), 0);
            }
            while (l--) {
                if (l in self && self[l] === item) {
                    return l;
                }
            }
            return -1;
        };
    }

    if (!Array.prototype.every) {
        Array.prototype.every = function (callback, context) { //eslint-disable-line no-extend-native
            var i, l,
                self = this;
            if (!isFunc(callback)) {
                throw new TypeError();
            }
            for (i = 0, l = self.length; i < l; i++) {
                if (i in self && !callback.call(context, self[i], i, self)) {
                    return false;
                }
            }
            return true;
        };
    }

    if (!Array.prototype.some) {
        Array.prototype.some = function (callback, context) { //eslint-disable-line no-extend-native
            var i, l,
                self = this;
            if (!isFunc(callback)) {
                throw new TypeError();
            }
            for (i = 0, l = self.length; i < l; i++) {
                if (i in self && callback.call(context, self[i], i, self)) {
                    return true;
                }
            }
            return false;
        };
    }

    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, context) { //eslint-disable-line no-extend-native
            var result = [],
                i, l,
                self = this;
            if (!isFunc(callback)) {
                throw new TypeError();
            }
            for (i = 0, l = self.length; i < l; i++) {
                if (i in self) {
                    result.push(callback.call(context, self[i], i, self));
                }
            }
            return result;
        };
    }

    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, initialValue) { //eslint-disable-line no-extend-native
            var value, i, l, self = this;
            if (!isFunc(callback)) {
                throw new TypeError();
            }
            i = 0;
            value = initialValue;
            if (arguments.length < 2) {
                i = 1;
                value = self[0];
            }
            for (l = self.length; i < l; i++) {
                value = callback(value, self[i], i, self);
            }
            return value;
        };
    }

    if (!Array.prototype.reduceRight) {
        Array.prototype.reduceRight = function (callback, initialValue) { //eslint-disable-line no-extend-native
            var value, l, self = this;
            if (!isFunc(callback)) {
                throw new TypeError();
            }
            l = self.length;
            value = initialValue;
            if (arguments.length < 2) {
                l--;
                value = self[l];
            }
            while (l--) {
                value = callback(value, self[l], l, self);
            }
            return value;
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (iterator, context) { //eslint-disable-line no-extend-native

            for (var i = 0, len = this.length; i < len; i++) {
                if (i in this) {
                    iterator.call(context, this[i], i, this);
                }
            }
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (callback, context) { //eslint-disable-line no-extend-native
            var self = this,
                i = 0, l = self.length,
                result = [], val;

            if (!isFunc(callback)) {
                throw new TypeError();
            }

            for (; i < l; i++) {
                if (i in self) {
                    val = self[i];
                    if (callback.call(context, val, i, self)) {
                        result.push(val);
                    }
                }
            }
            return result;
        };
    }

    if (!Date.now) {
        Date.now = function () {
            return new Date().getTime();
        };
    }

})();

/* global window */

/*
* Copyright(c) Archway Inc. All rights reserved.
*/

/// <reference path="shim.js" />

(function (global) {

    "use strict";

    var toString = Object.prototype.toString;

    /**
     * ArchPack.Js ライブラリのルートを定義します。
     * @global
     * @namespace
     */
    var App = {
        /**
         * 第１引数に指定された文字列に従ってドットで区切られた階層上にオブジェクトを定義します。
         * 第２引数に指定されているオブジェクトのプロパティを作成したオブジェクトのプロパティに設定します。
         * @param {string} name - 作成するnamespaceを表す . (dot) で区切られた文字列
         * @param {object} [props] - 作成するオブジェクトに設定するプロパティが定義されたオブジェクト
         * @param {object|function} [root] - 名前空間とオブジェクトを作成するルートオブジェクト。省略された場合はグローバルオブジェクト
         * @returns {object} 作成された名前空間に所属するオブジェクト
         * @example
         * console.log(typeof set === "undefined"); //true
         * var def = App.define("set.your.ns", { foo: "A", bar: 2 });
         * console.log(set.your.ns === def); //true
         */
        define: function (name, props, root) {
            if (!name) {
                return;
            } else {
                var parent = root || global,
                    names = name.split("."),
                    i = 0, l = names.length,
                    prop;
                for (; i < l; i++) {
                    parent = parent[names[i]] = parent[names[i]] || {};
                }
                if (props) {
                    for (prop in props) {
                        if (props.hasOwnProperty(prop)) {
                            parent[prop] = props[prop];
                        }
                    }
                }
                return parent;
            }
        },
        /**
         * 指定された値が {@link Object} 型かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} {@link Object} 型の場合は true 、そうでない場合は false
         */
        isObj: function (target) {
            return toString.call(target) === "[object Object]" &&
                typeof target !== "undefined" && target !== null;
        },
        /**
         * 指定された値が {@link String} 型かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} {@link String} 型の場合は true 、そうでない場合は false
         */
        isStr: function (target) {
            return toString.call(target) === "[object String]";
        },
        /**
         * 指定された値が {@link Number} 型かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} {@link Number} 型の場合は true 、そうでない場合は false
         */
        isNum: function (target) {
            return toString.call(target) === "[object Number]";
        },
        /**
         * 指定された値が {@link Boolean} 型かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} {@link Boolean} 型の場合は true 、そうでない場合は false
         */
        isBool: function (target) {
            return toString.call(target) === "[object Boolean]";
        },
        /**
         * 指定された値が {@link Date} 型かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} {@link Date} 型の場合は true 、そうでない場合は false
         */
        isDate: function (target) {
            return toString.call(target) === "[object Date]";
        },
        /**
         * 指定された値が {@link Function} 型かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} {@link Function} 型の場合は true 、そうでない場合は false
         */
        isFunc: function (target) {
            return toString.call(target) === "[object Function]";
        },
        /**
         * 指定された値が {@link Array} 型かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} {@link Array} 型の場合は true 、そうでない場合は false
         */
        isArray: function (target) {
            return toString.call(target) === "[object Array]";
        },
        /**
         * 指定された値が valid な {@link Date} 型の値かを確認します。
         * @param {Any} target 判定する値
         * @return {Boolean} {@link Date} 型で valid な場合は true 、そうでない場合は false
         */
        isValidDate: function (target) {
            if (App.isDate(target)) {
                return !isNaN(target.getTime());
            }
            return false;
        },
        /**
         * 指定された値が {@link RegExp}  型かどうかを確認します。
         * @param {Any} target 判定する値
         * @return {Boolean} {@link RegExp} 型の場合は true 、そうでない場合は false
         */
        isRegExp: function (target) {
            return toString.call(target) === "[object RegExp]";
        },
        /**
         * 指定された値が undefined かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} undefined の場合は true 、そうでない場合は false
         */
        isUndef: function (target) {
            if(arguments.length === 0) {
                return false;
            }
            return typeof target === "undefined";
        },
        /**
         * 指定された値が null かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} null の場合は true 、そうでない場合は false
         */
        isNull: function (target) {
            return target === null;
        },
        /**
         * 指定された値が null もしくは undefined かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} null もしくは undefined の場合は true 、そうでない場合は false
         */
        isUndefOrNull: function (target) {
            if(arguments.length === 0){
                return false;
            }
            return (this.isUndef(target) || this.isNull(target));
        },
        /**
         * 指定された値が 利用可能でないかどうかを判断します。
         * @param {Any} target 判定する値
         * @return {Boolean} 利用不可能な場合は true 、そうでない場合は false
         */
        isUnusable: function (target) {
            if(arguments.length === 0){
                return false;
            }
            return App.isUndef(target) || App.isNull(target) ||
                   (App.isNum(target) ? isNaN(target) || !isFinite(target) :
                   (App.isDate(target) ? !App.isValidDate(target) : false));
        },
        /**
         * 指定された値が 数字 かどうかを確認します。
         * @param {Any} target - 判定する値
         * @return {boolean} 数字の場合は true 、そうでない場合は false
         */
        isNumeric: function (target) {
            //文字列か数値以外を弾く
            //["123"]などは先頭の値を利用されるため
            if (App.isStr(target) || App.isNum(target)) {
                return !isNaN(parseFloat(target)) && isFinite(target);
            }
            return false;
        },
        /**
         * 指定された値が undefined かどうかによって戻す値を判断します。
         * @param {Any} target 判定する値
         * @param {Any} def undefined の場合に戻す値
         * @return {Any} undefinedの場合は def 、そうでない場合は target </returns>
         */
        ifUndef: function (target, def) {
            return App.isUndef(target) ? def : target;
        },
        /**
         * 指定された値が null かどうかによって戻す値を判断します。
         * @param {Any} target 判定する値
         * @param {Any} def null の場合に戻す値
         * @return {Any} nullの場合は def 、そうでない場合は target
         */
        ifNull: function (target, def) {
            return App.ifNull(target) ? def : target;
        },
        /**
         * 指定された値が 利用可能かどうかによって戻す値を判断します。
         * @param {Any} target 判定する値
         * @param {Any} def 利用不可能な場合に戻す値
         * @return {Any}  利用不可能な場合は def 、そうでない場合は target
         */
        ifUnusable: function (target, def) {
            return App.isUnusable(target) ? def : target;
        },
        /**
         * 指定された値が undefined もしくは null かどうかによって戻す値を判断します。
         * @param {Any} target 判定する値
         * @param {Any} def undefined もしくは null の場合に戻す値
         * @return {Any}   undefined もしくは null の場合は def 、そうでない場合は target
         */
        ifUndefOrNull: function (target, def) {
            return (App.isUndef(target) || App.isNull(target)) ? def : target;
        },
        /**
         * 何も起こらない空の関数を取得します。
         */
        noop: function(){}
    };
    global.App = App;
})(window || this);

/*global App */

/// <reference path="base.js" />

(function(global, App){

    "use strict";

    var STATE_PENDING = 0;
    var STATE_FULFILLED = 1;
    var STATE_REJECTED = 2;

    function isThenable(value){
        return App.isFunc((value || {}).then);
    }

    function execute(callback, value){
        var that = this;
        if(!App.isFunc(callback)){
            return;
        }
        (global.setImmediate || global.setTimeout)(function(){
            callback.call(that, value);
        }, 0);
    }

    function fulfilled(value){
        var that = this,
            children = that._children || [],
            i = 0, l = children.length;

        if(that._state) {
            return;
        }
        that._state = STATE_FULFILLED;
        that._result = value;

        for(; i < l; i++) {
            execute.call(children[i], children[i].fulfill, value);
        }
        that._children = [];
    }

    function rejected(value){
        var that = this,
            children = that._children || [],
            i = 0, l = children.length;

        if(that._state) {
            return;
        }
        that._state = STATE_REJECTED;
        that._result = value;

        for(; i < l; i++){
            execute.call(children[i], children[i].reject, value);
        }
        that._children = [];
    }

    function ChildThenable(onFulfilled, onRejected){
        this._onFulfilled = onFulfilled;
        this._onRejected = onRejected;
        /*eslint-disable no-use-before-define */
        this._innerThenable = new Thenable(this.resolver.bind(this));
        /*eslint-enable no-use-before-define */
    }

    ChildThenable.prototype.resolver = function(onFulfilled, onRejected){
        this._innerThenableFulfill = onFulfilled;
        this._innerThenableReject = onRejected;
    };

    ChildThenable.prototype.fulfill = function(value){
        var result = value,
            that = this;
        if(!App.isFunc(this._onFulfilled)){
            return;
        }
        try{
            result = that._onFulfilled.call(null, result);
            if(isThenable(result)){
                result.then(function(thenRes){
                    that._innerThenableFulfill(thenRes);
                }, function(thenRes){
                    that._innerThenableReject(thenRes);
                });
            }else{
                that._innerThenableFulfill(result);
            }
        }catch(e){
            this._innerThenableReject(e);
        }
    };

    ChildThenable.prototype.reject = function(value){
        var result = value,
            that = this;

        if (this._onRejected) {
            try{
                result = this._onRejected.call(null, result);
                if(isThenable(result)){
                    result.then(function(thenRes){
                        that._innerThenableFulfill(thenRes);
                    }, function(thenRes){
                        that._innerThenableReject(thenRes);
                    });
                }else{
                    this._innerThenableFulfill(result);
                }
                return;
            }catch(e){
                result = e;
            }
        }
        this._innerThenableReject(result);
    };

    ChildThenable.prototype.thenable = function(){
        return this._innerThenable;
    };

    function Thenable(callback){
        var that = this;
        this._state = STATE_PENDING;
        this._children = [];

        try{
            callback.call(that, fulfilled.bind(that), rejected.bind(that));
        }catch(e){
            rejected.call(that, e);
        }
    }

    Thenable.prototype.then = function(onFulfilled, onRejected){
        var that = this,
            child = new ChildThenable(onFulfilled, onRejected);

        if(!that._state){
            this._children.push(child);
        }else{
            execute.call(child, (that._state === STATE_FULFILLED ? child.fulfill : child.reject), that._result);
        }
        return child.thenable();
    };

    App.thenable = function(callback){
        var cb = App.isFunc(callback) ? callback : App.noop;
        return new Thenable(cb);
    };

})(this, App);

/*global App */

///<reference path="base.js" />
/// <reference path="thenable.js" />

(function (global, App) {

    "use strict";

    var customMaybePromise;

    function maybePromise(callback) {
        if (App.isFunc(customMaybePromise)) {
            return customMaybePromise(callback);
        }
        return App.thenable(callback);
    }

    function prepare(value) {
        var p,
            isArray = App.isArray(value.successes);

        value.key = {
            successes: [],
            fails: []
        };
        for (p in value.successes) {
            if (value.successes.hasOwnProperty(p)) {
                value.key.successes.push(isArray ? parseInt(p, 10) : p);
            }
        }
        for (p in value.fails) {
            if (value.fails.hasOwnProperty(p)) {
                value.key.fails.push(isArray ? parseInt(p, 10) : p);
            }
        }
        return value;
    }

    function getTimeout(wait) {
        if (App.isNum(wait) && wait > 0) {
            return global.setTimeout;
        } else {
            return global.setImmediate || global.setTimeout;
        }
    }

    function hasThen(value) {
        return App.isFunc((value || {}).then);
    }

    function each(value, callback) {
        var i, length;
        if (App.isUnusable(value)) {
            return;
        }
        if (App.isArray(value)) {
            length = value.length;
            for (i = 0; i < length; i++) {
                callback(i, value[i]);
            }
        } else {
            for (i in value) {
                if (!value.hasOwnProperty(i)) {
                    continue;
                }
                callback(i, value[i]);
            }
        }
    }

    App.async = {
        /**
        * jQuery Promise を利用して、指定された value を結果値とした非同期処理を実行します。
        * value が関数の場合は、関数の戻り値が結果値として利用されます。
        * また value の値または value に指定した関数の戻りの値が jQuery Promise の場合は、
        * その jQuery Promise の結果を待ちます。
        */
        //wrap: wrap,
        /**
        * jQuery Promise を利用して引数で指定した時間待機します。
        */
        timeout: function (wait) {
            var time = Math.max(App.isNum(wait) ? wait : 0, 0);
            return maybePromise(function (fulfill) {
                getTimeout(time)(function () {
                    fulfill();
                }, time);
            });
        },
        success: function (value, wait) {
            var time = Math.max(App.isNum(wait) ? wait : 0, 0);
            return maybePromise(function (fulfill, reject) {

                getTimeout(time)(function () {
                    if (hasThen(value)) {
                        try {
                            value.then(fulfill, reject);
                        } catch (e) {
                            reject(e);
                        }
                        return;
                    }
                    if (App.isFunc(value)) {
                        try {
                            value = value();
                            fulfill(value);
                        } catch (e) {
                            reject(e);
                        }
                        return;
                    }
                    fulfill(value);
                }, time);
            });
        },
        fail: function (value, wait) {
            var time = Math.max(App.isNum(wait) ? wait : 0, 0);
            return maybePromise(function (fulfill, reject) {
                getTimeout(time)(function () {
                    if (App.isFunc(value)) {
                        try {
                            value = value();
                            reject(value);
                        } catch (e) {
                            reject(e);
                        }
                        return;
                    }
                    reject(value);
                }, time);
            });
        },
        all: function (args) {
            if (arguments.length > 1) {
                args = Array.prototype.slice.call(arguments);
            }
            return maybePromise(function (fulfill, reject) {
                var deferreds = App.isArray(args) ? [] : {},
                    result = {
                        successes: App.isArray(args) ? [] : {},
                        fails: App.isArray(args) ? [] : {}
                    },
                    hasReject = false,
                    remaining = 0,
                    updateDeferreds = function (value, key, isResolve) {
                        var res = isResolve ? result.successes : result.fails;
                        hasReject = hasReject ? true : (isResolve ? false : true);
                        res[key] = value;
                        if (!(--remaining)) {
                            if (hasReject) {
                                reject(prepare(result));
                            } else {
                                fulfill(prepare(result));
                            }
                        }
                    };
                each(args, function (key, item) {
                    remaining++;
                    deferreds[key] = App.async.success(item);
                });
                if (remaining > 0) {
                    each(deferreds, function (key, item) {
                        item.then(function (value) {
                            updateDeferreds(value, key, true);
                        }, function (value) {
                            updateDeferreds(value, key, false);
                        });
                    });
                } else {
                    fulfill({
                        successes: {},
                        fails: {},
                        key: {
                            successes: [],
                            fails: []
                        }
                    });
                }
            });
        }
    };
    /**
    * validationメソッドの戻り値のPromiseを設定します。
    */
    App.async.setReturnPromise = function (promise) {
        customMaybePromise = promise;
    };
})(window, App);

/* global App */

/// <reference path="base.js" />

//obj
(function (global, App) {

    "use strict";

    var takeArg = function (args, count) {
        var ary = Array.prototype.slice.call(args),
            i = 0, l = count, al = ary.length;
        for (; i < l && i < al; i++) {
            ary.shift();
        }
        return ary;
    },
        map = function (target, callback, deep) {
            var isProcTarget = function (value, dep) {
                return (App.isObj(value) || App.isArray(value)) && dep;
            },
                mapFunc = function (value, cb, dep) {
                    var i, l, val = value, result;
                    if (App.isArray(value)) {
                        result = [];
                        for (i = 0, l = value.length; i < l; i++) {
                            val = value[i];
                            if (isProcTarget(val, dep)) {
                                val = mapFunc(val, cb, dep);
                            } else {
                                val = cb(val, i, value);
                            }
                            result.push(val);
                        }
                        return result;
                    } else if (App.isObj(value)) {
                        result = {};
                        for (i in value) {
                            if (!value.hasOwnProperty(i)) {
                                continue;
                            }
                            val = value[i];
                            if (isProcTarget(val, dep)) {
                                val = mapFunc(val, cb, dep);
                            } else {
                                val = cb(val, i, value);
                            }
                            result[i] = val;
                        }
                        return result;
                    }
                    return val;
                };
            if (!App.isObj(target) && !App.isArray(target)) {
                return target;
            }
            return mapFunc(target, callback, deep);
        };

    App.obj = {
        /**
         * 指定されたオブジェクトから指定されたプロパティのみ含んだ新しいオブジェクトを返します。
         * @param {Object} target - 抽出元のオブジェクト
         * @param {...String} args - 抽出するプロパティの可変長引数
         * @return {Object} 抽出されたプロパティを持つオブジェクト
         * @example
         * var source = {
         *     name: "John", age: 1, address: "kyoto"
         * };
         * var picked = App.obj.pick(source, "name", "age");
         * console.log(picked); // {name: "John", age: 1}
         */
        pick: function (target) {
            var result = {},
                props = takeArg(arguments, 1), prop, i, l;
            if (!App.isObj(target)) {
                return;
            }
            for (i = 0, l = props.length; i < l; i++) {
                prop = props[i];
                if (prop in target) {
                    result[prop] = target[prop];
                }
            }
            return result;
        },
        /**
         * 指定されたオブジェクトから指定されたプロパティを除外した新しいオブジェクトを返します。
         * @param {Object} target - 除外元のオブジェクト
         * @param {...String} args - 除外するプロパティの可変長引数
         * @return {Object} 除外されたプロパティを含まないオブジェクト
         * @example
         * var source = {
         *     name: "John", age: 1, address: "kyoto"
         * };
         * var omitted = App.obj.omit(source, "name", "age");
         * console.log(omitted); // {address: "kyoto"}
         */
        omit: function (target) {
            var result = {},
                props = takeArg(arguments, 1), i, l, keys;
            if (!App.isObj(target)) {
                return;
            }
            keys = Object.keys(target);
            for (i = 0, l = keys.length; i < l; i++) {
                if (props.indexOf(keys[i]) < 0) {
                    result[keys[i]] = target[keys[i]];
                }
            }
            return result;
        },
        /**
         * 指定されたオブジェクトに第2引数以降で指定されたオブジェクトのプロパティが含まれない場合に、そのプロパティと値を設定します。
         * @param {Object} target - 追加元のオブジェクト
         * @param {...Object} args - 追加するプロパティを含むオブジェクトの可変長引数
         * @return {Object} 追加されたプロパティを含むオブジェクト
         * @example
         * var value = {a: 1, b: "2"}
         * App.obj.defaults(value, {
         *   a: 2,
         *   b: "3",
         *   c: true
         * }, {
         *   b: 4
         *   c: false,
         *   d: "123"
         * });
         * //{a:1, b:"2", c:true, d: "123"}
         */
        defaults: function (target) {
            var i, l, val, p;
            for (i = 1, l = arguments.length; i < l; i++) {
                val = arguments[i];
                if (val) {
                    for (p in val) {
                        if (!(p in target) && val.hasOwnProperty(p)) {
                            target[p] = val[p];
                        }
                    }
                }

            }
            return target;
        },
        /**
         * 指定されたオブジェクトに第2引数以降で指定されたオブジェクトのプロパティの値を上書きします。
         * @param {Object} target - 上書き先のオブジェクト
         * @param {...Object} args - 上書きするプロパティを含むオブジェクトの可変長引数
         * @return {Object} 上書きされたプロパティを含むオブジェクト
         * @example
         * var value = {a: 1, b: "2", e: "3"}
         * App.obj.mixin(value, {
         *   a: 2,
         *   b: "3",
         *   c: true
         * }, {
         *   b: 4
         *   d: "123"
         * });
         * //{a:2, b:4, c:true, d: "123", e: "3"}
         */
        mixin: function () {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length;

            if (typeof target !== "object" && !App.isFunc(target)) {
                target = {};
            }

            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        }
                        if (copy && (App.isObj(copy) || (copyIsArray = App.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && App.isArray(src) ? src : [];
                            } else {
                                clone = src && App.isObj(src) ? src : {};
                            }
                            target[name] = App.obj.mixin(clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        },
        /**
         * 指定されたオブジェクトのキーの値を別の値に変換します。
         * @param {Object} target - 変換するプロパティをもつオブジェクト
         * @param {Function} callback - 変換を実行するコールバック関数 (value: any, key: string, source: any) => any
         * @param {Boolean} deep? - オブジェクト階層をたどるかどうかの指定
         * @return {Object} 変換された値をもつオブジェクト
         * @example
         * var value = {a: 1, b: "2", c: 3}
         * var result App.obj.map(value, function(item) {
         *   return item + 1;
         * });
         * console.log(result) //{a:2, b:"21", c:4}
         */
        map: map,

        values: function (target) {
            var keys = Object.keys(target),
                i = 0, l = keys.length,
                results = [];
            for (; i < l; i++) {
                results.push(target[keys[i]]);
            }
            return results;
        }
    };

})(this, App);

/*global App */
/// <reference path="base.js" />
/// <reference path="obj.js" />

//culture
(function (global, App) {

    "use strict";

    var defaultCulture = {
        "name": "",
        "engName": "Invariant Language (Invariant Country)",
        "lang": "iv",
        "dateTimeFormat": {
            "months": {
                "shortNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                "names": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""]
            },
            "weekdays": {
                "shortNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "names": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            "meridiem": {
                "ante": "AM",
                "post": "PM"
            },
            "patterns": {
                "d": "MM/dd/yyyy",
                "D": "dddd, dd MMMM yyyy",
                "t": "HH:mm",
                "T": "HH:mm:ss",
                "f": "dddd, dd MMMM yyyy HH:mm",
                "F": "dddd, dd MMMM yyyy HH:mm:ss",
                "M": "MMMM dd",
                "S": "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                "Y": "yyyy MMMM"
            },
            "dateSep": "/",
            "timeSep": ":",
            "twoDigitYearMax": 2029,
            "named": {
                "date": "yyyy/MM/dd",
                "month": "yyyy/MM",
                "time": "hh:mm"
            }
        },
        "numberFormat": {
            "decDigits": 2,
            "groupSep": ",",
            "decSep": ".",
            "groupSizes": [
                3
            ],
            "pattern": {
                "pos": "n",
                "neg": "-n"
            },
            "posSign": "+",
            "negSign": "-",
            "posInfSymbol": "Infinity",
            "negInfSymbol": "-Infinity",
            "nanSymbol": "NaN",
            "currency": {
                "symbol": "¤",
                "decDigits": 2,
                "groupSep": ",",
                "decSep": ".",
                "groupSizes": [
                    3
                ],
                "pattern": {
                    "pos": "$n",
                    "neg": "($n)"
                }
            },
            "percent": {
                "symbol": "%",
                "permilleSynbol": "‰",
                "decDigits": 2,
                "groupSep": ",",
                "decSep": ".",
                "groupSizes": [
                    3
                ],
                "pattern": {
                    "pos": "n %",
                    "neg": "-n %"
                }
            },
            "named": {
                "currency": "#,##0",
                "number": "#",
                "decimal": "#.00"
            }
        },
        text: {}
    },
        currentCulture = "",
        cultures = {};

    App.culture = function () {
        var args = Array.prototype.slice.call(arguments),
            target;
        if (args.length === 0) {
            return cultures[currentCulture];
        }
        if (args.length === 1) {
            return cultures[args[0]];
        }
        if (args.length > 1) {
            target = cultures[args[0]] || {};
            target = App.obj.mixin(true, {}, defaultCulture, target, args[1]);
            target.name = args[0];
            cultures[args[0]] = target;
            return target;
        }
    };

    App.culture.current = function () {
        var args = Array.prototype.slice.call(arguments);
        if (args.length > 0) {
            if (args[0] in cultures) {
                currentCulture = args[0];
            }
        }
        return cultures[currentCulture];
    };

    App.culture(currentCulture, defaultCulture);

})(this, App);

/*global App */

/// <reference path="base.js" />
/// <reference path="culture.js" />

//string
(function (global, App) {

    "use strict";

    var isStr = App.isStr;

    function repeat(target, count) {
        if (!App.isStr(target)) {
            return;
        }
        if (App.isNumeric(count)) {
            count = parseInt(count, 10);
        }
        count = App.isNum(count) ? count < 0 ? 0 : Math.floor(count) : 0;
        if (count === 0) {
            return "";
        }
        return (new Array(count + 1)).join(target);
    }

    function escapeRegExp(target) {
        if (!isStr(target)) {
            target = target + "";
        }
        return target.replace(/([\\/'*+?|()\[\]{}.^$])/g, "\\$1"); //eslint-disable-line no-irregular-whitespace
    }

    function startsWith(target, value, ignoreCase) {
        if (!isStr(target)) {
            return;
        }
        var source = App.isRegExp(value) ? value.source : escapeRegExp(value);
        ignoreCase = !App.isUndef(ignoreCase) ? !!ignoreCase :
                     App.isRegExp(value) ? value.ignoreCase : false;
        source = (source.charAt(0) === "^" ? "" : "^") + source;
        return RegExp(source, ignoreCase ? "i" : "").test(target);
    }

    function endsWith(target, value, ignoreCase) {
        if (!isStr(target)) {
            return;
        }
        var source = App.isRegExp(value) ? value.source : escapeRegExp(value);
        ignoreCase = !App.isUndef(ignoreCase) ? !!ignoreCase :
            App.isRegExp(value) ? value.ignoreCase : false;
        source = source + (source.charAt(source.length - 1) === "$" ? "" : "$");
        return RegExp(source, ignoreCase ? "i" : "").test(target);
    }

    App.str = {
        /**
        * 第1引数に指定された文字列のプレースホルダーを第2引数以降に指定された値で置き換えます。
        * example:
        * プレースホルダーがインデックスの数値の場合は、第2引数を0として開始した引数に指定された値を利用
        * App.str.format("{0} to {1}", 1, 10); // "1 to 10"
        * プレースホルダーが名称の場合は、第2引数に指定された値のプロパティに設定された値を利用
        * App.str.format("{min} to {max}", {min: 10, max: 20}); // "10 to 20"
        */
        format: function (target) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();

            if (!target) {
                return target;
            }
            if (args.length === 0) {
                return target;
            }

            return target.toString().replace(/\{?\{(.+?)\}\}?/g, function (match, arg1) {
                var val, splitPos, prop, rootProp,
                    param = arg1;
                if (match.substr(0, 2) === "{{" && match.substr(match.length - 2) === "}}") {
                    return match.replace("{{", "{").replace("}}", "}");
                }

                splitPos = Math.min(param.indexOf(".") === -1 ? param.length : param.indexOf("."),
                    param.indexOf("[") === -1 ? param.length : param.indexOf("["));
                if (splitPos < param.length) {
                    rootProp = param.substr(0, splitPos);
                    prop = "['" + param.substr(0, splitPos) + "']" + param.substr(splitPos);
                } else {
                    rootProp = param;
                    prop = "['" + param + "']";
                }
                /*eslint-disable no-new-func */
                val = (new Function("return arguments[0]" + prop + ";"))(App.isNumeric(rootProp) ?
                    ((App.isArray(args[0]) && args.length === 1) ? args[0] : args) :
                    args[0]);
                /*eslint-enable no-new-func */
                val = App.isUndef(val) ? "" : (val + "");
                if (match.substr(0, 2) === "{{") {
                    val = "{" + val;
                }
                if (match.substr(match.length - 2) === "}}") {
                    val = val + "}";
                }
                return val;
            });
        },
        text: function (key) {
            var def = App.culture.current().text || {},
                text = (function (keyStr) {
                    var keyVals = keyStr.split("."),
                        i = 0, l = keyVals.length, keyVal, val = def;

                    for (; i < l; i++) {
                        keyVal = keyVals[i];
                        val = val[keyVal];
                        if (!val) {
                            return "";
                        }
                    }
                    return val || "";
                })(key || ""),
                args;
            if (arguments.length === 1) {
                return text;
            }
            args = Array.prototype.slice.call(arguments);
            args.shift();
            args.unshift(text);
            return App.str.format.apply(null, args);
        },
        repeat: repeat,
        clipRight: function (target, length) {
            if (!isStr(target)){
                return;
            }
            length = App.isNum(length) ? length < 0 ? 0 : length : 0;
            if (target.length <= length){
                return target;
            }
            return target.substring(target.length - length, target.length);
        },
        clipLeft: function (target, length) {
            if (!isStr(target)) {
                return;
            }
            length = App.isNum(length) ? length < 0 ? 0 : length : 0;
            if (target.length <= length) {
                return target;
            }
            return target.substr(0, length);
        },
        padLeft: function (target, length, padChars) {
            if (!isStr(target)) {
                return;
            }
            if (!App.isNum(length) && App.isNumeric(length)) {
                length = parseInt(length, 10);
            }
            length = App.isNum(length) ? length < 0 ? 0 : Math.floor(length) : 0;
            if (App.isUndef(padChars) || App.isNull(padChars)) {
                padChars = " ";
            }
            var margin = length - target.length;
            if (margin < 1) {
                return target;
            }
            var paddingChars = repeat(padChars.toString(), margin);
            return paddingChars.substr(0, margin) + target;
        },
        padRight: function (target, length, padChars) {
            if (!isStr(target)) {
                return;
            }
            if (!App.isNum(length) && App.isNumeric(length)) {
                length = parseInt(length, 10);
            }
            length = App.isNum(length) ? length < 0 ? 0 : Math.floor(length) : 0;
            if (App.isUndef(padChars) || App.isNull(padChars)) {
                padChars = " ";
            }
            var margin = length - target.length;
            if (margin < 1) {
                return target;
            }
            var paddingChars = repeat(padChars.toString(), margin);
            return target + paddingChars.substr(0, margin);
        },
        trimLeft: function (target) {
            if (!isStr(target)) {
                return;
            }
            return target.replace(/^[\s　]+/, ""); //eslint-disable-line no-irregular-whitespace
        },
        trimRight: function (target) {
            if (!isStr(target)) {
                return;
            }
            return target.replace(/[\s　]+$/, ""); //eslint-disable-line no-irregular-whitespace
        },
        trim: function (target) {
            if (!isStr(target)) {
                return;
            }
            return target.replace(/^[\s　]+|[\s　]+$/g, ""); //eslint-disable-line no-irregular-whitespace
        },
        escapeRegExp: escapeRegExp,
        startsWith: startsWith,
        endsWith: endsWith,
        surroundsWith: function(target, start, end, ignoreCase) {
            if (!isStr(target)) {
                return;
            }
            start = App.ifUndefOrNull(start, "");
            if (arguments.length === 3 && App.isBool(end)) {
                ignoreCase = end;
                end = void 0;
            }
            end = App.ifUndefOrNull(end, start);
            if(start.length + end.length > target.length){
                return false;
            }
            return startsWith(target, start, ignoreCase) && endsWith(target, end, ignoreCase);
        },
        surrounds: function(target, start, end, force) {
            var normalize = function (val) {
                if (App.isUndefOrNull(val)) {
                    val = "";
                }
                return val.toString();
            };
            if (!isStr(target)){
                return;
            }
            start = normalize(start);
            if (arguments.length === 4) {
                end = normalize(end);
                force = !!force;
            } else if (arguments.length === 3) {
                if (App.isBool(end)) {
                    force = !!end;
                    end = start;
                } else {
                    force = false;
                    end = normalize(end);
                }
            } else if (arguments.length <= 2) {
                end = start;
                force = false;
            }
            if (startsWith(target, start) && !force) {
                start = "";
            }
            if (endsWith(target, end) && !force) {
                end = "";
            }
            return start + target + end;
        }
    };
})(this, App);

/*global App */

/// <reference path="base.js" />

(function (global, App) {

    "use strict";

    function getTargetCalendarDefinition(definitions, target) {
        var i = definitions.length - 1, def, targetDef;
        for (; (i + 1); --i) {
            def = definitions[i];
            if (def.start <= target) {
                targetDef = def;
                break;
            }
        }
        if (targetDef) {
            return targetDef;
        }
    }

    function prepareDefitions(definitions) {
        var defs = App.isArray(definitions) ? definitions :
            !definitions ? [] : [definitions];

        return defs.map(function (item) {
            if (!App.isDate(item.start)) {
                item.start = new Date(1, 0, 1, 0, 0, 0, 0);
            }
            return {
                era: item.era || "",
                shortEra: item.shortEra || "",
                middleEra: item.middleEra || item.shortEra || "",
                start: new Date(item.start.getTime()),
                maxYearLength: App.isNum(item.maxYearLength) ?
                    Math.max(item.maxYearLength, 0) : undefined
            };

        });
    }

    App.calendar = {
        create: function (name, definition) {
            //clone
            var defs = prepareDefitions(definition);
            var result = {

                getShortEra: function (target) {
                    var def = getTargetCalendarDefinition(defs, target);
                    if (def) {
                        return def.shortEra;
                    }
                },
                getMiddleEra: function (target) {
                    var def = getTargetCalendarDefinition(defs, target);
                    if (def) {
                        return def.middleEra;
                    }
                },
                getEra: function (target) {
                    var def = getTargetCalendarDefinition(defs, target);
                    if (def) {
                        return def.era;
                    }
                },
                getYear: function (target) {
                    var def = getTargetCalendarDefinition(defs, target);
                    if (def) {
                        return target.getFullYear() - def.start.getFullYear() + 1;
                    }
                },
                getEraInfo: function (target) {
                    var def = getTargetCalendarDefinition(defs, target);
                    if (def) {
                        return {
                            shortEra: def.shortEra,
                            middleEra: def.middleEra,
                            era: def.era,
                            year: target.getFullYear() - def.start.getFullYear() + 1,
                            start: new Date(def.start.getTime()),
                            maxYearLength: def.maxYearLength
                        };
                    }
                },
                getEras: function () {
                    return defs.map(function (item) {
                        return {
                            era: item.era,
                            shortEra: item.shortEra,
                            middleEra: item.middleEra,
                            start: new Date(item.start.getTime()),
                            maxYearLength: item.maxYearLength
                        };
                    });
                }
            };
            App.calendar[name] = function () {
                return result;
            };
            return result;
        }
    };

    App.calendar.create("gregorianCalendar", [
        {
            era: "A.D.",
            shortEra: "AD",
            start: new Date(1, 0, 1, 0, 0, 0, 0)
        }
    ]);
})(this, App);

(function (global, App) {

    "use strict";

    App.calendar.create("japaneseCalendar", [{
        era: "明治",
        middleEra: "明",
        shortEra: "M",
        start: new Date(1868, 0, 1, 0, 0, 0, 0),
        maxYearLength: 2
    }, {
            era: "大正",
            middleEra: "大",
            shortEra: "T",
            start: new Date(1912, 6, 30, 0, 0, 0, 0),
            maxYearLength: 2
        }, {
            era: "昭和",
            middleEra: "昭",
            shortEra: "S",
            start: new Date(1926, 11, 25, 0, 0, 0, 0),
            maxYearLength: 2
        }, {
            era: "平成",
            middleEra: "平",
            shortEra: "H",
            start: new Date(1989, 0, 8, 0, 0, 0, 0),
            maxYearLength: 2
        }]);

})(this, App);

/*global App */
/// <reference path="base.js" />
/// <reference path="culture.js" />
/// <reference path="str.js" />
/// <reference path="calendar.js" />

//date
(function (global, App) {

    "use strict";

    var defaultCalendar = App.calendar.gregorianCalendar(),
        proto = Date.prototype,
        getFullYear = proto.getFullYear,
        getMonth = proto.getMonth,
        getDate = proto.getDate,
        getHours = proto.getHours,
        getMinutes = proto.getMinutes,
        getSeconds = proto.getSeconds,
        getMilliseconds = proto.getMilliseconds,
        getTime = proto.getTime,
        getDay = proto.getDay,
        getUTCFullYear = proto.getUTCFullYear,
        getUTCMonth = proto.getUTCMonth,
        getUTCDate = proto.getUTCDate,
        getUTCHours = proto.getUTCHours,
        getUTCMinutes = proto.getUTCMinutes,
        getUTCSeconds = proto.getUTCSeconds,
        getUTCMilliseconds = proto.getUTCMilliseconds,
        getUTCDay = proto.getUTCDay,
        getTimezoneOffset = proto.getTimezoneOffset,
        setFullYear = proto.setFullYear,
        setMonth = proto.setMonth,
        setDate = proto.setDate,
        setHours = proto.setHours,
        setMinutes = proto.setMinutes,
        setSeconds = proto.setSeconds,
        setMilliseconds = proto.setMilliseconds,
        //setTime = proto.setTime,
        unitYear = "Year", unitMonth = "Month", unitDate = "Date",
        unitHour = "Hours", unitMinute = "Minutes", unitSecond = "Seconds", unitMillSecond = "Milliseconds",
        unitWeek = "Week", unitTime = "Time",
        diff = function (target, unit, value) {
            if (App.isValidDate(target) && App.isStr(unit) && App.isValidDate(value)) {
                var fromTime = target.getTime(), toTime = value.getTime(),
                    difference = toTime - fromTime;
                if (unit === unitMillSecond) {
                    difference = difference / 1;
                } else if (unit === unitSecond) {
                    difference = difference / 1000;
                } else if (unit === unitMinute) {
                    difference = difference / (1000 * 60);
                } else if (unit === unitHour) {
                    difference = difference / (1000 * 60 * 60);
                } else if (unit === unitDate) {
                    difference = difference / (1000 * 60 * 60 * 24);
                } else if (unit === unitWeek) {
                    difference = difference / (1000 * 60 * 60 * 24 * 7);
                } else if (unit === unitMonth) {
                    difference = ((value.getFullYear() - target.getFullYear()) * 12) - target.getMonth() + value.getMonth();
                } else if (unit === unitYear) {
                    difference = value.getFullYear() - target.getFullYear();
                }
                return Math.floor(difference);
            }
        },
        add = function (target, unit, value) {
            var result;
            if (App.isValidDate(target) && App.isStr(unit) && App.isNumeric(value)) {
                var firstDayInMonth, addend;

                result = new Date(target.getTime());
                firstDayInMonth = new Date(getFullYear.call(result), getMonth.call(result), 1);
                addend = parseInt(value, 10);

                if (unit === unitYear) {
                    unit = "FullYear";
                }
                if (unit === unitWeek) {
                    setDate.call(result, getDate.call(result) + (addend * 7));
                } else {
                    result["set" + unit](result["get" + unit]() + addend);
                    if (unit === unitMonth) {
                        setMonth.call(firstDayInMonth, getMonth.call(firstDayInMonth) + addend);
                        if (getMonth.call(firstDayInMonth) !== getMonth.call(result)) {
                            setDate.call(result, 0);
                        }
                    }
                }
            }
            return result;
        },
        dayOf = function (target, unit, start) {
            if (App.isValidDate(target) && App.isStr(unit)) {
                var newYear,
                    diffDays;
                if (unit === unitYear) {
                    newYear = new Date(getFullYear.call(target), 0, 1);
                    return Math.floor((getTime.call(target) - getTime.call(newYear)) / (24 * 60 * 60 * 1000)) + 1;
                }
                if (unit === unitMonth) {
                    return getDate.call(target);
                }
                if (unit === unitWeek) {
                    start = App.isNumeric(start) ?
                        Math.max(0, Math.min(parseInt(start, 10), 7)) : 0;
                    diffDays = target.getDay() - start;
                    return diffDays < 0 ? 7 + diffDays :
                        diffDays > 6 ? diffDays - 6 :
                            diffDays;
                }
            }
        },
        startOf = function (target, unit, start) {
            var result;
            if (App.isValidDate(target) && App.isStr(unit)) {
                var dayOfWeek = 0,
                    diffDays;

                result = new Date(target.getTime());

                if (unit === unitWeek) {
                    dayOfWeek = dayOf(result, unitWeek, 0);
                    start = App.isNumeric(start) ? Math.max(0, Math.min(parseInt(start, 10), 7)) : 0;

                    diffDays = 0 - dayOfWeek + start;
                    setDate.call(result, getDate.call(result) + (diffDays > 0 ? diffDays - 7 : diffDays));
                    unit = unitDate;
                }
                /*eslint-disable no-fallthrough */
                switch (unit) {
                    case unitYear:
                        setMonth.call(result, 0);
                    case unitMonth:
                        setDate.call(result, 1);
                    case unitDate:
                        setHours.call(result, 0);
                    case unitHour:
                        setMinutes.call(result, 0);
                    case unitMinute:
                        setSeconds.call(result, 0);
                    case unitSecond:
                        setMilliseconds.call(result, 0);
                }
                /*eslint-enable no-fallthrough */
            }
            return result;
        },
        endOf = function (target, unit, start) {
            var result;
            if (App.isValidDate(target) && App.isStr(unit)) {
                result = startOf(target, unit, start);

                if (unit === unitWeek) {
                    setDate.call(result, getDate.call(result) + 7);
                } else {
                    result = add(result, unit, 1);
                }
                setMilliseconds.call(result, -1);
            }
            return result;
        },
        tokenCache = {},
        formatterPool = {},
        parserPool = {};

    function tokenize(format) {
        var i, l, ch,
            tokens = [],
            escaped = false,
            token, quote;

        function tokenizeLiteral(target, index) {
            var match = format.substr(index).match(new RegExp(target + "+"));
            if (match) {
                return match[0].length;
            }
            return 1;
        }

        if (tokenCache[format]) {
            return tokenCache[format];
        }
        for (i = 0, l = format.length; i < l; i++) {

            ch = format.charAt(i);
            if (escaped) {
                tokens.push(ch);
                escaped = false;
                continue;
            }
            if (ch === "\\") {
                escaped = true;
                continue;
            }
            if (ch === "'" || ch === "\"") {
                if (ch === quote) {
                    quote = false;
                } else {
                    quote = ch;
                }
                continue;
            }
            if (quote) {
                tokens.push(ch);
                continue;
            }
            switch (ch) {
                case "d":
                case "f":
                case "h":
                case "H":
                case "m":
                case "M":
                case "s":
                case "t":
                case "y":
                case "z":
                case "g":
                    token = {
                        type: ch,
                        length: tokenizeLiteral(ch, i)
                    };
                    tokens.push(token);
                    i += (token.length - 1);
                    break;
                case "/":
                case ":":
                    token = {
                        type: ch
                    };
                    tokens.push(token);
                    break;
                default:
                    tokens.push(ch);
            }
        }
        tokenCache[format] = tokens;
        return tokens;
    }

    function buildText(value, tokens, definition, useUtc, cal) {
        var tokenItem,
            type,
            tlength,
            meridiem,
            timezoneoffset,
            texts = [],
            clipRight = App.str.clipRight,
            i, l,
            eraValue,
            unusableToEmpty = function (val) {
                if (App.isUnusable(val)) {
                    return "";
                }
                return val;
            },
            getNonMilitaryHour = function () {
                var hour = (useUtc ? getUTCHours : getHours).call(value);
                return hour > 12 ? hour - 12 :
                    (hour || 12);
            },
            makeMd = function (len, division, addend, func, func2) {
                if (len === 1) {
                    texts.push(func.call(value) + addend);
                }
                if (len === 2) {
                    texts.push(clipRight("0" + (func.call(value) + addend), 2));
                }
                if (len >= 3) {
                    texts.push((tlength === 3 ? definition[division].shortNames : definition[division].names)[(func2 || func).call(value)]);
                }
            },
            makeHhms = function (len, func) {
                if (len === 1) {
                    texts.push(func(value));
                }
                if (len >= 2) {
                    texts.push(clipRight("0" + func(value), 2));
                }
            };

        for (i = 0, l = tokens.length; i < l; i++) {
            tokenItem = tokens[i];
            if (App.isStr(tokenItem)) {
                texts.push(tokenItem);
                continue;
            }
            type = tokenItem.type;
            tlength = tokenItem.length;
            if (type === "/") {
                texts.push(definition.dateSep);
            } else if (type === ":") {
                texts.push(definition.timeSep);
            } else if (type === "g") {
                eraValue = "";
                if (tlength === 1) {
                    eraValue = unusableToEmpty((cal || defaultCalendar).getShortEra(value));
                } else if (tlength === 2) {
                    eraValue = unusableToEmpty((cal || defaultCalendar).getMiddleEra(value));
                } else {
                    eraValue = unusableToEmpty((cal || defaultCalendar).getEra(value));
                }
                //変換できない場合は終了
                if (!eraValue) {
                    return;
                }
                texts.push(eraValue);
            } else if (type === "y") {
                //実際は cal のほうに文字指定が何文字の場合は、何文字で出力するという制御が必要
                if (cal) {
                    eraValue = unusableToEmpty(cal.getEraInfo(value));
                    //変換できない場合は終了
                    if (!eraValue) {
                        return;
                    }
                    texts.push(eraValue.maxYearLength ?
                        App.str.padLeft((eraValue.year + ""), Math.min(tlength, eraValue.maxYearLength), "0") :
                        (eraValue.year + ""));
                } else {
                    if (tlength < 3) {
                        texts.push(App.str.padLeft(parseInt(clipRight(((useUtc ? getUTCFullYear : getFullYear).call(value) + ""), 2), 10) + "", tlength, "0"));
                    } else {
                        texts.push(App.str.padLeft((useUtc ? getUTCFullYear : getFullYear).call(value) + "", tlength, "0"));
                    }
                    //if (tlength === 1) {
                    //    texts.push(clipRight(parseInt(("" + (useUtc ? getUTCFullYear : getFullYear).call(value)), 10).toString(), 2));
                    //} else {
                    //    /*jshint newcap: false*/
                    //    texts.push(clipRight(Array(tlength + 1).join("0") + (useUtc ? getUTCFullYear : getFullYear).call(value), tlength));
                    //}
                }
            } else if (type === "M") {
                makeMd(tlength, "months", 1, (useUtc ? getUTCMonth : getMonth));
            } else if (type === "d") {
                makeMd(tlength, "weekdays", 0, (useUtc ? getUTCDate : getDate), (useUtc ? getUTCDay : getDay));
            } else if (type === "h") {
                makeHhms(tlength, getNonMilitaryHour);
            } else if (type === "H") {
                makeHhms(tlength, function (s) { //eslint-disable-line no-loop-func
                    return (useUtc ? getUTCHours : getHours).call(s);
                });
            } else if (type === "m") {
                makeHhms(tlength, function (s) { //eslint-disable-line no-loop-func
                    return (useUtc ? getUTCMinutes : getMinutes).call(s);
                });
            } else if (type === "s") {
                makeHhms(tlength, function (s) { //eslint-disable-line no-loop-func
                    return (useUtc ? getUTCSeconds : getSeconds).call(s);
                });
            } else if (type === "f") {
                texts.push(clipRight("00" + (useUtc ? getUTCMilliseconds : getMilliseconds).call(value), 3).substr(0, tlength));
            } else if (type === "t") {
                meridiem = tlength === 1 ? {
                    ante: definition.meridiem.ante[0],
                    post: definition.meridiem.post[0]
                } : definition.meridiem;
                texts.push((useUtc ? getUTCHours : getHours).call(value) > 12 ? meridiem.post : meridiem.ante);
            } else if (type === "z") {
                timezoneoffset = useUtc ? 0 : getTimezoneOffset.call(value);
                texts.push((timezoneoffset < 0 ? "+" : "-") + (function () {  //eslint-disable-line no-loop-func
                    if (tlength === 1) {
                        return Math.floor(Math.abs(timezoneoffset / 60)).toString();
                    } else if (tlength === 2) {
                        return clipRight("0" + Math.floor(Math.abs(timezoneoffset / 60)).toString(), 2);
                    } else {
                        return clipRight("0" + Math.floor(Math.abs(timezoneoffset / 60)).toString(), 2) +
                            ":" +
                            clipRight("0" + Math.floor(Math.abs(timezoneoffset % 60)).toString(), 2);
                    }
                })());
            }
        }
        return texts.join("");
    }

    function toFormatedText(value, format, definition, useUtc, cal) {
        var tokens = tokenize(format, definition);
        return buildText(value, tokens, definition, useUtc, cal);
    }

    function resolveTokenForParse(token, startPos, value, dateDef, definition, cal) {
        var meridiemVal, target, result, i, l,
            names, sign,
            era, eraType,
            tokenType = token.type,
            tokenLength = token.length,
            zeroPaddingTwoLengthResolveToken = function (valPos) {
                var res, text, num, code;

                code = value.charCodeAt(startPos);
                if (code >= 48 && code <= 57) { //0-9
                    text = value.charAt(startPos);
                    res = 1;
                    code = value.charCodeAt(startPos + 1);
                    if (code >= 48 && code <= 57) { //0-9
                        text += value.charAt(startPos + 1);
                        res = 2;
                    }
                    num = parseInt(text, 10);
                    if (!isNaN(num)) {
                        dateDef.values[valPos] = num;
                        return res;
                    }
                }
            },
            fixLengthResolveToken = function (valPos) {
                var match = value.substr(startPos).match(new RegExp("^\\d{" + tokenLength + "}"));
                if (match && match.length > 0) {
                    dateDef.values[valPos] = parseInt(match[0], 10);
                    return token.length;
                }
            },
            millisecondsResolveToken = function () {
                var text = "0." + value.substr(startPos, tokenLength);
                if (App.isNumeric(text)) {
                    dateDef.values[6] = parseFloat(text) * 1000;
                    return token.length;
                }
            },
            makeMd = function (index, key, matchName) {
                if (tokenLength === 1) {
                    return zeroPaddingTwoLengthResolveToken(index);
                } else if (tokenLength === 2) {
                    return fixLengthResolveToken(index);
                } else {
                    names = tokenLength === 3 ? definition[key].shortNames : definition[key].names;
                    for (i = 0, l = names.length; i < l; i++) {
                        target = value.substr(startPos, names[i].length).toUpperCase();
                        if (target === names[i].toUpperCase()) {
                            matchName(i);
                            return names[i].length;
                        }
                    }
                }
            },
            makeHhms = function (index) {
                if (tokenLength === 1) {
                    return zeroPaddingTwoLengthResolveToken(index);
                } else {
                    return fixLengthResolveToken(index);
                }
            };

        if (tokenType === "y") {
            if (tokenLength === 1 || tokenLength === 2) {
                if (tokenLength === 1) {
                    result = zeroPaddingTwoLengthResolveToken(0);
                } else {
                    result = fixLengthResolveToken(0);
                }
                if (result && !cal) {
                    dateDef.values[0] += (dateDef.values[0] <= (definition.twoDigitYearMax % 100) ? 2000 : 1900);
                }
                return result;
            } else {
                return fixLengthResolveToken(0);
            }
        }
        if (tokenType === "M") {
            return makeMd(1, "months", function (index) {
                dateDef.values[1] = index + 1;
            });
        }
        if (tokenType === "d") {
            return makeMd(2, "weekdays", function (index) {
                dateDef.weekday = index;
            });
        }
        if (tokenType === "h") {
            dateDef.militaryTime = false;
            return makeHhms(3);
        }

        if (tokenType === "H") {
            dateDef.militaryTime = true;
            return makeHhms(3);
        }

        if (tokenType === "m") {
            return makeHhms(4);
        }

        if (tokenType === "s") {
            return makeHhms(5);
        }

        if (tokenType === "f") {
            return millisecondsResolveToken();
        }

        if (tokenType === "t") {
            meridiemVal = tokenLength === 1 ? {
                ante: definition.meridiem.ante[0],
                post: definition.meridiem.post[0]
            } : definition.meridiem;
            target = value.substr(startPos, meridiemVal.ante.length).toUpperCase();
            if (target === meridiemVal.ante.toUpperCase()) {
                dateDef.anteMeridiem = true;
                return meridiemVal.ante.length;
            }
            target = value.substr(startPos, meridiemVal.post.length).toUpperCase();
            if (target === meridiemVal.post.toUpperCase()) {
                dateDef.anteMeridiem = false;
                return meridiemVal.post.length;
            }
        }

        if (tokenType === "z") {
            target = value.substr(startPos, 1);
            if (target === "+") {
                sign = 1;
            } else if (target === "-") {
                sign = -1;
            } else {
                return;
            }

            if (tokenLength <= 2) {
                target = value.substr(startPos + 1, 2).match(tokenLength === 1 ? /\d{1,2}/ : /\d{2}/);
                if (target) {
                    dateDef.timeoffset = parseInt(target[0], 10) * 60 * sign;
                    return target[0].length + 1;
                }
            } else {
                target = value.substr(startPos + 1, 5).match(/(\d{1,2}):(\d{2})/);
                if (!target) {
                    target = value.substr(startPos + 1, 4).match(/(\d{2})(\d{2})/);
                }
                if (target && parseInt(target[2], 10) < 60) {
                    dateDef.timeoffset = ((parseInt(target[1], 10) * 60) + parseInt(target[2], 10)) * sign;
                    return target[0].length + 1;
                }
            }
        }

        if (tokenType === "g") {
            if (tokenLength === 1) {
                eraType = "shortEra";
            } else if (tokenLength === 2) {
                eraType = "middleEra";
            } else {
                eraType = "era";
            }

            era = App.array.find((cal || defaultCalendar).getEras(), function (e) {
                return (value.substr(startPos, e[eraType].length) || "").toUpperCase() === e[eraType].toUpperCase();
            });
            if (era) {
                dateDef.era = era;
                return era[eraType].length;
            }
            return;
        }
    }

    function makeDateFromArray(array, militaryTime, anteMeridiem, weekday, timeoffset, era, cal) {
        var now = new Date(),
            hour = array[3],
            year = array[0],
            currentEra;

        //全て数値じゃないとNG
        if (!array.every(function (item) {
            return !App.isUnusable(item) && App.isNum(item);
        })) {
            return;
        }
        //全て0未満だとNG
        if (!array.some(function (item) {
            return App.isNum(item) && item > -1;
        })) {
            return;
        }

        //eraの調整
        if (cal) {
            if (era && year < 0) {
                //年号があって年がない場合
                //今日が歴の何年にあたるかを取得して利用
                currentEra = cal.getEraInfo(now);
                year = now.getFullYear() - currentEra.start.getFullYear() + 1;
            } else if (!era && year > -1) {
                //年号がなくて、年がある場合
                //現在の年号をデフォルトとする
                era = cal.getEraInfo(now);
            }
            //西暦を取り出す
            year = array[0] = (era.start.getFullYear() + year - 1);
        }

        //AM/PMが付与されてる場合で13時以上や時間未設定はNG
        if (!App.isUndef(anteMeridiem)) {
            if (hour > 12 || hour < 0) {
                return;
            }
        }

        //12時間制で
        if (!App.isUndef(militaryTime) && !militaryTime && hour > -1) {
            //13時とかはNG
            if (hour > 12) {
                return;
            }
            //AMの時の12時は0時
            if ((App.isUndef(anteMeridiem) || (!App.isUndef(anteMeridiem) && anteMeridiem)) && hour === 12) {
                array[3] = hour = 0;
            }
            //PMの時の0-11時は+12時間
            if (!App.isUndef(anteMeridiem) && !anteMeridiem && hour < 12) {
                array[3] = hour = (hour + 12);
            }
        }

        //24時間制で
        if (!App.isUndef(militaryTime) && militaryTime && hour > -1) {
            //午前が指定されている場合に12時以上はNG
            if (!App.isUndef(anteMeridiem) && anteMeridiem) {
                if (hour >= 12) {
                    return;
                }
            }
            //午後が指定されている場合に11時以前はNG
            if (!App.isUndef(anteMeridiem) && !anteMeridiem) {
                if (hour < 12) {
                    return;
                }
            }
        }
        //時間しか指定されてない場合は現在日付

        /*eslint-disable curly */
        if (array[0] < 0 && array[1] < 0 && array[2] < 0) {
            if (array[0] < 0) array[0] = getFullYear.call(now);
            if (array[1] < 0) array[1] = getMonth.call(now);
            if (array[2] < 0) array[2] = getDate.call(now);
        } else {
            if (array[0] < 0) array[0] = getFullYear.call(now);
            if (array[1] < 0) array[1] = 0;
            if (array[2] < 0) array[2] = 1;
        }

        if (array[3] < 0) array[3] = 0;
        if (array[4] < 0) array[4] = 0;
        if (array[5] < 0) array[5] = 0;
        if (array[6] < 0) array[6] = 0;
        /*eslint-enable curly */

        var result = new Date();

        setFullYear.call(result, array[0], array[1], array[2]);
        setHours.call(result, array[3], array[4], array[5], array[6]);

        if (getFullYear.call(result) === array[0] &&
            getMonth.call(result) === array[1] &&
            getDate.call(result) === array[2] &&
            getHours.call(result) === array[3] &&
            getMinutes.call(result) === array[4] &&
            getSeconds.call(result) === array[5] &&
            getMilliseconds.call(result) === array[6]) {

            //曜日が指定されていて日付と一致していない場合はNG
            if (!App.isUndef(weekday)) {
                if (result.getDay() !== weekday) {
                    return;
                }
            }

            //eraの調整
            if (cal) {
                //年号と年が一致していない場合はNG
                if (cal.getEraInfo(result).era !== era.era) {
                    return;
                }
            }

            //timezoneの時刻調整
            if (!App.isUndef(timeoffset)) {
                setMinutes.call(result, getMinutes.call(result) + 0 - timeoffset - (new Date()).getTimezoneOffset());
            }

            return result;
        }
    }

    function parseText(value, format, definition, cal) {
        var tokens = tokenize(format, definition),
            dateDef = {
                values: [-1, -1, -1, -1, -1, -1, -1]
            },
            lastValueEndPos = 0,
            resolveLength = 0,
            i, l, token,
            sepLen;

        for (i = 0, l = tokens.length; i < l; i++) {
            resolveLength = undefined;
            token = tokens[i];
            if (App.isStr(token)) {
                if (value.substr(lastValueEndPos, token.length) === token) {
                    resolveLength = token.length;
                }
            } else {
                if (token.type === "/") {
                    sepLen = definition.dateSep.length;
                    if (value.substr(lastValueEndPos, sepLen) === definition.dateSep) {
                        resolveLength = sepLen;
                    }
                } else if (token.type === ":") {
                    sepLen = definition.timeSep.length;
                    if (value.substr(lastValueEndPos, sepLen) === definition.timeSep) {
                        resolveLength = sepLen;
                    }
                } else {
                    resolveLength = resolveTokenForParse(tokens[i], lastValueEndPos, value, dateDef, definition, cal);
                }
            }

            if (App.isUndef(resolveLength)) {
                dateDef = null;
                break;
            }
            lastValueEndPos += resolveLength;
        }
        if (!dateDef) {
            return;
        }
        //文字のほうが余っている場合はエラー
        if (value.length !== lastValueEndPos) {
            return;
        }
        //月が0の場合はエラー
        if (dateDef.values[1] === 0) {
            return;
        } else if (dateDef.values[1] >= 1) {
            dateDef.values[1] -= 1;
        }

        return makeDateFromArray(dateDef.values, dateDef.militaryTime, dateDef.anteMeridiem, dateDef.weekday, dateDef.timeoffset, dateDef.era, cal);
    }


    function parseAll(text, formats, cal) {
        var i = 0, l = formats.length, format, result;
        for (; i < l; i++) {
            format = formats[i];
            result = App.date.parse(text, format, cal);
            if (result) {
                return result;
            }
        }
    }

    App.date = {
        /**
        * 第1引数に指定された日付を第2引数で指定されたフォーマット文字列でフォーマットした文字列を返します。
        * 基本的には.NETのフォーマット文字列に準拠します。
        * y, M, d, H, h, m, s, f, t, z が利用可能です。
        * http://msdn.microsoft.com/ja-jp/library/vstudio/8kb3ddd4.aspx
        *
        * javascript の場合、 f のミリ秒が3桁までになるため、 3つ以上の f の連続は無視されます。
        */
        format: function (value, format, useUtc) {
            var def,
                utc = false,
                cal;

            if (arguments.length > 2) {
                if (App.isBool(useUtc)) {
                    utc = useUtc;
                } else {
                    cal = useUtc;
                }
            }

            if (!App.isValidDate(value) || !App.isStr(format)) {
                return;
            }
            def = App.culture.current().dateTimeFormat;
            if (format in formatterPool) {
                return formatterPool[format](value, def, utc);
            }
            if (format.length === 1) {
                //標準書式指定に設定されているパターンの場合は、そちらに変更するが
                //含まれない場合は、そのままの文字列をフォーマットとする
                //.NET場合はエラーとなる
                if (format in def.patterns) {
                    format = def.patterns[format];
                }
            }
            return toFormatedText(value, format, def, utc, cal);
        },
        namedFormatter: function (name, formatter) {
            if (!App.isStr(name)) {
                return;
            }
            if (App.isFunc(formatter)) {
                formatterPool[name] = formatter;
            } else {
                return formatterPool[name];
            }
        },
        removeNamedFormatter: function (name) {
            formatterPool[name] = void 0;
            delete formatterPool[name];
        },
        hasNamedFormatter: function (name) {
            return App.isFunc(formatterPool[name]);
        },
        parse: function (text, format, cal) {
            var def;

            if (App.isArray(format)) {
                return parseAll(text, format, cal);
            }

            if (!App.isStr(text) || !App.isStr(format)) {
                return;
            }

            def = App.culture.current().dateTimeFormat;
            if (format in parserPool) {
                return parserPool[format](text, def);
            }
            if (format.length === 1) {
                //標準書式指定に設定されているパターンの場合は、そちらに変更するが
                //含まれない場合は、そのままの文字列をフォーマットとする
                //.NET場合はエラーとなる
                if (format in def.patterns) {
                    format = def.patterns[format];
                }
            }
            return parseText(text, format, def, cal);
        },
        namedParser: function (name, parser) {
            if (!App.isStr(name)) {
                return;
            }
            if (App.isFunc(parser)) {
                parserPool[name] = parser;
            } else {
                return parserPool[name];
            }
        },
        removeNamedParser: function (name) {
            parserPool[name] = void 0;
            delete parserPool[name];
        },
        hasNamedParser: function (name) {
            return App.isFunc(parserPool[name]);
        },
        copy: function (dest, source) {
            if (!App.isValidDate(dest) || !App.isValidDate(source)) {
                return;
            }
            dest.setUTCMilliseconds(source.getUTCMilliseconds());
            dest.setUTCSeconds(source.getSeconds());
            dest.setUTCMinutes(source.getUTCMinutes());
            dest.setUTCHours(source.getUTCHours());
            dest.setUTCDate(source.getUTCDate());
            dest.setUTCMonth(source.getUTCMonth());
            dest.setUTCFullYear(source.getUTCFullYear());
            return dest;
        }
    };

    //add(Years, Months, Days ・・・・)
    [unitYear, unitMonth, unitDate, unitHour, unitMinute, unitSecond, unitMillSecond, unitWeek, unitTime].forEach(function (item) {
        var name = item.charAt(item.length - 1) !== "s" ? (item + "s") : item;
        name = item === unitDate ? "Days" : name;
        App.date["add" + name] = function (target, value) {
            return add(target, item, value);
        };
    });

    //diff
    [unitYear, unitMonth, unitDate, unitHour, unitMinute, unitSecond, unitMillSecond, unitWeek].forEach(function (item) {
        var name = item.charAt(item.length - 1) !== "s" ? (item + "s") : item;
        name = item === unitDate ? "Days" : name;
        App.date["diff" + name] = function (target, value) {
            return diff(target, item, value);
        };
    });

    //dayOf(Year, Month ・・・・)
    [unitYear, unitMonth, unitWeek].forEach(function (item) {
        App.date["dayOf" + item] = function (target, start) {
            return dayOf(target, item, start);
        };
    });

    //startOf(Year, Month, Week, Day, Hour ・・・) - endOf
    [unitYear, unitMonth, unitDate, unitHour, unitMinute, unitSecond, unitWeek].forEach(function (item) {
        var name = item.charAt(item.length - 1) === "s" ? item.substr(0, item.length - 1) : item;
        name = item === unitDate ? "Day" : name;
        App.date["startOf" + name] = function (target, start) {
            return startOf(target, item, start);
        };
        App.date["endOf" + name] = function (target, start) {
            return endOf(target, item, start);
        };
    });

    [unitYear, unitMonth].forEach(function (item) {
        App.date["isLastDayOf" + item] = function (target) {
            var clone;
            if (!App.isValidDate(target)) {
                return;
            }
            clone = add(new Date(target), unitDate, 1);
            if (item === unitYear) {
                return clone.getFullYear() !== target.getFullYear();
            } else {
                return clone.getMonth() !== target.getMonth();
            }
        };
    });

    App.date.namedFormatter("ODataJSON", function (value, def, useUtc) {
        var tzo = getTimezoneOffset.call(value),
            tzoText = "+0";
        if (!useUtc) {
            tzoText = App.str.clipRight("0" + Math.abs((Math.floor(tzo / 60))), 2) +
            App.str.clipRight("0" + (tzo % 60), 2);
            tzoText = (tzo < 0 ? "-" : "+") + tzoText;
        }

        return "/Date(" + getTime.call(value) + tzoText + ")/";
    });

    function iso8601DateTime(value, useUtc, withMs) {
        var year = (useUtc ? getUTCFullYear : getFullYear).call(value) + "",
            month = ((useUtc ? getUTCMonth : getMonth).call(value) + 1) + "",
            date = (useUtc ? getUTCDate : getDate).call(value) + "",
            hour = (useUtc ? getUTCHours : getHours).call(value) + "",
            minute = (useUtc ? getUTCMinutes : getMinutes).call(value) + "",
            second = (useUtc ? getUTCSeconds : getSeconds).call(value) + "",
            zeroPad = function (v) {
                return ("00" + v).match(/.{0,2}$/)[0];
            };

        return year + "-" + zeroPad(month) + "-" + zeroPad(date) + "T" + zeroPad(hour) + ":" + zeroPad(minute) + ":" + zeroPad(second) +
            (withMs ? ("." + (value.getMilliseconds() + "000").substr(0, 3)) : "");
    }

    App.date.namedFormatter("ISO8601DateTime", function (value, def, useUtc) {
        return iso8601DateTime(value, useUtc); //eslint-disable-line new-cap
    });

    App.date.namedFormatter("ISO8601DateTimeMs", function (value, def, useUtc) {
        return iso8601DateTime(value, useUtc, true);
    });


    App.date.namedFormatter("ISO8601Full", function (value, def, useUtc) {
        var dateTime = iso8601DateTime(value, useUtc, true),
            zeroPad = function (v) {
                return ("00" + v).match(/.{0,2}$/)[0];
            },
            tzoff = useUtc ? 0 : getTimezoneOffset.call(value),
            tz = (tzoff > 0 ? "-" : "+") + (function () {
                var tzo = Math.abs(tzoff);
                return zeroPad(Math.floor(tzo / 60).toString()) +
                    ":" +
                    zeroPad(Math.floor(tzo % 60).toString());
            })();
        return dateTime + tz;
    });

    App.date.namedParser("ISO8601DateTime", function (value, def, useUtc) {
        return App.date.parse(value, "yyyy-MM-dd'T'HH:mm:ss", useUtc);
    });

    App.date.namedParser("ISO8601DateTimeMs", function (value, def, useUtc) {
        return App.date.parse(value, "yyyy-MM-ddTHH:mm:ss.fff", useUtc);
    });

    App.date.namedParser("ISO8601Full", function (value, def, useUtc) {
        return App.date.parse(value, "yyyy-MM-dd'T'HH:mm:sszzz", useUtc);
    });

    //ISO8601DateTimeのエイリアス
    App.date.namedParser("JsonDate", function (value, def, useUtc) {
        var val = App.date.parse(value, "yyyy-MM-dd'T'HH:mm:ss", useUtc);
        if (!val) {
            val = App.date.parse(value, "yyyy-MM-dd'T'HH:mm:sszzz", useUtc);
        }
        return val;
    });

    App.date.namedFormatter("date", function (value, def, useUtc) {
        return App.date.format(value, "yyyy/MM/dd", useUtc);
    });
    App.date.namedParser("date", function (value, def, useUtc) {
        return App.date.parse(value, "yyyy/MM/dd", useUtc);
    });

})(this, App);

/*global App */

/// <reference path="base.js" />
/// <reference path="obj.js" />
/// <reference path="str.js" />

(function (global, App) {

    "use strict";

    App.logging = {};

    // Trace Module

    /**
     * Default log output for console.(> Internet Explorer 9).
     */
    function outputToConsole(logEntry) {
        if (global.console && global.console.log) {
            global.console.log(logEntry.text);
        }
    }

    /**
     * Logger for JavaScript console.
     */
    function Logger(moduleName, output, logFormat) {
        this.module = moduleName;
        this.logFormat = "[{longdate}] [{module}] [{level}], {message}";
        this.output = outputToConsole;

        if (!App.isUndefOrNull(logFormat)) {
            this.logFormat = logFormat;
        }

        if (!App.isUndefOrNull(output)) {
            this.output = output;
        }
    }

    function write(logEntry) {
        logEntry.longdate = App.date.format(new Date(), "yyyy-MM-dd hh:mm:ss");
        logEntry.module = this.module;
        logEntry.format = this.logFormat;
        logEntry.text = App.str.format(this.logFormat, logEntry);
        this.output(logEntry);
    }

    Logger.prototype.debug = function(message) {
        var logEntry = {
            level: "DEBUG",
            message: message
        };

        write.bind(this)(logEntry);
    };

    Logger.prototype.info = function(message) {
        var logEntry = {
            level: "INFO",
            message: message
        };

        write.bind(this)(logEntry);
    };

    Logger.prototype.error = function(message) {
        var logEntry = {
            level: "ERROR",
            message: message
        };

        write.bind(this)(logEntry);
    };


    App.logging.Logger = Logger;

})(this, App);

/*global App */

/// <reference path="base.js" />

(function (global, App) {

    "use strict";

    App.array = {};
    /**
     * 引数で指定された配列の中から callback で true を返された最初の値を返します。
     */
    App.array.find = function find(target, callback) {
        var i = 0, l;
        if (!App.isArray(target) || !App.isFunc(callback)) {
            return;
        }
        for (l = target.length; i < l; i++) {
            if (callback(target[i], i, target)) {
                return target[i];
            }
        }
    };
})(this, App);

/*global App */

/// <reference path="base.js" />
/// <reference path="array.js" />
/// <reference path="culture.js" />
/// <reference path="str.js" />

//number
(function (global, App) {
    "use strict";

    var tokenCache = {},
        formatterPool = {},
        parserPool = {},
        math = Math,
        numRegx = /^[+-]?[\d][\d,]*(\.\d+)?(e[+-]\d+)?$/i,
        decRegx = /^[+-]?(\.\d+)(e[+-]\d+)?$/i;

    function tokenize(format) {
        var i = 0, l = format.length, c,
            escaped = false,
            quote = false,
            result = {
                plus: {
                    ints: []
                }
            },
            current = result.plus.ints,
            section = result.plus,
            sectionPos = 0,
            sectionName,
            isInts = true,
            prepareSeparator = function (sec) {
                var index = 0,
                    token,
                    holder = false,
                    separator = false,
                    ints = sec.ints;
                /*eslint-disable no-loop-func */
                while ((function () {
                    if (ints.length && ints[ints.length - 1].type === ",") {
                        sec.pows = (sec.pows || 0) + 1;
                        ints.pop();
                        return true;
                    }
                    return false;
                })()) { } //eslint-disable-line no-empty
                /*eslint-enable no-loop-func */
                while (index < ints.length) {
                    token = ints[index];
                    if (!App.isStr(token)) {
                        if (token.holder) {
                            if (holder && separator) {
                                sec.separate = true;
                            }
                            holder = true;
                        } else if (token.separator) {
                            separator = true;
                            ints.splice(index, 1);
                            index--;
                        } else {
                            holder = false;
                            separator = false;
                        }
                    }
                    index++;
                }

            };

        if (tokenCache[format]) {
            return tokenCache[format];
        }

        for (; i < l; i++) {

            c = format.charAt(i);
            if (escaped) {
                current.push(c);
                escaped = false;
            } else if (c === "\\") {
                escaped = true;
            } else if (c === "\"" || c === "'") {
                if (quote === c) {
                    quote = false;
                } else {
                    quote = c;
                }
            } else if (quote) {
                current.push(c);
            } else if (c === "0" || c === "#") {
                current.push({
                    type: c,
                    holder: true
                });
            } else if (c === ",") {
                if (isInts) {
                    current.push({
                        type: c,
                        separator: true
                    });
                }
            } else if (c === "%" || c === "‰") {
                //current.push(c);
                current.push({
                    type: c
                });
                if (c === "%") {
                    section.parcent = (section.parcent || 0) + 1;
                } else if (c === "‰") {
                    section.permil = (section.permil || 0) + 1;
                }
            } else if (c === ".") {
                if (isInts) {
                    isInts = false;
                    current = [];
                    result[(sectionPos === 0) ? "plus" : (sectionPos === 1 ? "minus" : "zero")].decs = current;
                }
            } else if (c === ";") {
                prepareSeparator(section);
                isInts = true;
                if (sectionPos < 2) {
                    sectionName = sectionPos === 0 ? "minus" : "zero";
                    result[sectionName] = { ints: [] };
                    section = result[sectionName];
                    current = section.ints;
                    sectionPos++;
                } else {
                    break;
                }
            } else {
                current.push(c);
            }
        }

        prepareSeparator(section);

        tokenCache[format] = result;
        return result;
    }

    function buildText(value, tokens, definition) {
        var isMinus = value < 0,
            targetVal = value,
            targetStr,
            i, j, l,
            part, tokenPart, targetPart, tokenPartVal,
            result = { ints: "", decs: "" },
            dec,
            hasDec = false,
            groupSizes = definition.groupSizes.concat(),
            lastGroupSize = 0,
            groupLen = 0,
            hasToken = function (v) {
                if (!v) {
                    return false;
                }
                if (v.ints && v.ints.length) {
                    return v;
                }
                return false;
            },
            targetTokens = isMinus ? (hasToken(tokens.minus) || tokens.plus) : tokens.plus,
            hasDecPlaceholder = function (v) {
                var index, len;
                if (!v) {
                    return false;
                }
                for (index = 0, len = v.length; index < len; index++) {
                    if (v[index].holder) {
                        return true;
                    }
                }
                return false;
            },
            splitPart = function (val) {
                var splited = val.split(".");
                if (splited.length === 1) {
                    splited[1] = "";
                }
                return splited;
            },
            exponentToNumStr = function (val) {
                var ePos = val.indexOf("e");
                if (ePos < 0) {
                    return val;
                }
                var mantissa = val.substr(0, ePos);
                var exponent = parseInt(val.substr(ePos + 1), 10);
                if (val.charAt(0) === "-") {
                    mantissa = mantissa(1);
                }
                var dotPos = mantissa.indexOf(".");
                mantissa = mantissa.replace(".", "");
                if (dotPos < 0) {
                    dotPos = mantissa.length;
                }
                dotPos = dotPos + exponent;
                if (dotPos <= 0) {
                    return "0." + (new Array(math.abs(dotPos))).join("0") + mantissa;
                } else if (mantissa.length <= dotPos) {
                    return mantissa + (new Array(dotPos - mantissa.length + 1)).join("0");
                }
                return mantissa.substr(0, dotPos) + "." + mantissa.substr(dotPos);
            },
            hasAllStrTokenPart = function (val, length) {
                var index = 0;
                for (; index < length; index++) {
                    if (!App.isStr(val[index])) {
                        return false;
                    }
                }
                return true;
            };

        if (targetTokens.parcent > 0) {
            targetVal = targetVal * math.pow(100, targetTokens.parcent);
        }
        if (targetTokens.permil > 0) {
            targetVal = targetVal * math.pow(1000, targetTokens.permil);
        }
        if (targetTokens.pows > 0) {
            targetVal = targetVal / math.pow(1000, targetTokens.pows);
        }

        targetStr = exponentToNumStr(math.abs(targetVal) + "");
        targetVal = parseFloat(targetStr);

        if (targetVal === 0) {
            targetTokens = hasToken(tokens.zero) || targetTokens;
            targetStr = "0";
        } else if (targetVal < 1 && !hasDecPlaceholder(targetTokens.decs)) {
            targetTokens = hasToken(tokens.zero) || targetTokens;
            targetStr = "0";
        }

        part = splitPart(targetStr);
        tokenPart = targetTokens.ints;
        targetPart = part[0];
        hasDec = false;
        lastGroupSize = groupSizes.shift();
        groupLen = 0;
        for (i = tokenPart.length - 1; i > -1; i--) {
            tokenPartVal = tokenPart[i];
            if (App.isStr(tokenPartVal)) {
                result.ints = tokenPartVal + result.ints;
            } else {
                if (tokenPartVal.type === "%") {
                    result.ints = definition.percent.symbol + result.ints;
                    continue;
                }
                if (tokenPartVal.type === "‰") {
                    result.ints = definition.percent.permilleSynbol + result.ints;
                    continue;
                }

                if (targetTokens.separate) {
                    if (groupLen === lastGroupSize && targetPart.length !== 0) {
                        result.ints = definition.groupSep + result.ints;
                        if (groupSizes.length > 0) {
                            lastGroupSize = groupSizes.shift();
                        }
                        groupLen = 0;
                    }
                }

                result.ints = (targetPart.length !== 0 ? targetPart.substr(targetPart.length - 1) :
                    tokenPartVal.type === "0" ? "0" : "") + result.ints;
                targetPart = targetPart.substr(0, targetPart.length - 1);
                groupLen++;


                if (hasAllStrTokenPart(tokenPart, i)) {
                    if (targetTokens.separate) {
                        for (j = targetPart.length; j; j--) {
                            if (groupLen === lastGroupSize && targetPart.length !== 0) {
                                result.ints = definition.groupSep + result.ints;
                                if (groupSizes.length > 0) {
                                    lastGroupSize = groupSizes.shift();
                                }
                                groupLen = 0;
                            }

                            result.ints = targetPart.charAt(j - 1) + result.ints;
                            targetPart = targetPart.substr(0, targetPart.length - 1);

                            groupLen++;
                        }
                    } else {
                        result.ints = targetPart + result.ints;
                    }
                }
            }
        }

        tokenPart = targetTokens.decs || [];
        targetPart = part[1];

        for (i = 0, l = tokenPart.length; i < l; i++) {
            tokenPartVal = tokenPart[i];
            if (App.isStr(tokenPartVal)) {
                result.decs += tokenPartVal;
            } else {
                if (tokenPartVal.type === "%") {
                    result.decs += definition.percent.symbol;
                    continue;
                }
                if (tokenPartVal.type === "‰") {
                    result.decs += definition.percent.permilleSynbol;
                    continue;
                }

                dec = targetPart.charAt(0) ? targetPart.charAt(0) :
                    tokenPartVal.type === "0" ? "0" : "";
                if (dec) {
                    hasDec = true;
                }
                result.decs += dec;
                targetPart = targetPart.substr(1);
            }
        }
        return ((isMinus && targetTokens === tokens.plus) ? definition.negSign : "") + result.ints + (hasDec ? definition.decSep + result.decs : result.decs);
    }

    function toFormatedText(value, format, definition) {
        var tokens = tokenize(format);
        return buildText(value, tokens, definition);
    }

    function parseText(value, definition) {
        var source = App.str.trim(value),
            target = source,
            //currSymbol = definition.currency.symbol,
            preCurrSymbol = false, postCurrSymbol = false,
            hasNegParen = false,
            result,
            replaceRegExps = [];

        if (target === definition.nanSymbol) {
            return Number.NaN;
        }
        if (target === definition.posInfSymbol) {
            return Number.POSITIVE_INFINITY;
        }
        if (target === definition.negInfSymbol) {
            return Number.NEGATIVE_INFINITY;
        }
        //normalize
        if (target.charAt(0) === "(" && target.substr(-1) === ")") {
            hasNegParen = true;
            target = target.substr(1, target.length - 2);
        }

        if (definition.groupSep !== ",") {
            replaceRegExps.push(App.str.escapeRegExp(definition.groupSep));
        }
        if (definition.decSep !== ".") {
            replaceRegExps.push(App.str.escapeRegExp(definition.decSep));
        }
        if (definition.currency.symbol !== "$") {
            replaceRegExps.push(App.str.escapeRegExp(definition.currency.symbol));
        }
        if (definition.posSign !== "+") {
            replaceRegExps.push(App.str.escapeRegExp(definition.posSign));
        }
        if (definition.negSign !== "-") {
            replaceRegExps.push(App.str.escapeRegExp(definition.negSign));
        }
        if (replaceRegExps.length) {
            target = target.replace(new RegExp("(" + replaceRegExps.join(")|(") + ")", "g"), function (val) {
                /*eslint-disable curly*/
                if (val === definition.groupSep) return ",";
                if (val === definition.decSep) return ".";
                if (val === definition.currency.symbol) return "$";
                if (val === definition.posSign) return "+";
                if (val === definition.negSign) return "-";
                /*eslint-enable curly*/
                return val;
            });
        }
        target = target.replace(/^[+-]?\$/, function (val) {
            preCurrSymbol = true;
            return val.replace("$", "");
        });
        target = target.replace(/\$[+-]?$/, function (val) {
            postCurrSymbol = true;
            return val.replace("$", "");
        });
        if (preCurrSymbol && postCurrSymbol) {
            return;
        }
        if (target.match(/[+-]$/)) {
            target = target.substr(-1) + target.substr(0, target.length - 1);
        }

        if (!target.match(numRegx) && !target.match(decRegx)) {
            return;
        }
        target = target.replace(/\,/g, "");
        result = parseFloat(target);
        if (isNaN(result)) {
            return;
        }
        if (hasNegParen && result < 0) {
            return;
        }
        if (hasNegParen) {
            return 0 - result;
        }
        return result;
    }

    function round(target, prec, func) {
        if (!App.isNum(target)) {
            return NaN;
        }
        func = App.isFunc(func) ? func : math.round;
        prec = App.isNum(prec) ? prec : 0;
        var mul = math.pow(10, math.abs(prec));
        if (prec < 0) {
            mul = 1 / mul;
        }
        return func(target * mul) / mul;
    }

    App.num = {
        format: function (value, format) {
            var def;

            if (!App.isNum(value) || !App.isStr(format) || isNaN(value)) {
                return;
            }
            if (App.isNum(value) && !isFinite(value)) {
                return;
            }
            def = App.culture.current().numberFormat;

            if (format in formatterPool) {
                return formatterPool[format](value, def);
            }
            return toFormatedText(value, format, def);
        },
        namedFormatter: function (name, formatter) {
            if (!App.isStr(name)) {
                return;
            }
            if (App.isFunc(formatter)) {
                formatterPool[name] = formatter;
            } else {
                return formatterPool[name];
            }
        },
        removeNamedFormatter: function (name) {
            formatterPool[name] = void 0;
            delete formatterPool[name];
        },
        hasNamedFormatter: function (name) {
            return App.isFunc(formatterPool[name]);
        },
        parse: function (text, parser) {
            var def;
            if (!App.isStr(text)) {
                return;
            }
            def = App.culture.current().numberFormat;
            if (parser in parserPool) {
                return parserPool[parser](text, def);
            }
            return parseText(text, def);
        },
        namedParser: function (name, parser) {
            if (!App.isStr(name)) {
                return;
            }
            if (App.isFunc(parser)) {
                parserPool[name] = parser;
            } else {
                return parserPool[name];
            }
        },
        removeNamedParser: function (name) {
            parserPool[name] = void 0;
            delete parserPool[name];
        },
        hasNamedParser: function (name) {
            return App.isFunc(parserPool[name]);
        },
        round: function (target, prec) {
            return round(target, prec);
        },
        ceil: function (target, prec) {
            return round(target, prec, math.ceil);
        },
        floor: function (target, prec) {
            return round(target, prec, math.floor);
        }
    };

    App.num.namedFormatter("currency", function (value /*, def*/) {
        return App.num.format(value, "#,##0");
    });
    App.num.namedParser("currency", function (text /*, def*/) {
        return App.num.parse(text);
    });
    App.num.namedFormatter("number", function (value /*, def*/) {
        return App.num.format(value, "#");
    });
    App.num.namedParser("number", function (text /*, def*/) {
        return App.num.parse(text);
    });
    App.num.namedFormatter("decimal", function (value /*, def*/) {
        return App.num.format(value, "#.00");
    });
    App.num.namedParser("decimal", function (text /*, def*/) {
        return App.num.parse(text);
    });
})(this, App);

/*global App */
/// <reference path="base.js" />
/// <reference path="obj.js" />

/*
* Copyright(c) Archway Inc. All rights reserved.
*/
(function (global, App, undef) {

    "use strict";

    var parseUriRegx = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/, //RFC 3986 appendix B.
        missingGroupSupport = (typeof "".match(/(a)?/)[1] !== "string"),
        parseUri = function (target) {
            var matches;
            if (!App.isStr(target)) {
                return;
            }
            matches = target.match(parseUriRegx);
            matches.shift();
            return {
                schema: !missingGroupSupport && matches[0] === "" ? undefined : matches[1],
                authority: !missingGroupSupport && matches[2] === "" ? undefined : matches[3],
                path: matches[4],
                query: !missingGroupSupport && matches[5] === "" ? undefined : matches[6],
                fragment: !missingGroupSupport && matches[7] === "" ? undefined : matches[8]
            };
        },
        isAbsoluteRegx = /^[A-Z][0-9A-Z+\-\.]*:/i,
        isAbsolute = function (target) {
            return isAbsoluteRegx.test(target);
        },
        //RFC 3986 5.2.4
        removeDotSegments = function (path) {
            var startIsSeparator = false,
                segments,
                seg,
                keepers = [];
            // return empty string if entire path is just "." or ".."
            if (path === "." || path === "..") {
                return "";
            }
            // remove all "./" or "../" segments at the beginning
            while (path) {
                if (path.substring(0, 2) === "./") {
                    path = path.substring(2);
                } else if (path.substring(0, 3) === "../") {
                    path = path.substring(3);
                } else {
                    break;
                }
            }
            if (path.charAt(0) === "/") {
                path = path.substring(1);
                startIsSeparator = true;
            }
            if (path.substring(path.length - 2) === "/.") {
                path = path.substring(0, path.length - 1);
            }
            segments = path.split("/").reverse();
            while (segments.length) {
                seg = segments.pop();
                if (seg === "..") {
                    if (keepers.length) {
                        keepers.pop();
                    } else if (!startIsSeparator) {
                        keepers.push(seg);
                    }
                    if (!segments.length) {
                        keepers.push("");
                    }
                } else if (seg !== ".") {
                    keepers.push(seg);
                }
            }
            return (startIsSeparator && "/" || "") + keepers.join("/");
        },
        absolutize = function (base, relative) { //RFC 3986 5.2.2
            var part,
                relSchema, relAuth, relPath, relQuery, relFrag,
                bSchema, bAuth, bPath, bQuery,
                resSchema, resAuth, resPath, resQuery, resFrag;
            if (!App.isStr(base) || !isAbsolute(base) || !App.isStr(relative)) {
                return;
            }
            if (relative === "" || relative.charAt(0) === "#") {
                return parseUri(base.split("#")[0] + relative);
            }
            part = parseUri(relative) || {};
            relSchema = part.schema;
            relAuth = part.authority;
            relPath = part.path;
            relQuery = part.query;
            relFrag = part.fragment;
            if (relSchema) {
                resSchema = relSchema;
                resAuth = relAuth;
                resPath = removeDotSegments(relPath);
                resQuery = relQuery;
            } else {
                part = parseUri(base) || {};
                bSchema = part.schema;
                bAuth = part.authority;
                bPath = part.path;
                bQuery = part.query;
                if (relAuth) {
                    resAuth = relAuth;
                    resPath = removeDotSegments(relPath);
                    resQuery = relQuery;
                } else {
                    if (!relPath) {
                        resPath = bPath;
                        resQuery = relQuery ? relQuery : bQuery;
                    } else {
                        if (relPath.charAt(0) === "/") {
                            resPath = removeDotSegments(relPath);
                        } else {
                            //RFC 3986 5.2.3
                            if (bAuth && !bPath) {
                                resPath = "/" + relPath;
                            } else {
                                resPath = bPath.substring(0, bPath.lastIndexOf("/") + 1) + relPath;
                            }
                            resPath = removeDotSegments(resPath);
                        }
                        resQuery = relQuery;
                    }
                    resAuth = bAuth;
                }
                resSchema = bSchema;
            }
            resFrag = relFrag;
            return {
                schema: resSchema,
                authority: resAuth,
                path: resPath,
                query: resQuery,
                fragment: resFrag
            };
        },
        toUriString = function (target) {
            var result = "",
                path = target.path;
            if (!App.isUndef(target.schema)) {
                result += target.schema + ":";
            }
            if (!App.isUndef(target.authority)) {
                result += "//" + target.authority;
            }
            if (!App.isUndef(path) && path.length > 0) {
                if (!App.isUndef(target.authority)) {
                    if (path.charAt(0) !== "/") {
                        path = "/" + path;
                    }
                }
                result += path;
            }

            if (!App.isUndef(target.query)) {
                result += "?" + target.query;
            }
            if (!App.isUndef(target.fragment)) {
                result += "#" + target.fragment;
            }
            return result;
        },
        splitQuery = function (query) {
            var queryStr = (query || ""),
                items = (queryStr.charAt(0) === "?" ? queryStr.substr(1) : queryStr).split("&"),
                i = 0, l = items.length, item, keyValue, result = {};
            for (; i < l; i++) {
                item = items[i];
                if (!item) {
                    continue;
                }
                keyValue = item.split("=");
                if (keyValue.length < 1) {
                    continue;
                }
                if (keyValue.length < 2) {
                    result[keyValue[0]] = undef;
                    continue;
                }
                result[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
            }
            return result;
        },
        joinQuery = function (query) {
            var vals = [],
                keys, i, l, key;
            if (!query) {
                return;
            }
            if (App.isStr(query)) {
                return query;
            }
            if (App.isArray(query)) {
                return query.join("&");
            }
            keys = Object.keys(query);
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                if (App.isUndefOrNull(query[key]) || query[key] === "") {
                    vals.push(key + "=");
                } else {
                    vals.push(key + "=" + encodeURIComponent(query[key]));
                }
            }
            return vals.join("&");
        };

    App.uri = {
        /**
        * 指定された uri 文字列を分解したオブジェクトを返します。
        */
        parse: function (uri) {
            var result = parseUri(uri);
            result.query = splitQuery(result.query);
            return result;
        },
        /**
         * uri構成のオブジェクトからuri文字列を作成します。
         */
        toUriString: function (uriElement) {
            var elem = App.obj.omit(uriElement, "query");
            elem.query = joinQuery(uriElement.query);
            return toUriString(elem);
        },
        /**
        * 指定された絶対パスをもとに、指定された相対パスを絶対パスに変換します。
        */
        resolve: function (base, relative) {
            if (!App.isStr(base) || !App.isStr(relative)) {
                return;
            }
            var uri = absolutize(base, relative);
            return toUriString(uri);
        },
        /**
         * 指定されたuri文字列に指定されたparamオブジェクトをURIクエリーに設定した文字列を返します。
         */
        setQuery: function (uriString, param) {
            var result = parseUri(uriString),
                query = splitQuery(result.query);
            query = App.obj.mixin(query, param);
            result.query = joinQuery(query);
            return toUriString(result);
        },
        splitQuery: splitQuery,
        joinQuery: joinQuery
    };

})(window, App);

/*global App */

//uuid
(function (global, App) {

    "use strict";

    /**
     * 指定された形式で一意識別子を作成します。
     * @param {String} format 指定するフォーマット形式。形式を省略した場合は"{0}{1}{2}{3}{4}{5}"の形式で作成
     *                        "N": "{0}{1}{2}{3}{4}{5}",
     *                        "D": "{0}-{1}-{2}-{3}{4}-{5}",
     *                        "B": "{{0}-{1}-{2}-{3}{4}-{5}}",
     *                        "P": "({0}-{1}-{2}-{3}{4}-{5})"
     * @return 作成された一意識別子
     */
    App.uuid = function (format) {
        var defaultFormat = "N",
            rand = function (range) {
                /*eslint-disable curly*/
                if (range < 0) return NaN;
                if (range <= 30) return Math.floor(Math.random() * (1 << range));
                if (range <= 53) return Math.floor(Math.random() * (1 << 30)) +
                        Math.floor(Math.random() * (1 << range - 30)) * (1 << 30);
                /*eslint-enable curly*/
                return NaN;
            },
            prepareVal = function (value, length) {
                var ret = "000000000000" + value.toString(16);
                return ret.substr(ret.length - length);
            },
            formats = {
                "N": "{0}{1}{2}{3}{4}{5}",
                "D": "{0}-{1}-{2}-{3}{4}-{5}",
                "B": "{{0}-{1}-{2}-{3}{4}-{5}}",
                "P": "({0}-{1}-{2}-{3}{4}-{5})"
            },
            vals = [
                rand(32),
                rand(16),
                0x4000 | rand(12),
                0x80 | rand(6),
                rand(8),
                rand(48)
            ],
            result = formats[format] || formats[defaultFormat];

        result = result.replace("{0}", prepareVal(vals[0], 8));
        result = result.replace("{1}", prepareVal(vals[1], 4));
        result = result.replace("{2}", prepareVal(vals[2], 4));
        result = result.replace("{3}", prepareVal(vals[3], 2));
        result = result.replace("{4}", prepareVal(vals[4], 2));
        result = result.replace("{5}", prepareVal(vals[5], 12));
        return result;
    };
})(this, App || {});

/*global App*/

/// <reference path="base.js" />
/// <reference path="thenable.js" />
/// <reference path="obj.js" />
/// <reference path="str.js" />

/*
* Copyright(c) Archway Inc. All rights reserved.
*/
(function (global, App) {

    "use strict";

    var customMaybePromise = null;

    /**
     * 定義を保持してバリデーションを実行するオブジェクトを定義します。
     */
    function Validator(definition, options) {
        this._context = {
            def: definition || {},
            options: options || {}
        };
    }
    function maybePromise(callback){
        if(App.isFunc(customMaybePromise)){
            return customMaybePromise(callback);
        }
        return App.thenable(callback);
    }

    var isEmpty = function (value) {
            return App.isUndef(value) || App.isNull(value) || (App.isStr(value) && value.length === 0);
        },
        //バリデーションメソッド
        methods = {
            //required は特別扱いのため、内部で定義
            required: {
                name: "required",
                handler: function (value, context, done) {
                    if (!context.parameter) { //param が falsy だったら必須ではない
                        done(true);
                    }
                    done(!isEmpty(value));
                },
                priority: -1
            }
        },
        //メッセージの保持
        messages = {
            required: "this item required"
        },
        //validate関数に渡された引数を整形します。
        prepareValidateArgs = function (args) {
            var result = {
                values: {},
                options: {}
            };
            // 引数が2つで第１引数が文字列の場合は、 validate("item1", "value") のように
            // 項目名と値が渡されたとみなす
            if (args.length === 2 && App.isStr(args[0])) {
                result.values[args[0]] = args[1];
                result.options = args[2] || {};
                return result;
            } else {
                result.values = args[0] || {};
                //先頭が文字列または配列の場合はターゲットとなるグループが指定されたとみなします。
                if (App.isStr(args[1])) {
                    result.options = {
                        groups: [args[1]]
                    };
                } else if (App.isArray(args[1])) {
                    result.options = {
                        groups: args[1]
                    };
                } else {
                    //上記以外はオブジェクトでオプション全体が渡されたとみなします。
                    result.options = args[1] || {};
                }
                return result;
            }
        },
        prepareExecuteTargets = function (targets, defs) {
            var result = {},
                defKey, def,
                groups,
                hasGroup;

            if (!targets) {
                return defs;
            }
            if (App.isStr(targets)) {
                targets = [targets];
            }
            if (!App.isArray(targets)) {
                return defs;
            }
            for (defKey in defs) {
                if (!defs.hasOwnProperty(defKey)) {
                    continue;
                }
                def = defs[defKey];
                groups = App.isStr(def.groups) ? [def.groups] :
                         App.isArray(def.groups) ? def.groups : [];
                /*eslint-disable no-loop-func*/
                hasGroup = targets.some(function (value) {
                    return groups.indexOf(value) > -1 || groups.length === 0;
                });
                /*eslint-enable no-loop-func*/
                if (hasGroup) {
                    result[defKey] = defs[defKey];
                }
            }
            return result;
        },
        getMessage = function (item, value, method, rules, msgs, opts, isCustom) {
            var format = msgs[method] || messages[method] || "";
            return App.str.format(format, App.obj.mixin({}, opts, {
                value: value,
                item: item,
                method: method,
                param: isCustom ? "" : rules[method]
            }));
        },
        //バリデーションメソッドを順番に実行します。
        executeFirstMethod = function (item, defer, execMethods, value, rules, msgs, opts, grps, execOptions) {
            var execMethod,
                callback = function (result) {
                    if (!result) {
                        return defer.reject({
                            item: item,
                            message: getMessage(item, value, execMethod.name, rules, msgs, opts, execMethod.isCustom)
                        });
                    } else {
                        executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, execOptions);
                    }
                },
                filter = execOptions.filter || function () { return true; };
            //バリデーションメソッドがない場合は、すべて完了してエラーがなかったとみなし
            //成功で完了する
            if (!execMethods.length) {
                return defer.resolve({
                    item: item
                });
            }

            execMethod = execMethods.shift();
            if (!execMethod || !App.isFunc(execMethod.handler)) {
                executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, execOptions);
            } else {
                if (filter(item, execMethod.name, execOptions.state, {
                    item: item,
                    rule: execMethod.name,
                    options: opts,
                    groups: grps,
                    executeOptions: execOptions,
                    executeGroups: execOptions.groups,
                        targetElements: execOptions.elements || {}
                })) {
                    execMethod.handler(value, {
                        item: item,
                        rule: execMethod.name,
                        custom: !!execMethod.isCustom,
                        parameter: execMethod.isCustom ? undefined : rules[execMethod.name],
                        options: opts,
                        //grops: grps,
                        //targetGroups: execOptions.groups,
                        state: execOptions.state,
                        targetElements: execOptions.elements || {}
                    }, callback);
                } else {
                    executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, execOptions);
                }
            }
        },
        //項目ごとのバリデーションを実行します。
        validateItem = function (item, values, options, defs) {
            return App.thenable(function(fullfille, reject){
                var defer = {
                        resolve: fullfille,
                        reject: reject
                    },
                    value = values[item],
                    def = defs[item],
                    rules = def.rules || {},
                    msgs = def.messages || {},
                    opts = def.options || {},
                    grps = def.groups,
                    method, targetMethod,
                    execMethods = [];

                for (method in rules) {
                    if (!rules.hasOwnProperty(method)) {
                        continue;
                    }
                    targetMethod = methods[method];
                    if (!targetMethod) {
                        if (!App.isFunc(rules[method])) {
                            throw new Error("custom method value must be function");
                        }
                        //methodが登録されておらず値が定義の値が関数の場合は
                        //カスタムmethodとして利用。但し優先度は最低に設定
                        targetMethod = {
                            isCustom: true,
                            name: method,
                            handler: rules[method],
                            priority: Number.MAX_VALUE
                        };
                    }
                    execMethods.push(targetMethod);
                }
                //優先度順にソートします。
                execMethods.sort(function (left, right) {
                    if (left.priority < right.priority) {
                        return -1;
                    }
                    if (left.priority > right.priority) {
                        return 1;
                    }
                    return 0;
                });
                executeFirstMethod(item, defer, execMethods, value, rules, msgs, opts, grps, options);
            });
        },
        toNum = function (val) {
            if (isEmpty(val)) {
                return (void 0);
            }
            if (!App.isNum(val)) {
                if (App.isNumeric(val)) {
                    return parseFloat(val);
                } else {
                    return (void 0);
                }
            }
            return val;
        };

    Validator.prototype = {
        /**
        * 定義内に指定されたアイテム名があるかどうかを取得します。
        */
        hasItem: function (itemName) {
            var def;
            if (!this._context) {
                return false;
            }
            def = this._context.def;
            return !!def[itemName];
        },
        /**
        * 指定された値のバリデーションを実行します。
        */
        validate: function (values, options) {
            var that = this,
                args = Array.prototype.slice.call(arguments);

            return maybePromise(function(fullfille, reject) {
                var successes = [],
                    fails = [],
                    count = 0,
                    completed = false,
                    arg, defs, item,
                    keys = [], i, l,
                    execTargets,
                    //全てのvalidationItemの実行が完了したかをチェックして
                    //完了していた場合、promise を完了させます。
                    checkComplete = function () {
                        var result;
                        if (!completed && (successes.length + fails.length) >= count) {
                            completed = true;
                            result = {
                                successes: successes,
                                fails: fails
                            };
                            //validate のオプションに beforeReturnResult 関数が指定されている場合は、
                            //実行します。
                            if (App.isFunc(options.beforeReturnResult)) {
                                options.beforeReturnResult(result, options.state);
                            }
                            //validator のオプションに success 関数または fail 関数が指定されている場合は、
                            //success 関数には成功データ、fail 関数には失敗データを渡して実行します。
                            if (that._context && that._context.options) {
                                if (App.isFunc(that._context.options.success)) {
                                    that._context.options.success(result.successes, options.state);
                                }
                                if (App.isFunc(that._context.options.fail)) {
                                    that._context.options.fail(result.fails, options.state);
                                }
                                if (App.isFunc(that._context.options.always)) {
                                    that._context.options.always(result.successes, result.fails, options.state);
                                }
                            }
                            //結果を deferred に設定します。
                            (result.fails.length ? reject : fullfille)(result, options.state);
                        }
                    };

                if (!that._context || !that._context.def) {
                    return fullfille();
                }
                arg = prepareValidateArgs(args);
                defs = that._context.def;
                values = arg.values;
                options = arg.options;
                execTargets = prepareExecuteTargets(options.groups, defs);

                for (item in values) {
                    if (!values.hasOwnProperty(item) || !(item in execTargets)) {
                        continue;
                    }
                    keys.push(item);
                    count++;
                }

                for (i = 0, l = keys.length; i < l; i++) {
                    item = keys[i];
                    //validationItemを実行し、結果を保存します。
                    /*eslint-disable no-loop-func */
                    validateItem(item, values, options, execTargets).then(function (result) {
                        successes.push(result);
                        checkComplete();
                    }, function (result) {
                        fails.push(result);
                        checkComplete();
                    });
                    /*eslint-enable no-loop-func */
                }
                //すべてのvalidationItemが完了しているかをチェックします。
                //非同期バリデーションが含まれていない場合は、この時点で完了されていますが、
                //非同期バリデーションが含まれている場合は、この時点では完了していません。
                checkComplete();
            });
        }
    };
    /**
    * Validation オブジェクトを指定された定義およびオプションで作成します。
    */
    App.validation = function (definition, options) {
        if (definition instanceof Validator) {
            definition._context.options = App.obj.mixin({}, options, definition._context.options);
            return definition;
        }
        return new Validator(definition, options);
    };

    /**
    * Validation 用の関数を追加します。
    */
    App.validation.addMethod = function (name, handler, message, priority) {
        methods[name] = {
            name: name,
            handler: handler,
            priority: (!App.isNum(priority) || isNaN(priority) || isFinite(priority)) ? 10 : Math.max(0, priority)
        };
        messages[name] = message || "";
    };

    /**
    * Validatin 用の関数を削除します。
    */
    App.validation.removeMethod = function (name) {
        if (name in methods) {
            delete methods[name];
        }
        if (name in messages) {
            delete messages[name];
        }
    };
    /**
     * 指定された名前のメソッドが登録されているかどうかを取得します。
     */
    App.validation.hasMethod = function(name){
        return name in methods;
    };
    /**
     * 指定された名前で登録されているメソッドのメッセージを設定します。
     */
    App.validation.setMessage = function(name, message){
        if(name in methods) {
            messages[name] = message + "";
        }
    };
    /**
     * 指定された名前で登録されているメソッドのメッセージを取得します。
     */
    App.validation.getMessage = function(name) {
        return messages[name];
    };
    /**
    * 指定された値が空かどうかをチェックします。
    * これは required メソッドと同じチェックが実行されます。
    */
    App.validation.isEmpty = isEmpty;

    /**
     * validationメソッドの戻り値のPromiseを設定します。
     */
    App.validation.setReturnPromise = function(promise){
        customMaybePromise = promise;
    };

    /**
    * 指定された値が数値のみかどうかを検証します。
    * 値が空の場合は、検証を実行しない為成功となります。
    */
    App.validation.addMethod("digits", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        value = "" + value;
        done(/^\d+$/.test(value));

    }, "digits only");
    /**
     * 指定された値が整数値かどうかを検証します。
     * 値が空の場合は、けんしょうを実行しないため成功となります。
     */
    App.validation.addMethod("integer", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        if (App.isNum(value)) {
            return done(isFinite(value) && value > -9007199254740992 && value < 9007199254740992 && Math.floor(value) === value);
        }
        value = "" + value;
        done(value === "0" || /^\-?[1-9][0-9]*$/.test(value));
    }, "a invalid integer");

    /**
    * 指定された値が数値かどうかを検証します。
    * 値が空の場合は、検証を実行しない為成功となります。
    */
    App.validation.addMethod("number", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        done(App.isNumeric(value));
    }, "a invalid number");

    /**
    * 指定された値がパラメーターで指定された値以上かどうかを検証します。
    * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
    * 検証を実行しない為成功となります。
    */
    App.validation.addMethod("min", function (value, context, done) {
        var val, param;

        if (isEmpty(value)) {
            return done(true);
        }

        val = toNum(value);
        param = toNum(context.parameter);
        if (App.isUndef(val) || App.isUndef(param)) {
            return done(true);
        }
        return done(val >= param);
    }, "a value greater than or equal to {param}");
    /**
    * 指定された値がパラメーターで指定された値以下かどうかを検証します。
    * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
    * 検証を実行しない為成功となります。
    */
    App.validation.addMethod("max", function (value, context, done) {
        var val, param;
        if (isEmpty(value)) {
            return done(true);
        }
        val = toNum(value);
        param = toNum(context.parameter);
        if (App.isUndef(val) || App.isUndef(param)) {
            return done(true);
        }
        return done(val <= param);
    }, "a value less than or equal to {param}");

    /**
    * 指定された値がパラメーターで指定された配列のインデックス 0 に指定されている値以上、
    * インデックス 1 に指定されている値以下かどうかを検証します。
    * 値が空または数値に変換できない場合、およびパラメーターが配列でないもしくはインデックス 0 と 1 が数値に変換できない場合は
    * 検証を実行しない為成功となります。
    */
    App.validation.addMethod("range", function (value, context, done) {
        var val, param = [];

        if (isEmpty(value)) {
            return done(true);
        }

        if (!App.isArray(context.parameter)) {
            return done(true);
        }
        val = toNum(value);
        param[0] = toNum(context.parameter[0]);
        param[1] = toNum(context.parameter[1]);
        if (App.isUndef(val) || App.isUndef(param[0]) || App.isUndef(param[1])) {
            return done(true);
        }
        return done(val >= param[0] && val <= param[1]);
    }, "a value between {param[0]} and {param[1]}");

})(this, App);

/* global App */

/// <reference path="base.js" />
/// <reference path="validation.js" />

/*
* バリデーションを拡張するメソッドを定義します。
* Copyright(c) Archway Inc. All rights reserved.
*/
(function (global, App) {

    "use strict";

    var isEmpty = App.validation.isEmpty;

    /**
     * 指定された値がパラメーターで指定された値より長い文字列かどうかを検証します。
     * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
     * 検証を実行しない為成功となります。
     */
    App.validation.addMethod("minlength", function (value, context, done) {

        if (isEmpty(value)) {
            return done(true);
        }
        if (!App.isNum(context.parameter)) {
            return done(true);
        }

        value = App.isNum(value) && App.isNumeric(value) ? value + "" : value;
        var length = App.isArray(value) ? value.length : App.str.trim(value).length;

        done((((value || "") + "") === "") || (length >= context.parameter));

    }, "at least {param} characters");

    /**
     * 指定された値がパラメーターで指定された値より短い文字列かどうかを検証します。
     * 値が空または数値に変換できない場合、およびパラメーターが数値に変換できない場合は
     * 検証を実行しない為成功となります。
     */
    App.validation.addMethod("maxlength", function (value, context, done) {

        if (isEmpty(value)) {
            return done(true);
        }
        if (!App.isNum(context.parameter)) {
            return done(true);
        }
        value = App.isNum(value) && App.isNumeric(value) ? value + "" : value;
        var length = App.isArray(value) ? value.length : App.str.trim(value).length;

        done(((value || "") + "") === "" || length <= context.parameter);

    }, "no more than {param} characters");

    App.validation.addMethod("rangelength", function (value, context, done) {
        var param = context.parameter;

        if (isEmpty(value)) {
            return done(true);
        }
        if (!App.isArray(param)) {
            return done(true);
        }
        if (!App.isNum(param[0])) {
            return done(true);
        }
        if (!App.isNum(param[0])) {
            return done(true);
        }

        value = App.isNum(value) && App.isNumeric(value) ? value + "" : value;
        var length = App.isArray(value) ? value.length : App.str.trim(value).length;

        done(((value || "") + "") === "" || (length >= param[0] && length <= param[1]));

    }, "a value between {param[0]} and {param[1]} characters long");

    /**
     * 文字列で指定された数値の小数点の桁数を検証します。
     * e.g. decimallength: 2 (2桁まで)
     */
    App.validation.addMethod("decimalmaxlength", function (value, context, done) {
        var param = context.parameter;

        //桁数が数値でない場合はバリデーションを実行できない為、 true で返す。
        if (!App.isNum(param)) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        var target = value + "";
        //そもそも数時とみなせるか(hexやoct、指数は対象外)
        if (!/^(-?)((([1-9]([0-9]*))(\.[0-9]+)?)|(0(\.[0-9]+)?))$/.test(target)) {
            //数値とみなせない場合は処理をしない為 true で返す。
            //バリデーションとしては同時にnumberかどうかのバリデーションを設定するべき
            return done(true);
        }
        done((target.split(".")[1] || "").length <= param);
    }, "max decimal length {param}");

    /**
     * 日付型のバリデーションを指定します。
     */
    App.validation.addMethod("date", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        var regex = /Invalid|NaN/;

        done(((value || "") + "") === "" || !regex.test(new Date(value).toString()));

    }, "日付の値が不正です。");

    /**
     * 日付文字列のバリデーションを指定します。
     */
    App.validation.addMethod("datestring", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }

        if (value === "") {
            return done(true);
        }

        if (!(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(value))) {
            return done(false);
        }

        var year = parseInt(value.substr(0, 4), 10);
        var month = parseInt(value.substr(5, 2), 10);
        var day = parseInt(value.substr(8, 2), 10);
        var inputDate = new Date(year, month - 1, day);

        done((inputDate.getFullYear() === year && inputDate.getMonth() === month - 1 && inputDate.getDate() === day));

    }, "日付の値が不正です。");

    /**
     * 長い形式（yyyy年MM月dd日）の日付文字列のバリデーションを指定します。
     */
    App.validation.addMethod("datelongstring", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }

        if (value === "") {
            return done(true);
        }

        if (!(/^[0-9]{4}年[0-9]{2}月[0-9]{2}日$/.test(value))) {
            return done(false);
        }

        var year = parseInt(value.substr(0, 4), 10);
        var month = parseInt(value.substr(5, 2), 10);
        var day = parseInt(value.substr(8, 2), 10);
        var inputDate = new Date(year, month - 1, day);

        done((inputDate.getFullYear() === year && inputDate.getMonth() === month - 1 && inputDate.getDate() === day));

    }, "日付の値が不正です。");


    /**
     * 時刻(HH:mm)のバリデーションを指定します。
     */
    App.validation.addMethod("hourminute", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        value = value + "";
        if (!(/^[0-9]{2}:[0-9]{2}$/.test(value))) {
            return done(false);
        }
        var hour = parseInt(value.substr(0, 2), 10);
        var minute = parseInt(value.substr(3, 2), 10);

        done(hour > -1 && hour < 25 && minute > -1 && hour < 60);
    }, "a invalid time");

    /**
     * 年月(yyyy/MM)のバリデーションを指定します。
     */
    App.validation.addMethod("yearmonth", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }
        value = value + "";
        if (!(/^[1-9][0-9]{0,3}\/[0-1][0-9]$/.test(value))) {
            return done(false);
        }

        var yearMonth = value.split("/");
        var month = parseInt(yearMonth[1], 10);
        //yearは正規表現上で0にならないことが確定しているためOK
        //monthは00の場合だけ正規表現を通ってしまうため、parseIntして1以上12以下でチェック

        done(month >= 1 && month <= 12);
    }, "a invalid year month");

    /**
     * 文字列の正規表現バリデーションを指定します。
     */
    App.validation.addMethod("regex", function (value, context, done) {

        if (isEmpty(value)) {
            return done(true);
        }

        var regex = new RegExp(context.parameter);
        done(regex.test(value));

    }, "a invalid text");

    /**
     * 全角のみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("zenkaku", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isStr(value) ? value + "" : value;
        var regex = /^[^ -~｡-ﾟ]+$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "全角を入力してください");

    /**
     * 半角のみかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("hankaku", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isStr(value) ? value + "" : value;
        if (((value || "") + "") !== ""
            && !/^([ -~｡-ﾟ]+)$/.test(value)) {
            return done(false);
        }

        done(true);

    }, "半角を入力してください");

    /**
     * 半角文字のみで且つ半角カナが含まれていないかどうかのバリデーションを指定します。
     */
    App.validation.addMethod("haneisukigo", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }

        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) ? value + "" : value;
        if (((value || "") + "") !== ""
            && (/([ァ-ヶーぁ-ん]+)/.test(value) || /([ｧ-ﾝﾞﾟ]+)/.test(value) || /([ａ-ｚーＡ-Ｚ]+)/.test(value))) {
            return done(false);
        }

        done(true);

    }, "半角英数記号を入力してください");

    /**
     * 電話番号（例:012-345-6789）かどうかのバリデーションを指定します。
     */
    App.validation.addMethod("telnum", function (value, context, done) {
        if (!context.parameter) {
            return done(true);
        }
        if (isEmpty(value)) {
            return done(true);
        }

        value = App.isNum(value) && App.isNumeric(value) ? value + "" : value;
        var regex = /^[0-9-]{12}$/;

        done(((value || "") + "") === "" || regex.test(value));

    }, "電話番号を入力してください（例:012-345-6789）");


})(this, App);

/**
 * Evaluate json value.
 * @function evaljson
 * @param {object} src - Source data.
 * @param {object...} [data=src] - Evaluating data.
 * @returns {object} - Evaluated data.
 */

"use strict";

var objnest = require('objnest'),
    extend = require('extend'),
    argx = require('argx');

function _embed(src, values) {
    var dest = extend({}, src);
    Object.keys(dest).forEach(function (key) {
        var value = dest[key];
        switch (typeof(value)) {
            case 'object':
                dest[key] = _embed(value, values);
                break;
            case 'string':
                dest[key] = value.replace(/(#\{)(.*?)(\})/g, function ($0, $1, $2) {
                    var valid = values.hasOwnProperty($2);
                    if (valid) {
                        return values[$2];
                    } else {
                        throw new Error('Unknown expression:' + $2);
                    }
                });
                break;
            default:
                break;
        }
    });
    return dest;
}

/** @lends evaljson */
function evaljson(src, data) {
    var args = argx(arguments);
    src = args.shift('object') || {};
    data = args.remain();

    var dict = extend.apply(extend, [{}, src].concat(data));
    return _embed(src, objnest.flatten(dict));
}

module.exports = evaljson;
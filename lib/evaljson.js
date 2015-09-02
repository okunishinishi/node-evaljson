/**
 * Evaluate json value.
 * @function evaljson
 * @param {object} src - Source data.
 * @param {object...} [data=src] - Evaluating data.
 * @returns {object} - Evaluated data.
 */

"use strict";

var objnest = require('objnest'),
    argx = require('argx'),
    extend = require('extend'),
    embedValues = require('./embed_values');


/** @lends evaljson */
function evaljson(src, data) {
    var args = argx(arguments);
    src = args.shift('object') || {};
    data = args.remain();

    var dict = extend.apply(extend, [{}, src].concat(data));
    return embedValues(src, objnest.flatten(dict));
}

module.exports = evaljson;
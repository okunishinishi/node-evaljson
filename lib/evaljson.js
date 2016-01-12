/**
 * Evaluate json value.
 * @function evaljson
 * @param {object} src - Source data.
 * @param {object...} [data=src] - Evaluating data.
 * @returns {object} - Evaluated data.
 */

"use strict";

const objnest = require('objnest'),
    argx = require('argx'),
    embedValues = require('./embed_values');

/** @lends evaljson */
function evaljson(src, data) {
    let args = argx(arguments);
    src = args.shift('object') || {};
    data = args.remain();

    let dict = Object.assign.apply(Object, [{}, src].concat(data));
    return embedValues(src, objnest.flatten(dict));
}

module.exports = evaljson;
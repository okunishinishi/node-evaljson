/**
 * Embed values.
 * @memberof module:eval-json/lib
 * @function embed
 * @param {object} src - Source object.
 * @param {object} values - Values to embed.
 * @returns {object} - Emebed
 */

"use strict";

/** @lends embedValues */
function embedValues(src, scope) {
    if (Array.isArray(src)) {
        return src.map((src) => embedValues(src, scope));
    }
    switch (typeof(src)) {
        case 'object':
        {
            let result = Object.assign({}, src);
            Object.keys(result).forEach((key) => {
                let value = result[key];
                result[key] = embedValues(value, scope);
            });
            return result;
        }
        case 'string':
        {

            return _parseString(src, scope);
        }
        default:
        {
            return src;
        }
    }
}

function _parseString(value, scope) {
    return value.replace(/(#\{)(.*?)(\})/g, ($0, $1, $2) => {
        let valid = scope.hasOwnProperty($2);
        if (valid) {
            return scope[$2];
        } else {
            throw new Error('Unknown expression:' + $2);
        }
    });
}

module.exports = embedValues;

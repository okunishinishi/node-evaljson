/**
 * Embed values.
 * @memberof module:eval-json/lib
 * @function embed
 * @param {object} src - Source object.
 * @param {object} values - Values to embed.
 * @returns {object} - Emebed
 */

"use strict";

const extend = require('extend');

/** @lends embedValues */
function embedValues(src, values) {
    let dest = extend({}, src);
    Object.keys(dest).forEach((key) => {
        var value = dest[key];
        switch (typeof(value)) {
            case 'object':
                dest[key] = embedValues(value, values);
                break;
            case 'string':
                dest[key] = value.replace(/(#\{)(.*?)(\})/g, ($0, $1, $2) => {
                    let valid = values.hasOwnProperty($2);
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

module.exports = embedValues;

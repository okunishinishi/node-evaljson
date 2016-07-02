/**
 * Embed values.
 * @memberof module:eval-json/lib
 * @function embed
 * @param {object} src - Source object.
 * @param {object} values - Values to embed.
 * @returns {object} - Embed value.
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var objnest = require('objnest');

/** @lends embedValues */
function embedValues(src, scope) {
  scope = Object.assign({}, objnest.expand(scope || {}));
  if (Array.isArray(src)) {
    return src.map(function (src) {
      return embedValues(src, scope);
    });
  }
  switch (typeof src === 'undefined' ? 'undefined' : _typeof(src)) {
    case 'object':
      return embedValues.parseObject(src, scope);
    case 'string':
      return embedValues.parseString(src, scope);
    default:
      return src;
  }
}

Object.assign(embedValues, {
  parseString: function parseString(value, scope) {
    var context = Object.keys(scope).map(function (name) {
      var varName = name.replace(/[\/\-:]/g, '_');
      if (/^[0-9]/.test(varName)) {
        varName = '_' + varName;
      }
      return 'let ' + varName + '=scope[\'' + name + '\']';
    }).join(';');
    return value.replace(/(#\{)(.*?)(})/g, function ($0, $1, $2) {
      try {
        // noinspection Eslint
        return new Function('scope', '"use strict";' + context + ';return ' + $2)(scope);
      } catch (e) {
        throw new Error('[evaljson] Invalid expression: ' + $2 + ' (' + e + ')');
      }
    });
  },
  parseObject: function parseObject(value, scope) {
    var result = Object.assign({}, value);
    Object.keys(result).forEach(function (key) {
      var value = result[key];
      result[key] = embedValues(value, scope);
    });
    return result;
  }
});

module.exports = embedValues;
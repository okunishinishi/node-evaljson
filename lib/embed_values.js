/**
 * Embed values.
 * @memberof module:eval-json/lib
 * @function embed
 * @param {object} src - Source object.
 * @param {object} values - Values to embed.
 * @returns {object} - Embed value.
 */

'use strict'

const objnest = require('objnest')

/** @lends embedValues */
function embedValues (src, scope) {
  scope = Object.assign({}, objnest.expand(scope || {}))
  if (Array.isArray(src)) {
    return src.map((src) => embedValues(src, scope))
  }
  switch (typeof src) {
    case 'object':
      return embedValues.parseObject(src, scope)
    case 'string':
      return embedValues.parseString(src, scope)
    default:
      return src
  }
}

Object.assign(embedValues, {
  parseString (value, scope) {
    let context = Object.keys(scope).map((name) => `let ${name}=scope.${name};`).join(';')
    return value.replace(/(#\{)(.*?)(})/g, ($0, $1, $2) => {
      try {
        // noinspection Eslint
        return (new Function('scope', `"use strict";${context};return ${$2}`))(scope)
      } catch (e) {
        throw new Error(`[evaljson] Invalid expression: ${$2} (${e})`)
      }
    })
  },
  parseObject (value, scope) {
    let result = Object.assign({}, value)
    Object.keys(result).forEach((key) => {
      let value = result[ key ]
      result[ key ] = embedValues(value, scope)
    })
    return result
  }
})

module.exports = embedValues

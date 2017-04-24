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
    if (typeof global !== 'undefined') {
      scope = Object.assign({}, global, scope)
    }
    if (typeof window !== 'undefined') {
      scope = Object.assign({}, window, scope)
    }
    let context = Object.keys(scope)
      .filter((name) => !/[@\-\s]/.test(name))
      .filter((name) => !/^\d/.test(name))
      .map((name) => {
        let varName = name.replace(/[\/\-:]/g, '_')
        if (/^[0-9]/.test(varName)) {
          varName = `_${varName}`
        }
        return `let ____${varName}=scope['${name}']`
      }).join(';')
    return value
      .replace(/(#\{)(.*?)(})/g, ($0, $1, $2) => {
        try {
          // noinspection Eslint
          return (new Function('scope', `"use strict";${context};return ____${$2}`))(scope)
        } catch (e) {
          throw new Error(`[evaljson] Invalid expression: ${$2} (${String(e).replace('____', '')})`)
        }
      })
      .replace(/(\$\()(.*?)(\))/g, ($0, $1, $2) => {
        try {
          // Require here for browser support
          const { execSync } = require('child_process')
          return String(execSync($2)).trim()
        } catch (e) {
          throw new Error(`[evaljson] Invalid script: "${$2}" (${e})`)
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

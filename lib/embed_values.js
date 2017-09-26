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
  copyVarsToScope (vars, scope) {
    scope = Object.assign({}, scope)
    for (const key of Object.keys(vars)) {
      const skip = /^webkit/.test(key) || /^moz/.test(key) || /^ms/.test(key) || scope.hasOwnProperty(key)
      if (skip) {
        continue
      }
      scope[key] = vars[key]
    }
    return scope
  },

  parseString (value, scope) {
    scope = embedValues.preparedScope(scope)
    const context = Object.keys(scope)
      .filter((name) => !/[@\-\s]/.test(name))
      .filter((name) => !/^\d/.test(name))
      .map((name) => {
        let varName = name.replace(/[\/\-:]/g, '_')
        if (/^[0-9]/.test(varName)) {
          varName = `_${varName}`
        }
        return `let ____${varName}=scope['${name}']`
      }).join(';')

    const result = value
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
          const {execSync} = require('child_process')
          return String(execSync($2)).trim()
        } catch (e) {
          throw new Error(`[evaljson] Invalid script: "${$2}" (${e})`)
        }
      })
    return result
  },
  parseObject (value, scope) {
    scope = embedValues.preparedScope(scope)
    const result = Object.assign({}, value)
    for (const key of Object.keys(result)) {
      const value = result[key]
      result[key] = embedValues(value, scope)
    }
    return result
  },
  preparedScope (scope) {
    const needsInjectGlobal = typeof global !== 'undefined' && !scope.$$globalInjected
    if (needsInjectGlobal) {
      scope = embedValues.copyVarsToScope(global, scope)
      scope.$$globalInjected = true
    }
    const needsInjectWindow = typeof window !== 'undefined' && !scope.$$windowInjected
    if (needsInjectWindow) {
      scope = embedValues.copyVarsToScope(window, scope)
      scope.$$windowInjected = true
    }
    return scope
  }
})

module.exports = embedValues

/* global global, window */

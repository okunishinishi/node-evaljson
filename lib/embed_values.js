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
  if (!scope.$$expanded) {
    scope = Object.assign({}, objnest.expand(scope || {}))
    scope.$$expanded = true
  }
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

    const context = embedValues.contextWithScope(scope)
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
  },

  contextWithScope (scope) {
    if (scope.$$context) {
      return scope.$$context
    }
    const sentences = []
    for (const name of Object.keys(scope)) {
      const skip = /[@\-\s]|^\d/.test(name)
      if (skip) {
        continue
      }
      let varName = name.replace(/[\/\-:]/g, '_')
      sentences.push(`const ____${varName}=scope['${name}']`)
    }
    const context = sentences.join(';')
    scope.$$context = context
    return context
  }
})

module.exports = embedValues

/* global global, window */

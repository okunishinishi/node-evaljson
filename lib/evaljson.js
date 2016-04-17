/**
 * Evaluate json value.
 * @function evaljson
 * @param {object} src - Source data.
 * @param {object...} [data=src] - Evaluating data.
 * @returns {object} - Evaluated data.
 */

'use strict'

const argx = require('argx')
const embedValues = require('./embed_values')

/** @lends evaljson */
function evaljson (src, data) {
  let args = argx(arguments)
  src = args.shift('string|object') || {}
  data = args.remain()
  if (typeof src === 'string') {
    return evaljson.apply(evaljson, [ { value: src } ].concat(data)).value
  }
  let dict = Object.assign.apply(Object, [ {}, src ].concat(data))
  return embedValues(src, dict)
}

module.exports = evaljson

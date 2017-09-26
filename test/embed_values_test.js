/**
 * Test case for embedValues.
 * Runs with mocha.
 */
'use strict'

const embedValues = require('../lib/embed_values.js')
const assert = require('assert')

describe('embed-values', () => {
  before((done) => {
    done()
  })

  after((done) => {
    done()
  })

  it('Embed values', (done) => {
    let values = embedValues({
      foo: '#{bar.baz}',
      quz: '$(ls)'
    }, {
      'bar.baz': 'hoge'
    })

    assert.equal(values.foo, 'hoge')
    assert.ok(values.quz)
    done()
  })

  it('Handle large object', () => {
    const obj = new Array(10000)
      .fill(null)
      .reduce((reduced, v, i) => Object.assign(reduced, {
        [`prop-${i}`]: '#{bar.baz}'
      }), {})

    console.log(embedValues(obj, {bar: {baz: 'hoge'}}))
  })
})

/* global describe, before, after, it */

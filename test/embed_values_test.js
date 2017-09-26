/**
 * Test case for embedValues.
 * Runs with mocha.
 */
'use strict'

const embedValues = require('../lib/embed_values.js')
const {ok, equal} = require('assert')

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

    equal(values.foo, 'hoge')
    ok(values.quz)
    done()
  })

  it('Handle large object', () => {
    const obj = new Array(10000)
      .fill(null)
      .reduce((reduced, v, i) => Object.assign(reduced, {
        [`prop-${i}`]: '#{bar.baz}'
      }), {})

    console.time('large')
    ok(embedValues(obj, {bar: {baz: 'hoge'}}))
    console.timeEnd('large')
  })
})

/* global describe, before, after, it */

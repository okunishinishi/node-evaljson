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
})

/* global describe, before, after, it */

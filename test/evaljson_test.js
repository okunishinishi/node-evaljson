/**
 * Test for evajson.
 * Runs with mocha.
 */

'use strict'

const evaljson = require('../lib/evaljson')
const assert = require('assert')

global['@@hoge'] = 'hoge'
global['1234'] = '1234'
global['foo-bar'] = 'foo-bar'
global['foo bar'] = 'foo bar'

describe('evaljson', () => {
  it('Evaluate json files.', (done) => {
    let data = evaljson({
      foo: {
        'bar': 'quz=#{foo.bar2}',
        'bar2': 'This is bar 2.'
      }
    })
    assert.deepEqual(data, {
      foo: {
        bar: 'quz=This is bar 2.', bar2: 'This is bar 2.'
      }
    })
    done()
  })

  it('Local data.', (done) => {
    let locale = evaljson({
      keys: {
        'NAME': 'My Awesome App'
      },
      titles: {
        'WELCOME_TITLE': 'Welcome to #{keys.NAME}!'
      }
    })

    assert.equal(locale.titles['WELCOME_TITLE'], 'Welcome to My Awesome App!')
    done()
  })

  it('With pathname.', (done) => {
    let data = evaljson({
      foo: {
        bar: 'baz'
      },
      'some/path': 'hoge',
      quz: [
        '#{foo.bar}'
      ]
    })
    assert.deepEqual(data, {
      foo: {bar: 'baz'},
      'some/path': 'hoge',
      quz: ['baz']
    })
    done()
  })

  it('With array.', (done) => {
    let data = evaljson({
      foo: {
        bar: 'baz'
      },
      quz: [
        '#{foo.bar}'
      ]
    })
    assert.deepEqual(data, {foo: {bar: 'baz'}, quz: ['baz']})
    done()
  })

  it('With func', (done) => {
    let data = evaljson({
      bar: '#{addFoo("baz")}'
    }, {
      addFoo (val) {
        return `foo:${val}`
      }
    })
    assert.deepEqual(data, {bar: 'foo:baz'})
    done()
  })

  it('Eval string', (done) => {
    let data = evaljson(
      'This is #{bar}',
      {
        bar: '"Yes, bar"'
      }
    )
    assert.equal(data, 'This is "Yes, bar"')
    done()
  })

  it('Reserved Words.', (done) => {
    let data = evaljson({
      if: '#{condition}',
      condition: true
    })

    assert(data.if)
    done()
  })

  it('Global object.', (done) => {
    let data = evaljson({
      home: '#{process.env.HOME}'
    })

    done()
  })

  // https://github.com/okunishinishi/node-evaljson/issues/4
  it('Too large json', () => {
    const largeSrc = new Array(1000)
      .fill(null)
      .map((_, i) => ({[`key${i}`]: 'foo'}))
      .reduce((obj, h) => Object.assign(obj, h), {})
    console.time('1')
    const vars = evaljson(largeSrc)
    console.timeEnd('1')
  })
})

/* global describe, it */

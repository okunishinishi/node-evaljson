/**
 * Test for evajson.
 * Runs with mocha.
 */

"use strict";

const evaljson = require('../lib/evaljson'),
    assert = require('assert');

describe('evaljson', () => {
    it('Evaluate json files.', (done) => {
        let data = evaljson({
            foo: {
                'bar': 'quz=#{foo.bar2}',
                'bar2': "This is bar 2."
            }
        });
        assert.deepEqual(data, {
            foo: {
                bar: 'quz=This is bar 2.', bar2: 'This is bar 2.'
            }
        });

        let locale = evaljson({
            keys: {
                'NAME': 'My Awesome App'
            },
            titles: {
                'WELCOME_TITLE': "Welcome to #{keys.NAME}!"
            }
        });

        assert.equal(locale.titles['WELCOME_TITLE'], "Welcome to My Awesome App!");
        done();
    });
});

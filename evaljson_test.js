/**
 * Test for evajson.
 * Runs with nodeunit.
 */

"use strict";

var evaljson = require('./evaljson');

exports['Evaluate json files.'] = function (test) {
    var data = evaljson({
        foo: {
            'bar': 'quz=#{foo.bar2}',
            'bar2': "This is bar 2."
        }
    });
    test.deepEqual(data, {
        foo: {
            bar: 'quz=This is bar 2.', bar2: 'This is bar 2.'
        }
    });

    var locale = evaljson({
        keys: {
            'NAME': 'My Awesome App'
        },
        titles: {
            'WELCOME_TITLE': "Welcome to #{keys.NAME}!"
        }
    });

    test.equal(locale.titles['WELCOME_TITLE'], "Welcome to My Awesome App!");
    test.done();
};

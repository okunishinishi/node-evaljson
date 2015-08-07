evaljson
=========

Eval embedded value in json. Useful to define message resource object.

<!-- Badge start -->

[![Build Status][my_travis_badge_url]][my_travis_url]
[![Code Climate][my_codeclimate_badge_url]][my_codeclimate_url]
[![Code Coverage][my_codeclimate_coverage_badge_url]][my_codeclimate_url]
[![npm version][my_npm_budge_url]][my_npm_url]

Usage
-----

```javascript
var evaljson = require('evaljson');

var locale = evaljson({
    keys: {
        "NAME": "My Awesome App"
    },
    titles: {
        "WELCOME_TITLE": "Welcome to #{keys.NAME}!" // Embed value.
    },
    /*...*/
});

console.log(locale.titles['WELCOME_TITLE']); //-> Welcome to My Awesome App!
````

API
---

| Signature | Description |
| --------- | ----------- |
| evaljson(src) | Eval src, with self values as context. |
| evaljson(src, context) | Eval with self values with context. |



Installation
-----

```bash
npm install evaljson --save
```


License
-------
This software is released under the [MIT License][my_license_url].



<!-- Links start -->

[my_repo_url]: https://github.com/okunishinishi/node-evaljson
[my_travis_url]: http://travis-ci.org/okunishinishi/node-evaljson
[my_travis_badge_url]: http://img.shields.io/travis/okunishinishi/node-evaljson.svg?style=flat
[my_license_url]: https://github.com/okunishinishi/node-evaljson/blob/master/LICENSE
[my_codeclimate_url]: http://codeclimate.com/github/okunishinishi/node-evaljson
[my_codeclimate_badge_url]: http://img.shields.io/codeclimate/github/okunishinishi/node-evaljson.svg?style=flat
[my_codeclimate_coverage_badge_url]: http://img.shields.io/codeclimate/coverage/github/okunishinishi/node-evaljson.svg?style=flat
[my_apiguide_url]: http://okunishinishi.github.io/node-evaljson/apiguide
[my_npm_url]: http://www.npmjs.org/package/evaljson
[my_npm_budge_url]: http://img.shields.io/npm/v/evaljson.svg?style=flat

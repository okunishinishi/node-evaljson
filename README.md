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

Eval json string property value with `#{expression}`.

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
```

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

[nodejs_url]: http://nodejs.org/
[npm_url]: https://www.npmjs.com/
[nvm_url]: https://github.com/creationix/nvm
[bitdeli_url]: https://bitdeli.com/free
[my_bitdeli_badge_url]: https://d2weczhvl823v0.cloudfront.net/okunishinishi/node-evaljson/trend.png
[my_repo_url]: https://github.com/okunishinishi/node-evaljson
[my_travis_url]: http://travis-ci.org/okunishinishi/node-evaljson
[my_travis_badge_url]: http://img.shields.io/travis/okunishinishi/node-evaljson.svg?style=flat
[my_license_url]: https://github.com/okunishinishi/node-evaljson/blob/master/LICENSE
[my_codeclimate_url]: http://codeclimate.com/github/okunishinishi/node-evaljson
[my_codeclimate_badge_url]: http://img.shields.io/codeclimate/github/okunishinishi/node-evaljson.svg?style=flat
[my_codeclimate_coverage_badge_url]: http://img.shields.io/codeclimate/coverage/github/okunishinishi/node-evaljson.svg?style=flat
[my_apiguide_url]: http://okunishinishi.github.io/node-evaljson/apiguide
[my_lib_apiguide_url]: http://okunishinishi.github.io/node-evaljson/apiguide/module-evaljson_lib.html
[my_coverage_url]: http://okunishinishi.github.io/node-evaljson/coverage/lcov-report
[my_coverage_report_url]: http://okunishinishi.github.io/node-evaljson/coverage/lcov-report/
[my_gratipay_url]: https://gratipay.com/okunishinishi/
[my_gratipay_budge_url]: http://img.shields.io/gratipay/okunishinishi.svg?style=flat
[my_npm_url]: http://www.npmjs.org/package/evaljson
[my_npm_budge_url]: http://img.shields.io/npm/v/evaljson.svg?style=flat
[my_tag_url]: http://github.com/okunishinishi/node-evaljson/releases/tag/
[my_tag_badge_url]: http://img.shields.io/github/tag/okunishinishi/node-evaljson.svg?style=flat

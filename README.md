evaljson
==========

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![Code Climate][bd_codeclimate_shield_url]][bd_codeclimate_url]
[![Code Coverage][bd_codeclimate_coverage_shield_url]][bd_codeclimate_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]

[bd_repo_url]: https://github.com/okunishinishi/evaljson
[bd_travis_url]: http://travis-ci.org/okunishinishi/evaljson
[bd_travis_shield_url]: http://img.shields.io/travis/okunishinishi/evaljson.svg?style=flat
[bd_license_url]: https://github.com/okunishinishi/evaljson/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/okunishinishi/evaljson
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/okunishinishi/evaljson.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/okunishinishi/evaljson.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/okunishinishi/evaljson
[bd_gemnasium_shield_url]: https://gemnasium.com/okunishinishi/evaljson.svg
[bd_npm_url]: http://www.npmjs.org/package/evaljson
[bd_npm_shield_url]: http://img.shields.io/npm/v/evaljson.svg?style=flat

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Eval embedded value in json. Useful to define message resource object.

<!-- Description End -->



<!-- Sections Start -->
<a name="sections"></a>

Installation
-----

```bash
npm install evaljson --save
```
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



<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/okunishinishi/evaljson/blob/master/LICENSE).

<!-- LICENSE End -->



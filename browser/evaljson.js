(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.argx = require("../lib/index.js");
},{"../lib/index.js":4}],2:[function(require,module,exports){
/**
 * Embed values.
 * @memberof module:eval-json/lib
 * @function embed
 * @param {object} src - Source object.
 * @param {object} values - Values to embed.
 * @returns {object} - Emebed
 */

"use strict";

var extend = require('extend');

/** @lends embedValues */
function embedValues(src, values) {
    var dest = extend({}, src);
    Object.keys(dest).forEach(function (key) {
        var value = dest[key];
        switch (typeof(value)) {
            case 'object':
                dest[key] = embedValues(value, values);
                break;
            case 'string':
                dest[key] = value.replace(/(#\{)(.*?)(\})/g, function ($0, $1, $2) {
                    var valid = values.hasOwnProperty($2);
                    if (valid) {
                        return values[$2];
                    } else {
                        throw new Error('Unknown expression:' + $2);
                    }
                });
                break;
            default:
                break;
        }
    });
    return dest;
}

module.exports = embedValues;

},{"extend":11}],3:[function(require,module,exports){
/**
 * Evaluate json value.
 * @function evaljson
 * @param {object} src - Source data.
 * @param {object...} [data=src] - Evaluating data.
 * @returns {object} - Evaluated data.
 */

"use strict";

var objnest = require('objnest'),
    argx = require('argx'),
    extend = require('extend'),
    embedValues = require('./embed_values');


/** @lends evaljson */
function evaljson(src, data) {
    var args = argx(arguments);
    src = args.shift('object') || {};
    data = args.remain();

    var dict = extend.apply(extend, [{}, src].concat(data));
    return embedValues(src, objnest.flatten(dict));
}

module.exports = evaljson;
},{"./embed_values":2,"argx":6,"extend":11,"objnest":14}],4:[function(require,module,exports){
/**
 * Eval embedded value in json. Useful to define message resource object.
 * @module evaljson
 * @version 1.2.1
 */

"use strict";

var evaljson = require('./evaljson');

module.exports = evaljson;

},{"./evaljson":3}],5:[function(require,module,exports){
/**
 * Parse arguments.
 * @constructor Argx
 * @param {Arguments} args - Function arguments
 */

"use strict";

var typeHits = require('./type/type_hits'),
    isNumber = require('./type/is_number');

/** @lends constructor */
function Argx(args) {
    var s = this;
    s.values = Array.prototype.slice.call(args, 0);
}

Argx.prototype = {
    /**
     * Splice argument values.
     * @param {number} start - Where to start
     * @param {number} [howmany=1] - Number of value to get.
     * @param {string} [type] - Type restriction.
     */
    splice: function (start, howmany, type) {
        var s = this;

        if (typeof(arguments[1]) !== 'number') {
            if (isNumber(arguments[1])) {
                howmany = Number(arguments[1]);
            } else {
                type = arguments[1];
                howmany = 1;
            }
        }
        howmany = howmany || 1;
        if (start < 0) {
            start += s.values.length;
        }
        var result, hitCount = 0;
        for (var i = start + howmany - 1; i >= start; i--) {
            var skipByType = type && !typeHits(s.values[i], type);
            if (skipByType) {
                break;
            }
            var spliced = s.values.splice(i, 1);
            if (!spliced.length) {
                break;
            }
            spliced = spliced[0];
            switch (hitCount) {
                case 0:
                    result = spliced;
                    break;
                case 1:
                    result = [spliced, result];
                    break;
                default:
                    result.unshift(spliced);
                    break;
            }
            hitCount += 1;
        }
        return result;
    },
    /**
     * Pop values
     * @param {number|string} [howmany=1] - Number of value to get.
     * @param {string|function} [type] - Type restriction. Could be a name of type or a constructor.
     * @returns {*} - Value. Array if multiple hits.
     * @example
     *  function doSomething() {
     *      var args = argx(arguments);
     *      args.pop();
     *      args.pop(2);
     *      args.pop('string')
     *      args.pop(MyCustomError);
     *  }
     */
    pop: function (howmany, type) {
        var s = this;
        var from = -Number(howmany);
        if (isNaN(from)) {
            from = -1;
        }
        return s.splice(from, howmany, type);
    },
    /**
     * Shift values
     * @param {number|string} [howmany=1] - Number of value to get.
     * @param {string} [type] - Type restriction. Could be a name of type or a constructor.
     * @returns {*} - Value. Array if multiple hits.
     * @example
     *  function doSomething() {
     *      var args = argx(arguments);
     *      args.shift();
     *      args.shift(2);
     *      args.shift('string')
     *      args.shift(MyCustomError);
     *  }
     */
    shift: function (howmany, type) {
        var s = this;
        return s.splice(0, howmany, type);
    },
    /**
     * Get all remain values.
     * @returns {Array}
     */
    remain: function () {
        var s = this;
        var values = s.values;
        s.values = [];
        return values;
    }
};

module.exports = Argx;

},{"./type/is_number":8,"./type/type_hits":10}],6:[function(require,module,exports){
/**
 * Parse function arguments. Useful to implement variadic functions.
 * @module argx
 * @version 1.2.4
 */

"use strict";

var Argx = require('./argx'),
    noop = require('./noop');

/**
 * Get value from arguments.
 * @param {Arguments} args - Argument passed to your function.
 * @returns {Argx} - Parser object.
 */
function argx(args) {
    return new Argx(args);
}

argx.noop = noop;


module.exports = argx;

},{"./argx":5,"./noop":7}],7:[function(require,module,exports){
/**
 * Function to do nothing.
 * @memberof module:argx/lib
 * @function noop
 */

"use strict";

/** @lends noop */
function noop() {
    // Do nothing.
}

module.exports = noop;

},{}],8:[function(require,module,exports){
/**
 * Detect is a number or not.
 * @param {*} value - Value to check.
 * @returns {boolean} - Is a number or not.
 * @private
 */

"use strict";

/** @lends _isNumber */
function _isNumber(value) {
    var notNumber = isNaN(Number(value));
    if (notNumber) {
        return false;
    }
    return !_isEmptyString(value) && !_isEmptyArray(value);
}

function _isEmptyString(value) {
    return value === "";
}

function _isEmptyArray(value) {
    return Array.isArray(value) && (value.length === 0);
}

module.exports = _isNumber;
},{}],9:[function(require,module,exports){
/**
 * Parse a type.
 * @param {string|object|function} type - Type to parse.
 * @private
 */

"use strict";

/** @lends _parseType */
function _parseType(type) {
    if (type === Function) {
        return 'function';
    }
    if (type === Array) {
        return 'array';
    }
    if (type === String) {
        return 'string';
    }
    if (type === Number) {
        return 'number';
    }
    if (typeof(type) === 'string') {
        type = String(type).toLowerCase().trim();
    }
    return type;
}

module.exports = _parseType;
},{}],10:[function(require,module,exports){
/**
 * Detect if type hits.
 * @function typeHits
 * @param {*} value - Value to check with.
 * @param {string|object|string[]|object[]} type - Type to check with.
 * @returns {boolean} - Hit or not.
 * @private
 */
"use strict";

var parseType = require('./parse_type');

/** @lends typeHits */
function typeHits(value, type) {
    var isEmpty = (typeof(value) === 'undefined') || (value === null);
    if (isEmpty) {
        return false;
    }
    var s = this;
    var isMultiple = Array.isArray(type);
    if (isMultiple) {
        return typeHits.anyOf(value, type);
    }
    type = parseType(type);
    var isArrayType = (type === 'array');
    if (isArrayType) {
        return Array.isArray(value);
    }
    switch (typeof(type)) {
        case 'string':
            if (/\|/.test(type)) {
                return typeHits.anyOf(value, type.split(/\|/g));
            }
            return typeof(value) === type;
        case 'function':
            return value instanceof(type);
        case 'object':
            return !!(type && type.isPrototypeOf) && type.isPrototypeOf(value);
        default:
            return false;
    }
}

/**
 * Detect if any of type hits.
 * @param {*} value - Value to check with.
 * @param {string[]|object[]} types - types to check.
 * @returns {boolean} - Hit or not.
 * @private
 */
typeHits.anyOf = function anyOfTypeHits(value, types) {
    for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var hit = typeHits(value, type);
        if (hit) {
            return true;
        }
    }
    return false;
};

module.exports = typeHits;
},{"./parse_type":9}],11:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],12:[function(require,module,exports){
/**
 * Flatten nested object.
 * @memberof module:objnest/lib
 * @function expand
 * @param {object} object - Obj to flatten
 * @returns {object} Flatten obj.
 * @example
 *  var obj = objnest.expand({
     *      'foo.bar': 'baz'
     *  });
 *  console.log(obj); // => {foo: {bar: 'baz'}}
 */

"use strict";


var extend = require('extend'),
    isArrayKey = require('./key/is_array_key'),
    fromArrayKey = require('./key/from_array_key');

/** @lends expand */
function expand(object) {
    var result = {};
    Object.keys(object).forEach(function (key) {
        var val = object[key];
        if (/\./g.test(key)) {
            var subKeys = key.split(/\./g),
                subObj = {},
                thisKey = subKeys.shift();
            subObj[subKeys.join('.')] = val;
            var subExpandedObj = expand(subObj);
            var thisVal = result[thisKey];
            val = extend(true, subExpandedObj, thisVal || {});
            key = thisKey;
        }
        if (isArrayKey(key)) {
            var arrayKey = fromArrayKey(key);
            result[arrayKey.name] = result[arrayKey.name] || [];
            result[arrayKey.name][arrayKey.index] = val;
        } else {
            result[key] = val;
        }
    });
    return result;
}

module.exports = expand;
},{"./key/from_array_key":15,"./key/is_array_key":16,"extend":11}],13:[function(require,module,exports){
/**
 * Flatten nested object.
 * @param {object} nested - Object to flatten.
 * @returns {object} - Flattened object.
 * @example
 *  var flattened = objnest.flatten({
     *      'foo': {'bar': 'baz'}
     *  });
 *  console.log(flattened); // => {'foo.bar': 'baz'}
 */

"use strict";

var toArrayKey = require('./key/to_array_key');

/** @lends flatten */
function flatten(nested) {
    var flattened = {};
    Object.keys(nested || {}).forEach(function (key) {
        var value = nested[key];
        switch (typeof(value)) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'function':
                flattened[key] = value;
                break;
            default:
                var subValues = flatten(value);
                Object.keys(subValues).forEach(function (subKey) {
                    var fullKey;
                    if (Array.isArray(value)) {
                        fullKey = key + toArrayKey(subKey);
                    } else {
                        fullKey = [key, subKey].join('.');
                    }
                    flattened[fullKey] = subValues[subKey];
                });
                break;
        }
    });
    return flattened;
}

module.exports = flatten;
},{"./key/to_array_key":17}],14:[function(require,module,exports){
/**
 * Convert nested object to flatten or expand.
 * @module objnest
 * @version 1.2.0
 */

"use strict";

exports.expand = require('./expand');
exports.flatten = require('./flatten');

},{"./expand":12,"./flatten":13}],15:[function(require,module,exports){
/**
 * Convert from array key.
 * @memberof module:objnest/lib/key
 * @function fromArrayKey
 * @param {string} key - Key to convert.
 * @returns {string} - Converted key.
 */
"use strict";

/** @lends fromArrayKey */
function fromArrayKey(key) {
    return {
        name: key.replace(/\[\d+\]$/, ''),
        index: Number(key.match(/\[(\d+)\]$/)[1])
    }
}

module.exports = fromArrayKey;

},{}],16:[function(require,module,exports){
/**
 * Detect is an array key.
 * @memberof module:objnest/lib/key
 * @function isArrayKey
 * @param {string} key - Key to convert.
 * @returns {boolean} - Is array key or not.
 */
"use strict";

/** @lends isArrayKey */
function isArrayKey(key) {
    return /\[\d\]$/.test(key);
}

module.exports = isArrayKey;

},{}],17:[function(require,module,exports){
/**
 * Convert to array key.
 * @memberof module:objnest/lib/key
 * @function toArrayKey
 * @param {string} key - Key to convert.
 * @returns {string} - Converted key.
 */
"use strict";

/** @lends toArrayKey */
function toArrayKey(key) {
    var components = key.split(/\./g);
    return [
        '[' + components[0] + ']'
    ].concat(components.slice(1)).join('.');
}

module.exports = toArrayKey;

},{}]},{},[1]);

#!/usr/bin/env node

/**
 * Build this project.
 */

"use strict";

process.chdir(__dirname + '/..');

const apeTasking = require('ape-tasking'),
    apeCompiling = require('ape-compiling'),
    coz = require('coz');

apeTasking.runTasks('build', [
    (callback) => {
        coz.render([
            '.*.bud',
            'lib/.*.bud',
            'test/.*.bud'
        ], callback);
    }
], true);

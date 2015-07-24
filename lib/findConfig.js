'use strict';

var $fs = require('fs');

var $upTheTree = require('up-the-tree');

module.exports = findConfig;

/**
 * Find config in the following order:
 * - .jshintrc JSON file
 * - jshintConfig option in consumer package.json
 * - provide embedded config
 */
function findConfig () {

    var foundConfig;

    var finders = [
        _jshintrc,
        _packageJson,
        _embedded
    ];

    while (!foundConfig && finders.length) {
        foundConfig = finders.shift()();
    }

    if (!foundConfig) {
        // screwed. should not happen.
        throw 'Oops. Could not find a config, and embedded config also appears to be missing?';
    }

    return foundConfig;

}


function _jshintrc () {

    var path = $upTheTree.resolve('.jshintrc');

    if (path) {
        return {
            source: path,
            config: JSON.parse($fs.readFileSync(path).toString())
        };
    }

    return false;

}

function _packageJson () {

    var path = $upTheTree.resolve('package.json');

    if (path) {
        var packageJson = JSON.parse($fs.readFileSync(path).toString());

        if (packageJson.hasOwnProperty('jshintConfig')) {
            return {
                source: path,
                config: packageJson.jshintConfig
            };
        }
    }

    return false;
}


function _embedded () {

    var path = $upTheTree.resolve('resources/defaultConfiguration.json', {
        start: __dirname
    });

    return {
        source: 'embedded',
        config: JSON.parse($fs.readFileSync(path).toString())
    };

}

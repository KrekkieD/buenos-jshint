'use strict';

var $fs = require('fs');
var $path = require('path');

var $upTheTree = require('up-the-tree');

module.exports = findConfig;

/**
 * Find config in the following order:
 * - .jshintrc JSON file
 * - jshintConfig option in consumer package.json
 * - provide embedded config
 */
function findConfig (filePath) {

    var foundConfig;

    var finders = [
        _jshintrc,
        _packageJson,
        _embedded
    ];

    var dir = $path.dirname(filePath);
    while (!foundConfig && finders.length) {
        foundConfig = finders.shift()(dir);
    }

    if (!foundConfig) {
        // screwed. should not happen.
        throw 'Oops. Could not find a config, and embedded config also appears to be missing?';
    }

    return foundConfig;

}


function _jshintrc (dir) {

    var path = $upTheTree.resolve('.jshintrc', {
        start: dir
    });

    if (path) {
        return {
            source: path,
            config: _resolveExtends(path, JSON.parse($fs.readFileSync(path).toString()))
        };
    }

    return false;

}

function _packageJson (dir) {

    var path = $upTheTree.resolve('package.json', {
        start: dir
    });

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

function _resolveExtends (path, config) {

    if (typeof config.extends === 'string') {

        try {
            var baseConfigPath = $path.resolve($path.dirname(path), config.extends);
            var baseConfig = _resolveExtends(baseConfigPath, JSON.parse($fs.readFileSync(baseConfigPath).toString()));

            // overwrite baseConfig properties with config properties
            Object.keys(config).forEach(function (key) {

                // unless it's "extends"
                if (key === 'extends') { return; }

                baseConfig[key] = config[key];

            });

            return baseConfig;

        } catch (e) {
            console.log(e);
            delete config.extends;
        }

    }

    return config;

}

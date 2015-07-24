'use strict';

var $reporter = require('./lib/reporter');
var $findConfig = require('./lib/findConfig');
var $processor = require('./lib/processor');

var $path = require('path');
var $fs = require('fs');

var $extend = require('extend');

module.exports = BuenosJshint;
module.exports.reporter = $reporter;
module.exports.embeddedConfig = embeddedConfig;

var DEFAULT_CONFIG = {
    reporters: [
        [$reporter, { path: './reports/jshint.json' }]
    ],
    src: [
        './**/*.js',
        '!./node_modules/**/*',
        '!./**/*.spec.js'
    ]
};

function BuenosJshint (options) {

    if (this instanceof BuenosJshint) {

        var self = this;

        self.options = _checkOptions(options);

        self.log = {
            jshintConfig: self.options.jshintConfig.source,
            totalCount: 0,
            successCount: 0,
            failureCount: 0,
            files: {}
        };

        var processor = new $processor(self);

        self.promise = processor.checkPath()
            .then(function () {

                if (Array.isArray(self.options.reporters)) {
                    self.options.reporters.forEach(function (reporter) {

                        if (Array.isArray(reporter)) {
                            reporter[0](self.log, reporter[1]);
                        }
                        else if (typeof reporter === 'function') {
                            reporter(self.log);
                        }
                        else {
                            throw 'Reporter should be a function or array of function (and options)';
                        }

                    });
                }

                return self.log;

            });


    }
    else {
        return new BuenosJshint(options);
    }


    function _checkOptions (options) {

        options = $extend({}, DEFAULT_CONFIG, options || {});

        if (!options.jshintConfig) {
            options.jshintConfig = $findConfig();
        }
        else if (typeof options.jshintConfig === 'string') {
            // must be a path to a config file.. try to read it
            try {
                options.jshintConfig = {
                    source: $path.resolve(options.jshintConfig),
                    config: JSON.parse($fs.readFileSync($path.resolve(options.jshintConfig)).toString())
                };
            } catch (e) {
                throw 'Could not read config file at ' + options.jshintConfig;
            }
        }
        else {
            options.jshintConfig = {
                source: 'custom',
                config: options.jshintConfig
            };
        }

        return options;

    }

}

function embeddedConfig () {

    return JSON.parse($fs.readFileSync($path.resolve(__dirname, 'resources/defaultConfiguration.json')).toString());

}

// execute when not imported
if (!module.parent) {
    module.exports();
}

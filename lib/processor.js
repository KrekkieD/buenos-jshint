'use strict';

var $findConfig = require('./findConfig');

var $path = require('path');
var $fs = require('fs');

var $globby = require('globby');
var $q = require('q');
var $jshint = require('jshint').JSHINT;


module.exports = Processor;

function Processor (buenosJshint) {

    var self = this;

    self.checkPath = checkPath;
    self.checkFile = checkFile;

    function checkPath () {

        return $globby(buenosJshint.options.src)
            .then(function (files) {

                var deferreds = [];

                files.forEach(function (file) {
                    deferreds.push(checkFile(file));
                });

                return $q.allSettled(deferreds);

            });

    }

    function checkFile (file) {

        var deferred = $q.defer();

        $fs.readFile(file, function (err, dataBuffer) {

            if (err) {
                throw err;
            }

            var jshintConfig = buenosJshint.options.jshintConfig || $findConfig(file);

            $jshint(dataBuffer.toString(), jshintConfig.config);

            var jshintData = $jshint.data();

            var fileLog = logFileProcessed(file, {
                jshintConfig: jshintConfig.source,
                errorCount: jshintData.errors ? jshintData.errors.length : 0,
                errors: jshintData.errors || []
            });

            if (!fileLog.passed) {

                // add the filename to each error object
                fileLog.errors.forEach(function (error) {
                    if (error !== null) {
                        error.filename = file;
                    }
                });


            }

            return fileLog.passed ? deferred.resolve() : deferred.reject();

        });

        return deferred.promise;

    }

    function logFileProcessed (filePath, result) {

        buenosJshint.log.totalCount++;

        var fileDisplayName = $path.relative('.', filePath).split($path.sep).join('/');

        if (result.errorCount === 0) {
            result.passed = true;
            buenosJshint.log.successCount++;
        }
        else {
            buenosJshint.log.totalErrorCount += result.errorCount;
            result.passed = false;
            buenosJshint.log.failureCount++;
        }

        buenosJshint.log.files[fileDisplayName] = result;

        return result;

    }

}

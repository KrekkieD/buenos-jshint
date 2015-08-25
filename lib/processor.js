'use strict';

var $findConfig = require('./findConfig');

var $path = require('path');
var $fs = require('fs');

var $globStream = require('glob-stream');
var $q = require('q');
var $jshint = require('jshint').JSHINT;


module.exports = Processor;

function Processor (buenosJshint) {

    var self = this;

    self.checkPath = checkPath;
    self.checkFile = checkFile;

    function checkPath () {

        var deferred = $q.defer();

        var stream = $globStream.create(buenosJshint.options.src);

        var deferreds = [];

        stream.on('data', function (file) {
            deferreds.push(checkFile(file.path));
        });

        stream.on('end', function () {

            $q.allSettled(deferreds)
                .then(function () {
                    deferred.resolve();
                });

        });

        return deferred.promise;

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

                buenosJshint.log.errorCount += jshintData.errors.length;

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

'use strict';

var $fs = require('fs');
var $path = require('path');

var $file = require('file');

module.exports = reporter;

function reporter (log, options) {

    $file.mkdirs($path.relative('.', $path.dirname(options.path)), 755, function () {

        $fs.writeFile(options.path, JSON.stringify(log, null, 4), function (err) {

            if (err) {
                console.log(err);
            }
            else {
                console.log('JSHINT Linting results:');
                console.log('    Checked ' + log.totalCount + ' files, ' + log.failureCount + ' file(s) with errors');
                console.log('    Report written to ' + $path.relative('.', options.path));
            }

        });

    });

}

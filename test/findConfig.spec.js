'use strict';

var $path = require('path');

var $upTheTree = require('up-the-tree');
var $buenosJshint = require($path.relative(__dirname, $upTheTree()));

var projectRoot = $upTheTree();

describe('findConfig', function () {

    it('should find config in package.json', function (done) {

        var configDir = $path.resolve(projectRoot, 'test/resources/packageJson');

        var instance = new $buenosJshint({
            src: './test/resources/**/*.js',
            reporters: false
        });

        instance.promise.then(function () {

            expect(instance.log.files['test/resources/packageJson/srcFile.js'].jshintConfig).toEqual($path.resolve(configDir, 'package.json'));
            done();

        });

    });

    it('should find config in .jshintrc', function (done) {

        var configDir = $path.resolve(projectRoot, 'test/resources/jshintrc');

        var instance = new $buenosJshint({
            src: './test/resources/**/*.js',
            reporters: false
        });

        instance.promise.then(function () {

            expect(instance.log.files['test/resources/jshintrc/srcFile.js'].jshintConfig).toEqual($path.resolve(configDir, '.jshintrc'));
            done();

        });

    });

    it('should find embedded config', function (done) {

        var instance = new $buenosJshint({
            src: './test/resources/**/*.js',
            reporters: false
        });

        instance.promise.then(function () {

            expect(instance.log.files['test/resources/embedded/srcFile.js'].jshintConfig).toEqual('embedded');
            done();

        });

    });

    xit('dump of result', function (done) {

        var instance = new $buenosJshint({
            src: './test/resources/**/*.js',
            reporters: false
        });

        instance.promise.then(function () {

            console.log(JSON.stringify(instance.log, null, 4));
            done();

        });

    });

});

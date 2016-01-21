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

    it('should be able to extend the config', function (done) {

        var configDir = $path.resolve(projectRoot, 'test/resources/extended/deeper/even-deeper');

        var instance = new $buenosJshint({
            src: './test/resources/extended/**/*.js',
            reporters: false
        });

        instance.promise.then(function () {

            expect(instance.log.files['test/resources/extended/deeper/even-deeper/srcFile.js'].jshintConfig)
                .toEqual($path.resolve(configDir, '.jshintrc'));

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

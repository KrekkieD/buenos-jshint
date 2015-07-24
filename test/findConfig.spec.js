'use strict';

var $path = require('path');

var $upTheTree = require('up-the-tree');
var $buenosJshint = require($path.relative(__dirname, $upTheTree()));

var projectRoot = $upTheTree();
var testFilesRoot = $path.resolve(projectRoot, 'test/resources/srcFiles');


describe('findConfig', function () {

    it('should find config in package.json', function () {

        var configDir = $path.resolve(projectRoot, 'test/resources/packageJson');
        process.chdir(configDir);

        var instance = new $buenosJshint({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.jshintConfig.source).toEqual($path.resolve(configDir, 'package.json'));

    });

    it('should find config in .jshintrc', function () {

        var configDir = $path.resolve(projectRoot, 'test/resources/jshintrc');
        process.chdir(configDir);

        var instance = new $buenosJshint({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.jshintConfig.source).toEqual($path.resolve(configDir, '.jshintrc'));

    });

    it('should find embedded config', function () {

        var configDir = $path.resolve(projectRoot, 'test/resources/embedded');
        process.chdir(configDir);

        var instance = new $buenosJshint({
            src: testFilesRoot + '/**/*.js',
            reporters: false
        });

        expect(instance.options.jshintConfig.source).toEqual('embedded');

    });

});

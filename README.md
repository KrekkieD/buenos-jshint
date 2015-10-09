# Buenos JSHINT!

A NodeJS wrapper around the [JSHINT](https://www.npmjs.com/package/jshint) code linter, for your convenience.

Part of the buenos linting family: [buenos-jshint](https://www.npmjs.com/package/buenos-jshint), [buenos-jscs](https://www.npmjs.com/package/buenos-jscs), [buenos-htmllint](https://www.npmjs.com/package/buenos-htmllint).

## Installing

```
$ npm install --save-dev buenos-jshint
```

## Usage

### In a node file

```
var $buenosJshint = require('buenos-jshint');

$buenosJshint(options);
```

### From your package.json

```
{
    "scripts": {
        "buenos-jshint": "buenos-jshint"
    }
}
```

```
$ npm run buenos-jshint
```

## Options

```
{

    /**
     * Optional. Array of reporters. Each reporter is called with the jshint results
     */
    reporters: [
    
        // a reporter can be an array where key 0 is the function 
        [ someFunction ],
        
        // a reporter can also be given a config variable
        [ someFunction, optionalConfig ],
        
        // a reporter may also be a direct function, not wrapped in an array
        someFunction,
        
        // default value:
        [ $buenosJshint.reporter, { path: './reports/buenos-jshint.json' }]
        
    ],
    
    
    /**
     * Optional. Globs using minimatch. default value:
     */
    src: [
        './**/*.js',
        '!./**/node_modules/**/*',
        '!./**/bower_components/**/*',
        '!./**/*.spec.js'
    ],
        
    
    /**
     * Optional. Jshint rules. May be:
     * - a file path to the rules json
     * - an object containing the rules
     * When left out it will follow this order to get its config:
     * - a .jshintrc file in file folder or up
     * - any parent package.json with a jshintConfig property
     * - embedded config
     */
    jshintConfig: './myConfig.json'
}
```

## API

### BuenosJshint (class)

```
var $buenosJshint = require('buenos-jshint');

var instance = new $buenosJshint();
```

#### .log

The log object containing the status of the checked files.

#### .options

The parsed options object.

#### .promise

A promise that is resolved when the linter is complete. The `log` is provided as argument.

```
var $buenosJshint = require('buenos-jshint');

var instance = new $buenosJshint();
instance.promise.then(function (log) {
    // done processing!
    console.log(log);
});
```

### reporter

The default reporter. Useful in case you want to combine your own reporter with the default reporter.

```
var $buenosJshint = require('buenos-jshint');

new $buenosJshint({
    reporters: [
        [ $buenosJshint.reporter, { path: './reports/buenos-jshint.json' }],
        myReporter
    ]
});
```

### embeddedConfig

Returns the jshint config as embedded in the module.

```
var $buenosJshint = require('buenos-jshint');

console.log(
    $buenosJshint.embeddedConfig()
);
```

## Reporters

You can specify your own reporters. A reporter is called as a function, the first argument being the `log`, the
second argument being the reporter config (if defined).

```
var $buenosJshint = require('buenos-jshint');

new $buenosJshint({
    reporters: [
    
        // function, no config can be defined
        reporterWithoutConfig,
        
        // array of function, no config defined 
        [ reporterWithoutConfig ],
        
        // array of function and config obj
        [ reporterWithConfig, { myConfig: 'defined' } ]
    ]
});

function reporterWithoutConfig (log, config) {
    
    // log = BuenosJshint.log
    // config = undefined
    
}


function reporterWithConfig (log, config) {
    
    // log = BuenosJshint.log
    // config = { myConfig: 'defined' };
    
}
```

### Log format

```
{
    
    // how many files are checked?
    "totalCount": 7,
    
    // how many total errors were found?
    "totalErrorCount": 0,
        
    // how many files passed?
    "successCount": 7,
    
    // how many files failed?
    "failureCount": 1,
    
    // object of files checked
    "files": {
    
        // file name
        "index.js": {
        
            // where did the jshint config come from?
            "jshintConfig": "embedded", // embedded, custom, or file path
            
            // how many errors were found in this file?
            "errorCount": 0,
            
            // array of errors found in this file
            "errors": [
                {
                    "id": "(error)",
                    "raw": "Unnecessary semicolon.",
                    "code": "W032",
                    "evidence": ";",
                    "line": 2,
                    "character": 1,
                    "scope": "(main)",
                    "reason": "Unnecessary semicolon.",
                    "filename": "\\malformed\\syntaxerror.js"
                }
            ],
            
            // did the file pass the check?
            "passed": true
        }
    }
}
```

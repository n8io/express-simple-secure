# express-simple-secure

[![Codeship](https://img.shields.io/codeship/0ca723a0-6095-0133-36eb-7258394f756c/master.svg)](https://codeship.com/projects/112229)
[![Latest stable version](https://img.shields.io/github/release/n8io/express-simple-secure.svg)](https://github.com/n8io/express-simple-secure/releases)
[![node](https://img.shields.io/badge/node->%3Dv0.12.7-lightgrey.svg)](https://github.com/n8io/express-simple-secure/blob/master/package.json)
[![node](https://img.shields.io/badge/express->%3Dv4.0-lightgrey.svg)](https://github.com/n8io/express-simple-secure/blob/master/package.json)
[![dependencies](https://img.shields.io/david/n8io/express-simple-secure.svg)](https://github.com/n8io/express-simple-secure/blob/master/package.json)
[![Code Climate](https://codeclimate.com/github/n8io/express-simple-secure/badges/gpa.svg)](https://codeclimate.com/github/n8io/express-simple-secure)
[![Test Coverage](https://codeclimate.com/github/n8io/express-simple-secure/badges/coverage.svg)](https://codeclimate.com/github/n8io/express-simple-secure/coverage)

Express middleware that only exposes a route (and response body) when the proper token is provided in the query string or header.

[change log](change.md)

Table of Contents
* [Requirements](#requirements)
* [Installation](#installation)
* [Example usage](#example-usage)
* [Options](#options)
* [Environment variables](#environment-variables)
* [Miscellaneous](#miscellaneous)

## Requirements
* Node >= v4
* Express >= v4

## Installation
`npm install --save express-simple-secure`

## Example usage
```
  var app = require('express');
  var simpleSecure = require('express-simple-secure');

  var options = {
    httpMethod: 'get',
    paramName: 'nickname',
    token: '007',
    caseSensitive: true,
    checkType: 'query',
    object: {firstName: 'James', lastName: 'Bond', company: 'MI6'},
    contentType: 'json'
  };

  // Via Express router
  var router = express.Router();
  router.get('/agent', simpleSecure(options));
  app.use('/secret', router);

  app.listen(3000, '0.0.0.0');

  // http://localhost:3000/secret/agent?nickname=007
```

Run `npm run dev` to test the above code.

## Options

```
  var options = {
    object: null,
    token: '',
    method: 'get',
    paramName: 'key',
    caseSensitive: true,
    checkType: 'query'
  };
```

* **object**
  * Required
  * Defines a/n:
    * Object that will be returned as application/json in the body of the response
    * String that will be returned as text/html in the body of the response
    * A function that returns html or an object...
    ```
      function(){
        return '<h1>Meow</h1>';
      }
    ```
    or
    ```
      function() {
        return {
          message: 'Woof'
        };
      }
    ```
* **token**
  * Required
  * A general rule of thumb is make this a very long, strong password or guid
  * If a string value is provided, this will be the token that is checked against the appropriate _checkType_ parameter
  * This is a 'security through obscurity' approach
  * **If a falsy value is provided, the middleware will be skipped within the Express app**
* **method**
  * Required
  * Valid values are: `get`, `post`, `put`, `patch`, `options`, `delete`, `head`, or `any`
* **paramName**
  * Optional
  * Default is `key`
  * When used with the _checkType_ option it is the specific parameter to check against the _token_ value
* **caseSensitive**
  * Optional
  * Default is `true`
  * Defines the case sensitivity of the _token_ value actual vs. expected comparison
* **checkType**
  * Optional
  * Default is `query`
  * Defines where to check for the _paramName_ defined parameter
  * Valid values are: `query`, `header`, or `any`

## Miscellaneous
1. `npm run dev` # Runs sample app
1. `DEBUG=express-simple-secure npm run dev` # Runs sample app with debugging
1. `npm run test` # Runs all tests
2. `npm run test-unit` # Runs only unit tests
3. `npm run test-integration` # Runs only self-integration tests
4. `npm run coverage` # Runs istanbul coverage analysis
4. `npm run test-prod` # Runs all tests, coverage anyalysis, and uploads results to Code Climate. Requires the `CODECLIMATE_REPO_TOKEN` environment variable be set.
5. `npm run clean` # Removes node_modules and other temporary items so you can start the project fresh

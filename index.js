'use strict';

var url = require('url');
var debug = require('debug')('express-simple-secure:main');
var safeJsonStringify = require('safe-json-stringify');
var _ = require('lodash');

var defaults = require('./config').defaults();
var contentTypes = require('./config').contentTypes();
var httpMethods = require('./config').httpMethods();
var checkTypes = require('./config').checkTypes();

module.exports = simpleSecure;

function simpleSecure(options) {
  var opts = options || {};

  opts.httpMethod = httpMethods[(opts.httpMethod || '').toLowerCase()];
  opts.contentType = contentTypes[(opts.contentType || '').toLowerCase()] || defaults.contentType;
  opts.caseSensitive = typeof opts.caseSensitive !== 'undefined' ? opts.caseSensitive : defaults.caseSensitive;
  opts.paramName = typeof opts.paramName !== 'undefined' ? opts.paramName : defaults.paramName;
  opts.checkType = checkTypes[(opts.checkType || '').toLowerCase()] || defaults.checkType;

  return handleRequest;

  function handleRequest(req, res, next) {
    var output = opts.object;

    if(!opts.httpMethod) {
      debug('An invalid httpMethod was provided. Please use one of the following: %s', _.keys(httpMethods).join(', '));

      return next();
    }

    if(opts.httpMethod !== httpMethods.any && req.method.toLowerCase() !== opts.httpMethod.toLowerCase()) {
      debug('httpMethod mismatch. Expecting %s and got %s', opts.httpMethod, req.method.toLowerCase());

      return next(); // Not the method we are watching, pass on to the next set of middleware
    }

    if(!opts.token) {
      debug('No token provided for simple secure route');

      return next(); // No token equates to disabled
    }

    if(hasValidToken(req, opts) === false) {
      debug('Invalid token for simple secure route');

      return next(); // Invalid token, pass on to next set of middleware
    }

    if(typeof opts.object === 'function') {
      output = opts.object();
      opts.contentType = typeof output === 'object' ? contentTypes.json : contentTypes.html;
    }

    switch(opts.contentType){
      case contentTypes.json:
        // Safely stringify json and reparse.
        // Normal JSON.stringify explodes on streams or some crazy edge cases.
        output = JSON.parse(safeJsonStringify(output));

        return res.json(output);
      case contentTypes.html:
      case contentTypes.text:
      default:
        // Ensure output is a string
        output = output.toString();

        return res.send(output);
    }
  }
}

function hasValidToken(req, options) {
  var token = options.token;
  var checkVal;

  switch(options.checkType) {
    case checkTypes.query:
      checkVal = req.query[options.paramName];
      break;
    case checkTypes.header:
      checkVal = req.headers[options.paramName];
      break;
    default:
      checkVal = (req.query[options.paramName] || req.headers[options.paramName]);
      break;
  }

  if(!options.caseSensitive) {
    token = token.toLowerCase();
    checkVal = (checkVal || '').toLowerCase();
  }

  return token === checkVal;
}

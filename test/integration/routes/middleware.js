var url = require('url');
var supertest = require('supertest');
var status = require('http-status');
var expect = require('chai').expect;
var assert = require('chai').assert;
var express = require('express');
var async = require('async');

var simpleSecure = require('../../../index');
var defaults = require('../../../config').defaults();
var httpMethods = require('../../../config').httpMethods();
var contentTypes = require('../../../config').contentTypes();
var checkTypes = require('../../../config').checkTypes();

module.exports = {
  minimum: minimum,
  customParamName: customParamName,
  customPathname: customPathname,
  queryParam: queryParam,
  headerParam: headerParam,
  noQueryParam: noQueryParam,
  noHeaderParam: noHeaderParam,
  anyParamQuery: anyParamQuery,
  anyParamHeader: anyParamHeader,
  caseSensitiveEnabled: caseSensitiveEnabled,
  caseSensitiveDisabled: caseSensitiveDisabled,
  json: json,
  functionText: functionText,
  functionHtml: functionHtml,
  functionJson: functionJson,
  noToken: noToken,
  invalidToken: invalidToken,
  falsyToken: falsyToken,
  validPost: validPost,
  onlyPostNotGet: onlyPostNotGet,
  onlyGetNotPost: onlyGetNotPost,
  anyHttpMethod: anyHttpMethod,
  eitherGetOrPostGet: eitherGetOrPostGet,
  eitherGetOrPostPost: eitherGetOrPostPost,
  invalidPathnameParam: invalidPathnameParam,
  noOptions: noOptions,
  invalidHttpMethod: invalidHttpMethod,
  invalidHttpMethodNoGetFallback: invalidHttpMethodNoGetFallback,
  missingHttpMethod: missingHttpMethod
};

function noOptions(done) {
  var urlObj = {
    pathname: '/',
    query: {}
  };

  var app = express();
  app.use(urlObj.pathname, simpleSecure());

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function minimum(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function customParamName(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any,
    contentType: contentTypes.html,
    paramName: 'diffParamName'
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[opts.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function customPathname(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/custom',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function queryParam(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any,
    checkType: checkTypes.query
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function headerParam(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any,
    checkType: checkTypes.header
  };
  var urlObj = {
    pathname: '/'
  };

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .set(defaults.paramName, opts.token)
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function noQueryParam(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any,
    checkType: checkTypes.query,
    caseSensitive: false
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function noHeaderParam(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    checkType: checkTypes.header,
    caseSensitive: false
  };
  var urlObj = {
    pathname: '/'
  };

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function anyParamQuery(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any,
    checkType: checkTypes.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function anyParamHeader(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any,
    checkType: checkTypes.any
  };
  var urlObj = {
    pathname: '/'
  };

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .set(defaults.paramName, opts.token)
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function functionText(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: function() { return 'test'; },
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object());

      return done();
    })
    ;
}

function functionHtml(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: function() { return '<h1>test</h1>'; },
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.html)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object());

      return done();
    })
    ;
}

function functionJson(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: function() { return {}; },
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.json)
    .end(function(err, res) {
      assert.ifError(err);

      var obj = JSON.parse(res.text);

      expect(obj).to.deep.equal(opts.object());

      return done();
    })
    ;
}

function caseSensitiveDisabled(done) {
  var opts = {
    token: 'TESTTOKEN',
    object: 'test',
    httpMethod: httpMethods.any,
    caseSensitive: false
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token.toLowerCase(); // Only mismatch on casing

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function caseSensitiveEnabled(done) {
  var opts = {
    token: 'TESTTOKEN',
    object: 'test',
    httpMethod: httpMethods.any,
    caseSensitive: true
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token.toLowerCase(); // Only mismatch on casing

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND) // The route should not resolve
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function validPost(done) {
  var opts = {
    token: 'token',
    object: 'test',
    httpMethod: httpMethods.post
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .post(url.format(urlObj))
    .expect(status.OK)
    .end(function(err, res) {
      assert.ifError(err);

      expect(res.text).to.equal(opts.object);

      return done();
    })
    ;
}

function onlyPostNotGet(done) {
  var opts = {
    token: 'token',
    object: 'test',
    httpMethod: httpMethods.post
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND) // The route should not resolve
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function onlyGetNotPost(done) {
  var opts = {
    token: 'token',
    object: 'test',
    httpMethod: httpMethods.get
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .post(url.format(urlObj))
    .expect(status.NOT_FOUND) // The route should not resolve
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function eitherGetOrPostGet() {
  var opts = {
    token: 'token',
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function eitherGetOrPostPost() {
  var opts = {
    token: 'token',
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .post(url.format(urlObj))
    .expect(status.OK)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function json(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: {test: 'test'},
    httpMethod: httpMethods.any,
    contentType: 'json'
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.OK)
    .expect('Content-Type', contentTypes.json)
    .end(function(err, res) {
      assert.ifError(err);

      var obj = JSON.parse(res.text);

      expect(obj).to.deep.equal(opts.object);

      return done();
    })
    ;
}

function noToken(done) {
  var opts = {
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function invalidToken(done) {
  var opts = {
    token: 'ABC',
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = 'INVALID';

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function falsyToken(done) {
  var opts = {
    token: false,
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function invalidPathnameParam(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/actual',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use('/invalid', simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function anyHttpMethod(done) {
  var opts = {
    token: 'token',
    object: 'test',
    httpMethod: httpMethods.any
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  async.parallel({
    get: function(cb) {
      var ss = require('../../../index');
      var app = express();

      app.use(urlObj.pathname, ss(opts));

      supertest(app)
        .get(url.format(urlObj))
        .expect(status.OK)
        .end(function(err, res) {
          assert.ifError(err);

          return cb(err);
        })
        ;
    },
    post: function(cb) {
      var ss = require('../../../index');
      var app = express();

      app.use(urlObj.pathname, ss(opts));

      supertest(app)
        .post(url.format(urlObj))
        .expect(status.OK)
        .end(function(err, res) {
          assert.ifError(err);

          return cb(err);
        })
        ;
    },
    put: function(cb) {
      var ss = require('../../../index');
      var app = express();

      app.use(urlObj.pathname, ss(opts));

      supertest(app)
        .put(url.format(urlObj))
        .expect(status.OK)
        .end(function(err, res) {
          assert.ifError(err);

          return cb(err);
        })
        ;
    },
    delete: function(cb) {
      var ss = require('../../../index');
      var app = express();

      app.use(urlObj.pathname, ss(opts));

      supertest(app)
        .delete(url.format(urlObj))
        .expect(status.OK)
        .end(function(err, res) {
          assert.ifError(err);

          return cb(err);
        })
        ;
    },
    options: function(cb) {
      var ss = require('../../../index');
      var app = express();

      app.use(urlObj.pathname, ss(opts));

      supertest(app)
        .options(url.format(urlObj))
        .expect(status.OK)
        .end(function(err, res) {
          assert.ifError(err);

          return cb(err);
        })
        ;
    },
    head: function(cb) {
      var ss = require('../../../index');
      var app = express();

      app.use(urlObj.pathname, ss(opts));

      supertest(app)
        .head(url.format(urlObj))
        .expect(status.OK)
        .end(function(err, res) {
          assert.ifError(err);

          return cb(err);
        })
        ;
    },
    patch: function(cb) {
      var ss = require('../../../index');
      var app = express();

      app.use(urlObj.pathname, ss(opts));

      supertest(app)
        .patch(url.format(urlObj))
        .expect(status.OK)
        .end(function(err, res) {
          assert.ifError(err);

          return cb(err);
        })
        ;
    }
  }, function(err, results) {
    return done();
  });
}

function missingHttpMethod(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test'
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .trace(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function invalidHttpMethod(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: 'trace'
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .trace(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

function invalidHttpMethodNoGetFallback(done) {
  var opts = {
    token: (new Date()).getTime().toString(),
    object: 'test',
    httpMethod: 'trace'
  };
  var urlObj = {
    pathname: '/',
    query: {}
  };
  urlObj.query[defaults.paramName] = opts.token;

  var app = express();
  app.use(urlObj.pathname, simpleSecure(opts));

  supertest(app)
    .get(url.format(urlObj))
    .expect(status.NOT_FOUND)
    .end(function(err, res) {
      assert.ifError(err);

      return done();
    })
    ;
}

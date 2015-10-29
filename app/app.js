var express = require('express');
var morgan = require('morgan');
var debug = require('debug')('express-simple-secure:app');

var app = express();

var port = process.env.PORT || 4105;
var host = process.env.HOST || '0.0.0.0';
var server;

app.use(morgan('dev'));

var simpleSecure = require('../index');

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
router.use('/agent', simpleSecure(options));
app.use('/secret', router);
// http://localhost:4105/secret/agent?nickname=007

server = app.listen(port, host, function() {
  debug('Test app is running at %s:%s',
    server.address().address,
    server.address().port
  );
});

module.exports = server;

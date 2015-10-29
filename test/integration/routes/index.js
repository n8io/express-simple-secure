var simpleSecureRelativePath = '../../../index';
var mw = require('./middleware');

module.exports = function() {
  describe('for simple secure', function() {
    it('should return a 200 OK text/html with a valid token and the minimum options set', mw.minimum);
    it('should return a 200 OK text/html with a valid token and a custom paramName', mw.customParamName);
    it('should return a 200 OK text/html with a valid token and a custom express route pathname', mw.customPathname);
    it('should return a 200 OK text/html with a valid token in the query string', mw.queryParam);
    it('should return a 200 OK text/html with a valid token in the header', mw.headerParam);
    it('should return a 200 OK text/html with a valid token in either query string or header (query)', mw.anyParamQuery);
    it('should return a 200 OK text/html with a valid token in either query string or header (header)', mw.anyParamHeader);
    it('should return a 200 OK text/html with a valid token and a custom object function that returns text', mw.functionText);
    it('should return a 200 OK text/html with a valid token and a custom object function that returns html', mw.functionHtml);
    it('should return a 200 OK application/json with a valid token and a custom object function that returns json', mw.functionJson);
    it('should return a 200 OK application/json with a valid token and content type set to json', mw.json);
    it('should return a 200 OK text/html when the token differs only case-wise and case sensitivity is disabled', mw.caseSensitiveDisabled);
    it('should return a 200 OK text/html via POST with a valid token', mw.validPost);
    it('should return a 200 OK text/html via POST only with a valid token', mw.onlyPostNotGet);
    it('should return a 200 OK text/html via GET only with a valid token', mw.onlyGetNotPost);
    it('should return a 200 OK text/html via POST or GET with a valid token (GET)', mw.eitherGetOrPostGet);
    it('should return a 200 OK text/html via POST or GET with a valid token (POST)', mw.eitherGetOrPostPost);
    it('should return a 200 OK text/html via any valid httpMethod with a valid token (POST)', mw.anyHttpMethod);
    it('should return a 404 NOT FOUND when no options are provided', mw.noOptions);
    it('should return a 404 NOT FOUND when no token is provided', mw.noToken);
    it('should return a 404 NOT FOUND when a falsy token is provided', mw.falsyToken);
    it('should return a 404 NOT FOUND when an invalid token is provided', mw.invalidToken);
    it('should return a 404 NOT FOUND when a custom option pathname does not match the requested route', mw.invalidPathnameParam);
    it('should return a 404 NOT FOUND when no parameter is provided in the query string', mw.noQueryParam);
    it('should return a 404 NOT FOUND when no parameter is provided in the header', mw.noHeaderParam);
    it('should return a 404 NOT FOUND when no httpMethod is provided', mw.missingHttpMethod);
    it('should return a 404 NOT FOUND when an unsupported httpMethod is provided', mw.invalidHttpMethod);
    it('should return a 404 NOT FOUND when an unsupported httpMethod is provided and a GET is attempted', mw.invalidHttpMethodNoGetFallback);
    it('should return a 404 NOT FOUND when the token does not match case-wise and case sensitivity is enabled', mw.caseSensitiveEnabled);
  });
};

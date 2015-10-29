module.exports = {
  httpMethods: httpMethods,
  contentTypes: contentTypes,
  checkTypes: checkTypes,
  defaults: defaults
};

function httpMethods() {
  return {
    get: 'get',
    post: 'post',
    put: 'put',
    patch: 'patch',
    options: 'options',
    delete: 'delete',
    head: 'head',
    any: 'any'
  };
}

function contentTypes() {
  return {
    html: 'text/html; charset=utf-8',
    json: 'application/json; charset=utf-8'
  };
}

function checkTypes() {
  return {
    query: 'query',
    header: 'header',
    any: 'any'
  };
}

function defaults() {
  return {
    object: null,
    token: '',
    httpMethod: httpMethods().get,
    contentType: contentTypes().html,
    caseSensitive: true,
    paramName: 'key',
    checkType: checkTypes().query
  };
}

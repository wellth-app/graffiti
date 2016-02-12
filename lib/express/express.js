'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _graphql = require('graphql');

var _boom = require('boom');

var _util = require('../util');

function sendError(response, boom) {
  var _boom$output = boom.output;
  var statusCode = _boom$output.statusCode;
  var payload = _boom$output.payload;

  response.status(statusCode).send(payload);
}

function middleware() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$graphiql = _ref.graphiql;
  var graphiql = _ref$graphiql === undefined ? true : _ref$graphiql;
  var _ref$schema = _ref.schema;
  var schema = _ref$schema === undefined ? (0, _util.required)() : _ref$schema;

  return function (request, response, next) {
    if ((0, _util.isPath)(request) && ((0, _util.isPost)(request) || (0, _util.isGet)(request))) {
      var body = request.body;

      var _Object$assign = Object.assign({}, body, request.query);

      var query = _Object$assign.query;
      var variables = _Object$assign.variables;

      if ((0, _util.isGet)(request) && request.accepts('html') && graphiql) {
        return response.send((0, _util.renderGraphiQL)({ query: query, variables: variables }));
      }

      if ((0, _util.isGet)(request) && query && query.includes('mutation')) {
        var boom = (0, _boom.methodNotAllowed)('GraphQL mutation only allowed in POST request.');
        return sendError(response, boom);
      }

      var parsedVariables = typeof variables === 'string' && variables.length > 0 ? JSON.parse(variables) : variables;

      return (0, _graphql.graphql)(schema, query, request, parsedVariables).then(function (result) {
        if (result.errors) {
          var message = result.errors.map(function (error) {
            return error.message;
          }).join('\n');
          var boom = (0, _boom.badRequest)(message);
          return sendError(response, boom);
        }

        response.json(result);
      });
    }

    return next();
  };
}
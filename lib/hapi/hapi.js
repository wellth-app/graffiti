'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _boom = require('boom');

var _util = require('../util');

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function accepts(_ref, type) {
  var headers = _ref.headers;

  return headers.accept && headers.accept.includes(type);
}

var plugin = {
  register: function register(server) {
    var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref2$graphiql = _ref2.graphiql;
    var graphiql = _ref2$graphiql === undefined ? true : _ref2$graphiql;
    var _ref2$schema = _ref2.schema;
    var schema = _ref2$schema === undefined ? (0, _util.required)() : _ref2$schema;
    var next = arguments[2];

    var handler = function handler(request, reply) {
      var data = request.payload || request.query || {};
      var query = data.query;
      var variables = data.variables;

      if (accepts(request, 'html') && graphiql) {
        return reply((0, _util.renderGraphiQL)({ query: query, variables: variables }));
      }

      if (query && query.includes('mutation') && (0, _util.isGet)(request)) {
        return reply((0, _boom.methodNotAllowed)('GraphQL mutation only allowed in POST request.'));
      }

      var parsedVariables = typeof variables === 'string' && variables.length > 0 ? JSON.parse(variables) : variables;

      return (0, _graphql.graphql)(schema, query, request, parsedVariables).then(function (result) {
        if (result.errors) {
          var message = result.errors.map(function (error) {
            return error.message;
          }).join('\n');
          return reply((0, _boom.badRequest)(message));
        }

        reply(result);
      }).catch(function (err) {
        reply((0, _boom.badRequest)(err));
      });
    };

    server.route({
      method: 'POST',
      path: '/graphql',
      handler: handler
    });

    if (graphiql) {
      server.route({
        method: 'GET',
        path: '/graphql',
        handler: handler
      });
    }

    next();
  }
};

plugin.register.attributes = { pkg: _package2.default };

exports.default = plugin;
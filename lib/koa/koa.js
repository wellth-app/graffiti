'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _graphql = require('graphql');

var _util = require('../util');

function accepts(type) {
  return this.headers && this.headers.accept && this.headers.accept.includes(type);
}

function middleware() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$graphiql = _ref.graphiql;
  var graphiql = _ref$graphiql === undefined ? true : _ref$graphiql;
  var _ref$schema = _ref.schema;
  var schema = _ref$schema === undefined ? (0, _util.required)() : _ref$schema;

  return regeneratorRuntime.mark(function middleware(next) {
    var body, _Object$assign, query, variables, parsedVariables;

    return regeneratorRuntime.wrap(function middleware$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!((0, _util.isPath)(this) && ((0, _util.isPost)(this) || (0, _util.isGet)(this)))) {
              _context.next = 17;
              break;
            }

            body = this.request.body;
            _Object$assign = Object.assign({}, body, this.query);
            query = _Object$assign.query;
            variables = _Object$assign.variables;

            if (!((0, _util.isGet)(this) && accepts.call(this, 'html') && graphiql)) {
              _context.next = 8;
              break;
            }

            this.body = (0, _util.renderGraphiQL)({ query: query, variables: variables });
            return _context.abrupt('return', this.body);

          case 8:
            if (!((0, _util.isGet)(this) && query && query.includes('mutation'))) {
              _context.next = 12;
              break;
            }

            this.status = 406;
            this.body = 'GraphQL mutation only allowed in POST request.';
            return _context.abrupt('return', this.body);

          case 12:
            parsedVariables = typeof variables === 'string' && variables.length > 0 ? JSON.parse(variables) : variables;
            _context.next = 15;
            return (0, _graphql.graphql)(schema, query, this, parsedVariables);

          case 15:
            this.body = _context.sent;
            return _context.abrupt('return', this.body);

          case 17:
            _context.next = 19;
            return next;

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, middleware, this);
  });
}
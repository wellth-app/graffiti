'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isGet = isGet;
exports.isPost = isPost;
exports.isPath = isPath;
exports.required = required;
exports.renderGraphiQL = renderGraphiQL;
function isGet(request) {
  return request.method === 'GET';
}

function isPost(request) {
  return request.method === 'POST';
}

function isPath(request) {
  return request.path === '/graphql';
}

function required() {
  throw new Error('Required option is missing');
}

var GRAPHIQL_VERSION = '0.3.1';

// TODO default query
// const defaultQuery = ``;
function renderGraphiQL() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var query = _ref.query;
  var variables = _ref.variables;
  var _ref$version = _ref.version;
  var version = _ref$version === undefined ? GRAPHIQL_VERSION : _ref$version;

  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <link href="//cdn.jsdelivr.net/graphiql/' + version + '/graphiql.css" rel="stylesheet" />\n        <script src="//cdn.jsdelivr.net/fetch/0.9.0/fetch.min.js"></script>\n        <script src="//cdn.jsdelivr.net/react/0.14.1/react.min.js"></script>\n        <script src="//cdn.jsdelivr.net/graphiql/' + version + '/graphiql.min.js"></script>\n      </head>\n      <body>\n        Loading...\n        <script>\n          /**\n           * This GraphiQL example illustrates how to use some of GraphiQL\'s props\n           * in order to enable reading and updating the URL parameters, making\n           * link sharing of queries a little bit easier.\n           *\n           * This is only one example of this kind of feature, GraphiQL exposes\n           * various React params to enable interesting integrations.\n           */\n          // Parse the search string to get url parameters.\n          var search = window.location.search;\n          var parameters = {};\n          search.substr(1).split(\'&\').forEach(function (entry) {\n            var eq = entry.indexOf(\'=\');\n            if (eq >= 0) {\n              parameters[decodeURIComponent(entry.slice(0, eq))] =\n                decodeURIComponent(entry.slice(eq + 1));\n            }\n          });\n          // if variables was provided, try to format it.\n          if (parameters.variables) {\n            try {\n              parameters.variables =\n                JSON.stringify(JSON.parse(parameters.variables), null, 2);\n            } catch (e) {\n              // Do nothing, we want to display the invalid JSON as a string, rather\n              // than present an error.\n            }\n          }\n          // When the query and variables string is edited, update the URL bar so\n          // that it can be easily shared\n          function onEditQuery(newQuery) {\n            parameters.query = newQuery;\n            updateURL();\n          }\n          function onEditVariables(newVariables) {\n            parameters.variables = newVariables;\n            updateURL();\n          }\n          function updateURL() {\n            var newSearch = \'?\' + Object.keys(parameters).map(function (key) {\n              return encodeURIComponent(key) + \'=\' +\n                encodeURIComponent(parameters[key]);\n            }).join(\'&\');\n            history.replaceState(null, null, newSearch);\n          }\n          // Defines a GraphQL fetcher using the fetch API.\n          function graphQLFetcher(graphQLParams) {\n            return fetch(window.location.origin + \'/graphql\', {\n              method: \'post\',\n              headers: { \'Content-Type\': \'application/json\' },\n              body: JSON.stringify(graphQLParams),\n            }).then(function (response) {\n              return response.json()\n            });\n          }\n          // Render <GraphiQL /> into the body.\n          React.render(\n            React.createElement(GraphiQL, {\n              fetcher: graphQLFetcher,\n              query: ' + (query ? '`' + query + '`' : '\'\'') + ',\n              variables: ' + (variables ? '`' + variables + '`' : '\'\'') + ',\n              onEditQuery: onEditQuery,\n              onEditVariables: onEditVariables\n            }),\n            document.body\n          );\n        </script>\n      </body>\n    </html>';
}
var querystring = require('querystring');
var url = require('url');
var util = require('util');

var Router = require('route-recognizer').default;

var RouteActions = require('../actions/route_actions.js');

function RouteStore(initialRoute) {
  var router;
  router = this._router = new Router();
  this.currentRoute = (initialRoute || {});

  router.add([{
    path: '/',
    handler: function(fullUrl) {
      var uri = url.parse(fullUrl);
      if (!uri.query) uri.query = {};
      if (typeof uri.query === 'string') uri.query = querystring.parse(uri.query);
      var params = {
        sortdir: uri.query.sortdir || 'desc',
        start: uri.query.start || null
      };
      return {page: 'list', params: params};
    }
  }]);

  router.add([{
    path: '/image/:id',
    handler: function(fullUrl, params) {
      return {page: 'image', image: params.id};
    }
  }]);
}

RouteStore.prototype.getState = function() {
  return { route: this.currentRoute };
};

RouteStore.prototype.handleDispatch = function(type, action) {
  if (type === RouteActions.changeUrl) {
    return this.setUrl(action.url, action.skipHistory);
  } else if (type === RouteActions.setUrlFromRequest) {
    var results = this._router.recognize(action.url);
    if (results && results.length) {
      var route = results[0].handler(action.url, results[0].params);
      this.currentRoute = route;
    }
    return this.getState();
  } else if (type === RouteActions.modifyQuery) {
    return this.modifyQueryParams(action.query);
  } else {
    return this.getState();
  }
};

RouteStore.prototype.setUrl = function(href, skipHistory, assumeLocal) {
  var isFullUrl = function(url) {
    return url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
  }
  if (!assumeLocal && isFullUrl(href)) {
    document.location = href;
  } else {
    if (isFullUrl(href)) {
      href = url.parse(href).path;
    }

    var results = this._router.recognize(href);
    if (results && results.length) {
      var route = results[0].handler(href, results[0].params);
      this.currentRoute = route;
      if (!skipHistory) history.pushState(href, '', href);
      return this.getState();
    }
  }

  return this.getState();
}

RouteStore.prototype.modifyQueryParams = function(newParams) {
  var uri = url.parse(document.location.toString());
  uri.query = uri.query || {};
  if (typeof uri.query == 'string') uri.query = querystring.parse(uri.query);
  for (key in newParams) {
    uri.query[key] = newParams[key]
  }
  if (uri.search) delete uri['search'];
  var newUrl = url.format(uri);
  return this.setUrl(newUrl, true, true);
};

module.exports = RouteStore;

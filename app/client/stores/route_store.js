var url = require('url');
var util = require('util');

var Router = require('route-recognizer').default;

var RouteActions = require('../actions/route_actions.js');
var urlmod = require('../../lib/urlmod.js');

function RouteStore(initialRoute) {
  var router;
  router = this._router = new Router();
  this.currentRoute = (initialRoute || {});

  router.add([{
    path: '/',
    handler: function(fullUrl) {
      var uri = url.parse(fullUrl, true);
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
    return this.setUrl(action.url, action.pushState, action.replaceState);
  } else if (type === RouteActions.setUrlFromRequest) {
    var results = this._router.recognize(action.url);
    if (results && results.length) {
      var route = results[0].handler(action.url, results[0].params);
      this.currentRoute = route;
    }
    return this.getState();
  } else {
    return this.getState();
  }
};

RouteStore.prototype.setUrl = function(href, pushState, replaceState) {
  var currentUrl = document.location.toString();

  if (!urlmod.sameOrigin(currentUrl, href)) {
    document.location = href;
    return;
  }

  href = urlmod.getNewPath(currentUrl, href);
  var results = this._router.recognize(href);
  if (results && results.length) {
    var route = results[0].handler(href, results[0].params);
    this.currentRoute = route;
    if (pushState) history.pushState(href, '', href);
    else if (replaceState) history.replaceState(href, '', href);
    return this.getState();
  }

  return this.getState();
};

module.exports = RouteStore;

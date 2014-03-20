var querystring = require('querystring');
var url = require('url');
var util = require('util');

var Router = require('route-recognizer').default;

var UrlActions = require('../actions/url_actions.js');

function UrlStore() {
  var router;
  router = this._router = new Router();

  router.add([{
    path: '/',
    handler: function(fullUrl) {
      var uri = url.parse(fullUrl);
      var params = querystring.parse(uri.query);
      params = {
        sortdir: params.sortdir || 'desc',
        start: params.start || null
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

UrlStore.prototype.setRoute = function(route) {
  this.currentRoute = route;
};

UrlStore.prototype.getCurrentRoute = function() {
  return this.currentRoute;
};

UrlStore.prototype.getState = function() {
  return { route: this.currentRoute };
};

UrlStore.prototype.handleDispatch = function(type, action) {
  if (type === UrlActions.CHANGE_URL) {
    var href = action.url;
    if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0) {
      document.location = href;
    } else {
      var results = this._router.recognize(href);
      if (results.length) {
        var route = results[0].handler(action.url, results[0].params);
        this.currentRoute = route;
        if (!action.skipHistory) history.pushState(href, '', href);
        return this.getState();
      }
    }

    return this.getState();
  } else if (type === UrlActions.CHANGE_URL_FROM_REQ) {
    var uri = url.parse(action.url);
    var results = this._router.recognize(uri.pathname);
    if (results.length) {
      var route = results[0].handler(action.url, results[0].params);
      this.currentRoute = route;
      return this.getState();
    }
  } else {
    return this.getState();
  }
}

module.exports = new UrlStore();

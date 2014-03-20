var querystring = require('querystring');
var util = require('util');

var Director = require('director');

var UrlActions = require('../actions/url_actions.js');

function UrlStore() {
  var store = this;

  var routes = {
    '/': function() {
      var params = querystring.parse(document.location.search.replace(/^\?/, ''));
      params = {
        sortdir: params.sortdir || 'desc',
        start: params.start || null
      };
      store.setRoute({page: 'list', params: params});
    },
    '/image/:img': function(image) {
      store.setRoute({page: 'image', image: image});
    }
  };

  if (process.browser) {
    this._router = Director.Router(routes);
    if (this._router.configure)
      this._router = this._router.configure({
        html5history: true,
        run_handler_in_init: true
      });
    this._router.init();
  }
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
      this._router.setRoute(href);
    }

    return this.getState();
  }
}

module.exports = new UrlStore();

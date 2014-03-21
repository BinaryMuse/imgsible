var RouteActions = require('../actions/route_actions.js');

var RoutingMixin = {
  // TODO: figure out why this dies on the server when the preloadData
  // includes a `route` key.
  //
  // getInitialState: function() {
  //   return { route: {} };
  // },

  componentDidMount: function() {
    var firstPopState = true;
    this.getDOMNode().addEventListener('click', this._handleRouteClick);
    window.onpopstate = function(e) {
      if (firstPopState) {
        firstPopState = false;
        return;
      }
      var path = document.location.toString().replace(document.location.origin, '');
      this.dispatcher.dispatch(RouteActions.changeUrl(path, true));
    }.bind(this);
  },

  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('click', this._handleRouteClick);
    window.onpopstate = null;
  },

  _handleRouteClick: function(e) {
    var target = e.target;

    while(target && target.tagName !== 'A') {
      target = target.parentNode;
    }

    if (!target) return;

    if (!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
      e.preventDefault();

      var href = target.attributes.href.value;
      this.dispatcher.dispatch(RouteActions.changeUrl(href));
    }
  }
};

module.exports = RoutingMixin

var UrlActions = require('../actions/url_actions.js');

var RoutingMixin = {
  getInitialState: function() {
    return { route: {} };
  },

  componentDidMount: function() {
    this.getDOMNode().addEventListener('click', this._handleRouteClick);
  },

  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('click', this._handleRouteClick);
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
      UrlActions.changeUrl(href);
    }
  }
};

module.exports = RoutingMixin

var url = require('url');

var RoutingMixin = {
  componentDidMount: function() {
    // There is a bug in Chrome that causes an extra popstate event
    // as the page loads. Avoid it if we can.
    var firstPopState = true;

    setTimeout(function() {
      firstPopState = false;
    }, 100);

    window.onpopstate = function(e) {
      if (firstPopState) {
        firstPopState = false;
        return;
      }
      this.handleRouteChange(document.location.toString(), true);
    }.bind(this);
  },

  componentWillUnmount: function() {
    window.onpopstate = null;
  },

  _handleRouteClick: function(e) {
    // Do nothing if the event has been prevented already
    if (e.defaultPrevented) return;
    var target = e.target;

    while(target && target.tagName !== 'A') {
      target = target.parentNode;
    }

    // Do nothing if it wasn't a link we clicked on
    if (!target) return;
    // Do nothing if the user was holding a modifier key
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

    e.preventDefault();
    this.handleRouteChange(target.attributes.href.value, false);
  }
};

module.exports = RoutingMixin

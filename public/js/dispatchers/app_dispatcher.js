var events = require('events');
var util = require('util');

var merge = require('object-merge');
var Q = require('q');

function AppDispatcher() {
  events.EventEmitter.call(this);
  this.stores = [];
}

util.inherits(AppDispatcher, events.EventEmitter);

AppDispatcher.prototype.register = function(store) {
  this.stores.push(store);
};

AppDispatcher.prototype.dispatch = function(type, action) {
  var promises = [];
  for (i in this.stores) {
    var promise = this.stores[i].handleDispatch(type, action);
    promises.push(promise);
  }

  return Q.allSettled(promises).then(function(results) {
    var state = results.reduce(function(curr, result) {
      if (result.state === 'fulfilled' && result.value) return merge(curr, result.value);
      else return curr;
    }, {});

    this.emit('stateUpdate', state);
    return state;
  }.bind(this));
}

module.exports = new AppDispatcher();

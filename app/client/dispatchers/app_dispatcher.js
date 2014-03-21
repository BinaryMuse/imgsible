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
  store._dispatcher = this;
  this.stores.push(store);
};

AppDispatcher.prototype.dispatch = function(action) {
  var type = action.type;
  var data = action.data;

  var promises = [];
  for (i in this.stores) {
    var promise = this.stores[i].handleDispatch(type, data);
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
};

AppDispatcher.prototype.refreshState = function() {
  var states = [];
  for (i in this.stores) {
    states.push(this.stores[i].getState());
  }

  var result = states.reduce(function(curr, state) {
    if (state) return merge(curr, state);
    else return curr;
  }, {});

  this.emit('stateUpdate', result);
};

AppDispatcher.prototype.destroy = function() {
  this.stores = [];
  this.removeAllListeners();
};

module.exports = AppDispatcher;

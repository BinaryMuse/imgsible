var events = require('events');
var util = require('util');

var merge = require('object-merge');
var Q = require('q');

function AppDispatcher() {
  events.EventEmitter.call(this);
  this.stores = {};
  this.actions = {};
}

util.inherits(AppDispatcher, events.EventEmitter);

AppDispatcher.prototype.register = function(name, store) {
  this.stores[name] = store;
};

AppDispatcher.prototype.store = function(name) {
  return this.stores[name];
};

AppDispatcher.prototype.dispatch = function(action) {
  var type = action.type;
  var data = action.data;

  var promises = [];
  for (key in this.stores) {
    var promise = this.stores[key].handleDispatch(type, data);
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

AppDispatcher.prototype.destroy = function() {
  this.stores = {};
  this.actions = {};
  this.removeAllListeners();
};

module.exports = AppDispatcher;

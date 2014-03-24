var events = require('events');
var util = require('util');

function Dispatcher() {
  events.EventEmitter.call(this);
  this.stores = {};
  this.actions = {};
}

util.inherits(Dispatcher, events.EventEmitter);

Dispatcher.prototype.registerStores = function(spec) {
  var store;
  for (key in spec) {
    store = spec[key];
    store._on = store.on;
    store.on = null;
    this.stores[key] = store;
    store.onDispatcherRegistration(this);
  }
};

Dispatcher.prototype.store = function(name) {
  return this.stores[name];
};

Dispatcher.prototype.registerActions = function(spec) {
  var dispatcher = this;
  var actionSet, eventName, fn;
  for (key in spec) {
    if (!this.actions[key]) this.actions[key] = {};
    actionSet = spec[key];

    for (name in actionSet) {
      this.actions[key][name] = actionSet[name].bind(this);
    }
  }
};

Dispatcher.prototype.onStore = function(store, event, fn) {
  this.store(store)._on(event, fn);
};

Dispatcher.prototype.dispatch = function(event) {
  this.emit.apply(this, arguments);
};

Dispatcher.prototype.destroy = function() {
  this.removeAllListeners();
  for (key in this.stores) {
    this.stores[key].removeAllListeners();
  }
  this.stores = null;
  this.actions = null;
};

module.exports = Dispatcher;

var events = require('events');
var util = require('util');


function BaseStore() {
  events.EventEmitter.call(this);
}

util.inherits(BaseStore, events.EventEmitter);

BaseStore.prototype.onDispatcherRegistration = function(dispatcher) {
  throw new Error("Stores must implement onDispatcherRegistration");
};

module.exports = BaseStore;

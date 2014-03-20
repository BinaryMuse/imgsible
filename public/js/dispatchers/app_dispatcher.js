var events = require('events');
var util = require('util');

function AppDispatcher() {
  events.EventEmitter.call(this);
  this.callbacks = [];
}

util.inherits(AppDispatcher, events.EventEmitter);

AppDispatcher.prototype.register = function(cb) {
  this.callbacks.push(cb);
};

AppDispatcher.prototype.dispatch = function(type, action) {
  for (i in this.callbacks) {
    this.callbacks[i](type, action);
  }
}

module.exports = new AppDispatcher();

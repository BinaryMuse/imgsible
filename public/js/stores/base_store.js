var events = require('events');
var util = require('util');

function BaseStore() {
  events.EventEmitter.call(this);
}

util.inherits(BaseStore, events.EventEmitter);

module.exports = BaseStore;

var util = require('util');

var assert = require('chai').assert;

var Dispatcher = require('../app/client/dispatchers/dispatcher.js');
var BaseStore = require('../app/client/stores/base_store.js');


var ImageActions = {
  loadImage: function(id, useCache) {
    this.emit('LOAD_IMAGE', id, useCache);
  }
};


var Store = function() {
  BaseStore.call(this);
}

util.inherits(Store, BaseStore);

Store.prototype.onDispatcherRegistration = function(dispatcher) {
  dispatcher.on('LOAD_IMAGE', this.loadImage.bind(this))
};

Store.prototype.loadImage = function(id, useCache) {
  this.emit('image:loaded', id, {usedCache: useCache});
};


var store, dispatcher;

describe ('Dispatcher', function() {
  beforeEach(function() {
    store = new Store();
    dispatcher = new Dispatcher();

    dispatcher.registerStores({
      image: store
    });

    dispatcher.registerActions({
      image: ImageActions
    });
  });

  afterEach(function() {
    dispatcher.destroy();
  });

  it ('defines actions per mixed in objects', function() {
    assert.typeOf(dispatcher.actions.image.loadImage, 'function');
  });

  it ('emits events based on mixed in actions', function(done) {
    dispatcher.on('LOAD_IMAGE', function(id, useCache) {
      assert.equal(id, 123);
      assert.isTrue(useCache);
      done();
    });
    dispatcher.actions.image.loadImage(123, true);
  });

  it ('allows binding to events emitted from contained stores', function(done) {
    dispatcher.onStore('image', 'image:loaded', function(id, opt) {
      assert.equal(id, 123);
      assert.deepEqual(opt, {usedCache: true});
      done();
    });
    dispatcher.actions.image.loadImage(123, true);
  });
});

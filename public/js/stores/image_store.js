var util = require('util');

var Q = require('q');

var ImageActions = require('../actions/image_actions.js');

var NOT_FOUND = 'IMAGE_NOT_FOUND';

function ImageStore(imageFetchStrategy) {
  this.imagesById = {};
  this.imageFetchStrategy = imageFetchStrategy;
}

ImageStore.prototype.getState = function() {
  return { imagesById: this.imagesById };
};

ImageStore.prototype.handleDispatch = function(type, action) {
  if (type === ImageActions.loadImage) {
    return this.fetchImageData(action.id);
  } else {
    return this.getState();
  }
};

ImageStore.prototype.fetchImageData = function(id) {
  return this.imageFetchStrategy(id);
};

ImageStore.NOT_FOUND = NOT_FOUND;

ImageStore.ServerFetchStrategy = function(db) {
  return function(id) {
    var store = this;

    var deferred = Q.defer();
    db.hgetall('img:' + id, function(err, reply) {
      if (err || !reply) {
        store.imagesById[id] = NOT_FOUND;
      } else {
        store.imagesById[id] = reply;
        store.imagesById[id].id = id
        store.imagesById[id].extension = reply.type;
      }
      deferred.resolve(store.getState());
    });

    return deferred.promise;
  }
};

ImageStore.ClientFetchStrategy = function() {
  return function(id) {
    var store = this;

    var deferred = Q.defer();
    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/api/image/' + id);
    xhr.onload = function(e) {
      if (this.status === 200) {
        var data = JSON.parse(this.response);
        store.imagesById[id] = data;
      } else if (this.status === 404) {
        store.imagesById[id] = NOT_FOUND;
      }

      deferred.resolve(store.getState());
    };
    xhr.send();

    return deferred.promise;
  }
};

module.exports = ImageStore;

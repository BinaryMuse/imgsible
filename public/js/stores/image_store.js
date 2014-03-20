var util = require('util');

var Q = require('q');

var ImageActions = require('../actions/image_actions.js');

var NOT_FOUND = 'IMAGE_NOT_FOUND';

function ImageStore() {
  this.imagesById = {};
}

ImageStore.prototype.getState = function() {
  return { imagesById: this.imagesById };
};

ImageStore.prototype.handleDispatch = function(type, action) {
  if (type === ImageActions.LOAD_IMAGE) {
    return this.fetchImageData(action.id);
  } else {
    return this.getState();
  }
};

ImageStore.prototype.fetchImageData = function(id) {
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
};

var store = new ImageStore();
store.NOT_FOUND = NOT_FOUND;
module.exports = store;

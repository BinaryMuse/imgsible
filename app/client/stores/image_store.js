var util = require('util');

var Q = require('q');

var ImageActions = require('../actions/image_actions.js');

var NOT_FOUND = 'IMAGE_NOT_FOUND';

function ImageStore(imageDb, initialList) {
  this.imageList = initialList || {ids: [], done: false};
  this.imagesById = {};
  this.upload = { view: 'form' };
  this.imageDb = imageDb;
}

ImageStore.prototype.getState = function() {
  return { imagesById: this.imagesById, upload: this.upload, imageList: this.imageList };
};

ImageStore.prototype.handleDispatch = function(type, action) {
  if (type === ImageActions.loadImage) {
    return this.fetchImageData(action.id);
  } else if (type === ImageActions.loadIndex) {
    return this.fetchImageList(action.since, action.by, action.order, action.resetList);
  } else if (type === ImageActions.uploadImage) {
    return this.uploadImage(action.form);
  } else if (type === ImageActions.resetUploadForm) {
    this.upload = { view: 'form' };
    return this.getState();
  } else {
    return this.getState();
  }
};

ImageStore.prototype.fetchImageData = function(id) {
  return this.imageDb.find(id).then(function(image) {
    this.imagesById[id] = image;
    return this.getState();
  }.bind(this), function() {
    this.imagesById[id] = NOT_FOUND;
    return this.getState();
  }.bind(this));
};

ImageStore.prototype.fetchImageList = function(since, by, order, resetList) {
  return this.imageDb.list(since, by, order).then(function(ids) {
    if (resetList) this.imageList.done = false;

    if (ids.length === 0)
      this.imageList.done = true;
    else if (this.imageList.ids.length && !resetList)
      this.imageList.ids = this.imageList.ids.concat(ids);
    else
      this.imageList.ids = ids;

    return this.getState();
  }.bind(this));
};

ImageStore.prototype.uploadImage = function(form) {
  var store = this;
  var reader = new FileReader();
  var xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', function(e) {
    if (e.lengthComputable) {
      var percent = Math.round((e.loaded * 100) / e.total);
    }
  }, false);

  var formData = new FormData(form);

  xhr.open('POST', '/api/upload');
  xhr.responseType = 'text';
  xhr.send(formData);
  xhr.onload = function(e) {
    if (this.status === 201) {
      data = JSON.parse(this.responseText);
      store.upload = { view: 'success', image: data };
      store.imageList.ids.unshift(data.id);
      store._dispatcher.refreshState();
    } else {
      console.error(this);
      store.upload = { view: 'error' };
      store._dispatcher.refreshState();
    }
  };

  this.upload = { view: 'progress' };
  return this.getState();
};

ImageStore.NOT_FOUND = NOT_FOUND;

module.exports = ImageStore;

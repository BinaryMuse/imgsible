var util = require('util');

var BaseStore = require('./base_store.js');
var ImageActions = require('../actions/image_actions.js');

function ImageStore() {
  BaseStore.call(this);
}

util.inherits(ImageStore, BaseStore);

ImageStore.prototype.handleDispatch = function(type, action) {
  if (type === ImageActions.LOAD_IMAGE) {
    this.fetchImageData(action.id);
  }
};

ImageStore.prototype.fetchImageData = function(id) {
  var store = this;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/image/' + id);
  xhr.onload = function(e) {
    if (this.status === 200) {
      var data = JSON.parse(this.response);
      store.emit('image:load', id, data);
    } else if (this.status === 404) {
      store.emit('image:notfound', id);
    }
  };
  xhr.send();
};

module.exports = new ImageStore();

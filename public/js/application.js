var AppDispatcher = require('./dispatchers/app_dispatcher.js');
var ImageStore = require('./stores/image_store.js');
var UrlStore = require('./stores/url_store.js');

module.exports = function() {
  AppDispatcher.register(ImageStore);
  AppDispatcher.register(UrlStore);
};

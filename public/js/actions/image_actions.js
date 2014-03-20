var AppDispatcher = require('../dispatchers/app_dispatcher');

module.exports = {
  LOAD_IMAGE: 'IMAGE_ACTIONS:LOAD_IMAGE',

  loadImage: function(id) {
    AppDispatcher.dispatch(this.LOAD_IMAGE, {id: id});
  }
};

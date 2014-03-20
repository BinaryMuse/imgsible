var AppDispatcher = require('../dispatchers/app_dispatcher');

module.exports = {
  loadImage: function(id) {
    return {type: this.loadImage, data: {id: id}};
  }
};

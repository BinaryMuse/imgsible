var AppDispatcher = require('../dispatchers/app_dispatcher');

module.exports = {
  loadImage: function(id) {
    return {type: this.loadImage, data: {id: id}};
  },

  uploadImage: function(form) {
    return {type: this.uploadImage, data: {form: form}};
  },

  resetUploadForm: function() {
    return {type: this.resetUploadForm, data: null};
  }
};

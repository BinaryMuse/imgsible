var AppDispatcher = require('../dispatchers/app_dispatcher');

module.exports = {
  changeUrl: function(url, skipHistory) {
    return {type: this.changeUrl, data: {url: url, skipHistory: !!skipHistory}};
  },

  setUrlFromRequest: function(url) {
    return {type: this.setUrlFromRequest, data: {url: url}};
  }
};

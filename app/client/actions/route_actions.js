var AppDispatcher = require('../dispatchers/app_dispatcher');

module.exports = {
  changeUrl: function(url, pushState, replaceState) {
    return {type: this.changeUrl, data: {url: url, pushState: !!pushState, replaceState: !!replaceState}};
  },

  setUrlFromRequest: function(url) {
    return {type: this.setUrlFromRequest, data: {url: url}};
  }
};

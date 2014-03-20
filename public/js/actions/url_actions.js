var AppDispatcher = require('../dispatchers/app_dispatcher');

module.exports = {
  CHANGE_URL: 'URL_ACTIONS:CHANGE_URL',
  CHANGE_URL_FROM_REQ: 'URL_ACTIONS:CHANGE_URL_FROM_REQ',

  changeUrl: function(url, skipHistory) {
    return AppDispatcher.dispatch(this.CHANGE_URL, {url: url, skipHistory: !!skipHistory});
  },

  setUrlFromRequest: function(url) {
    return AppDispatcher.dispatch(this.CHANGE_URL_FROM_REQ, {url: url});
  }
};

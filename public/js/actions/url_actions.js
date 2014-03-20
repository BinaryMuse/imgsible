var AppDispatcher = require('../dispatchers/app_dispatcher');

module.exports = {
  CHANGE_URL: 'URL_ACTIONS:CHANGE_URL',

  changeUrl: function(url) {
    AppDispatcher.dispatch(this.CHANGE_URL, {url: url});
  }
};

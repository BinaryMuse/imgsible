var Q = require('q');

module.exports = function() {
  return {
    find: function(id) {
      var deferred = Q.defer();

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/image/' + id);
      xhr.onload = function(e) {
        if (this.status === 200) {
          var data = JSON.parse(this.response);
          deferred.resolve(data);
        } else if (this.status === 404) {
          deferred.reject();
        }
      };
      xhr.send();

      return deferred.promise;
    }
  }
};

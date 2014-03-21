var Q = require('q');

module.exports = function(db) {
  return {
    find: function(id) {
      var deferred = Q.defer();

      db.hgetall('img:' + id, function(err, reply) {
        if (err || !reply) {
          deferred.reject();
        } else {
          reply.extension = reply.type
          reply.id = id;
          deferred.resolve(reply);
        }
      });

      return deferred.promise;
    }
  }
};

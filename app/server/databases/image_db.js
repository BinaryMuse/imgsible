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
    },

    list: function(since, by, order) {
      by = (by || 'date');
      key = by === 'votes' ? 'votes' : 'dates';

      var methods = {
        rank: 'zrevrank',
        range: 'zrevrange'
      };
      if (order === 'asc') {
        methods = {
          rank: 'zrank',
          range: 'zrange'
        };
      }

      var startPromise;
      if (since) {
        startPromise = Q.nfcall(db[methods.rank].bind(db), 'imgs:' + key, since);
      } else {
        startPromise = Q.when(-1)
      }

      return startPromise.then(function(startIndex) {
        startIndex = startIndex + 1;
        return Q.nfcall(db[methods.range].bind(db), 'imgs:' + key, startIndex, startIndex + 8);
      });
    }
  }
};

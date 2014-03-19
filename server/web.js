var fs = require('fs');

var Q = require('q');

var errors = require('./errors');

var mimeTypes = {
  jpg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png'
};

module.exports = function(app, db) {
  app.get('/', function(req, res) {
    res.sendfile('public/index.html');
  });

  app.get(/^\/i\/(\w+)(-t)?.(jpg|jpeg|gif|png)/, function(req, res) {
    // TODO: unify errors
    Q.nfcall(db.hgetall.bind(db), 'img:' + req.params[0]).then(function(reply) {
      if (!reply) {
        errors.notFound(res);
      } else {
        var fname = req.params[1] ? req.params[0] + '_thumb' : req.params[0];
        res.header('Content-Type', mimeTypes[reply.type]);
        fs.createReadStream(app.get('uploadDir') + '/' + fname).pipe(res);
      }
    }, function(reason) {
      console.error('Error in web/i');
      console.error(reason);
      errors.genericError(res);
    });
  });
};

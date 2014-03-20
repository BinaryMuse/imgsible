var fs = require('fs');

var Q = require('q');

var ApplicationView = require('../public/js/components/application_view.jsx');
var errors = require('./errors');
var React = require('react');

var mimeTypes = {
  jpg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png'
};

module.exports = function(app, db) {
  app.get('/', function(req, res) {
    var html =  React.renderComponentToString(ApplicationView());
    res.render('index', {app: html});
  });

  app.get('/image/:img', function(req, res) {
    var html =  React.renderComponentToString(ApplicationView());
    res.render('index', {app: html});
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

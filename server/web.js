var fs = require('fs');

var Q = require('q');
var React = require('react');

var Application = require('../public/js/application.js');
var ApplicationView = require('../public/js/components/application_view.jsx');
var errors = require('./errors');
var UrlActions = require('../public/js/actions/url_actions.js');

Application();

// TODO: break stores into client and server strategies,
// pass in DB, etc. in order to initialize data
// -- then get promises and render when complete

var mimeTypes = {
  jpg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png'
};

module.exports = function(app, db) {
  app.get('/', function(req, res) {
    var promise = UrlActions.setUrlFromRequest(req.url);
    promise.then(function(state) {
      var html =  React.renderComponentToString(ApplicationView({preloadData: state}));
      res.render('index', {app: html, preloadData: state});
    });
  });

  app.get('/image/:img', function(req, res) {
    db.hgetall('img:' + req.params.img, function(err, reply) {
      var initialState = {
        route: {
          page: 'image', image: req.params.img
        },
        imagesById: {}
      };

      initialState.imagesById[req.params.img] = reply;
      initialState.imagesById[req.params.img].id = req.params.img;
      initialState.imagesById[req.params.img].extension = reply.type;

      var html =  React.renderComponentToString(ApplicationView({preloadData: initialState}));
      res.render('index', {app: html, preloadData: initialState});
    });
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

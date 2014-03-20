var fs = require('fs');

var Q = require('q');
var React = require('react');

var AppDispatcher = require('../public/js/dispatchers/app_dispatcher.js');
var ApplicationView = require('../public/js/components/application_view.jsx');
var errors = require('./errors');
var ImageStore = require('../public/js/stores/image_store.js');
var UrlStore = require('../public/js/stores/url_store.js');

AppDispatcher.register(ImageStore);
AppDispatcher.register(UrlStore);

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
    var initialState = {
      route: { page: 'list' },
      imagesById: {}
    };
    var html =  React.renderComponentToString(ApplicationView({preloadData: initialState}));
    res.render('index', {app: html, preloadData: initialState});
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

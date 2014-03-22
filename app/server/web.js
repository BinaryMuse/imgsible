var fs = require('fs');

var Q = require('q');
var React = require('react');

var AppDispatcher = require('../client/dispatchers/app_dispatcher.js');
var ApplicationView = require('../client/components/application_view.jsx');
var errors = require('./errors');
var ImageActions = require('../client/actions/image_actions.js');
var ImageDb = require('./databases/image_db.js');
var ImageStore = require('../client/stores/image_store.js');
var RouteActions = require('../client/actions/route_actions.js');
var RouteStore = require('../client/stores/route_store.js');

var mimeTypes = {
  jpg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png'
};

module.exports = function(app, db) {
  function createDispatcher() {
    var dispatcher = new AppDispatcher();
    dispatcher.register(new ImageStore(ImageDb(db)));
    dispatcher.register(new RouteStore());
    return dispatcher;
  }

  app.get('/', function(req, res) {
    var dispatcher = createDispatcher();

    var promise = dispatcher.dispatch(RouteActions.setUrlFromRequest(req.url)).then(function() {
      return dispatcher.dispatch(ImageActions.loadIndex(null, 'date', 'desc'));
    });

    promise.then(function(state) {
      var html =  React.renderComponentToString(ApplicationView({preloadData: state, dispatcher: dispatcher}));
      res.render('index', {app: html, preloadData: state});
      dispatcher.destroy();
    });
  });

  app.get('/image/:img', function(req, res) {
    var dispatcher = createDispatcher();

    var promise = dispatcher.dispatch(RouteActions.setUrlFromRequest(req.url)).then(function() {
      return dispatcher.dispatch(ImageActions.loadImage(req.params.img));
    });

    promise.then(function(state) {
      var html =  React.renderComponentToString(ApplicationView({preloadData: state, dispatcher: dispatcher}));
      res.render('index', {app: html, preloadData: state});
      dispatcher.destroy();
    });
  });

  app.get(/^\/i\/(\w+)(-t)?.(jpg|jpeg|gif|png)/, function(req, res) {
    Q.nfcall(db.hgetall.bind(db), 'img:' + req.params[0]).then(function(reply) {
      if (!reply) {
        errors.notFound(res);
      } else {
        var fname = req.params[1] ? req.params[0] + '_thumb.jpg' : req.params[0];
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

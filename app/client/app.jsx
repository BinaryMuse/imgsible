/** @jsx React.DOM */

var AppDispatcher = require('./dispatchers/app_dispatcher.js');
var ApplicationView = require('./components/application_view.jsx');
var ImageDb = require('./databases/image_db.js');
var ImageStore = require('./stores/image_store.js');
var RouteStore = require('./stores/route_store.js');

var preloadData = window.preloadData;
var dispatcher = new AppDispatcher();
dispatcher.register(new ImageStore(ImageDb(), preloadData.imageList));
dispatcher.register(new RouteStore(preloadData.route));

React.renderComponent(<ApplicationView preloadData={preloadData} dispatcher={dispatcher} />, document.getElementById('app'));

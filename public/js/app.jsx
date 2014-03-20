/** @jsx React.DOM */

var AppDispatcher = require('./dispatchers/app_dispatcher.js');
var ApplicationView = require('./components/application_view.jsx');
var ImageStore = require('./stores/image_store.js');
var UrlStore = require('./stores/url_store.js');

AppDispatcher.register(ImageStore);
AppDispatcher.register(UrlStore);

var preloadData = window.preloadData;

React.renderComponent(<ApplicationView preloadData={preloadData} />, document.getElementById('app'));

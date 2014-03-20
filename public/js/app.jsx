/** @jsx React.DOM */

var Application = require('./application.js');
var ApplicationView = require('./components/application_view.jsx');

var preloadData = window.preloadData;

Application();
React.renderComponent(<ApplicationView preloadData={preloadData} />, document.getElementById('app'));

/** @jsx React.DOM */

var ApplicationView = require('./components/application_view.jsx');

var preloadData = window.preloadData;

React.renderComponent(<ApplicationView preloadData={preloadData} />, document.getElementById('app'));

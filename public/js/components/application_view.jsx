/** @jsx React.DOM */

var querystring = require('querystring');
var url = require('url');

var AppDispatcher = require('../dispatchers/app_dispatcher.js');
var Header = require('./header.jsx');
var ImageView = require('./image_view.jsx');
var ImageList = require('./image_list.jsx');
var ImageNotFound = require('./image_not_found.jsx');
var ImageStore = require('../stores/image_store.js');
var InfoSidebar = require('./info_sidebar.jsx');
var RoutingMixin = require('../mixins/routing_mixin.js');
var UploadSidebar = require('./upload_sidebar.jsx');
var UrlActions = require('../actions/url_actions.js');
var UrlStore = require('../stores/url_store.js');

var ApplicationView = React.createClass({
  mixins: [RoutingMixin],

  getInitialState: function() {
    if (this.props.preloadData) {
      return this.props.preloadData;
    } else {
      return { route: {}, imagesById: {} };
    }
  },

  componentWillMount: function() {
    AppDispatcher.on('stateUpdate', function(newState) {
      this.setState(newState);
    }.bind(this));
  },

  render: function() {
    var centerSection = null;
    if (this.state.route.page === 'list') {
      centerSection = <ImageList />;
    } else if (this.state.route.page === 'image') {
      var image = this.state.imagesById[this.state.route.image];
      if (image === ImageStore.NOT_FOUND)
        centerSection = <ImageNotFound />;
      else
        centerSection = <ImageView imageId={this.state.route.image} image={image} />;
    }

    return (
      <div>
        <div id='header-container'>
          <Header />
        </div>

        <div id='content'>
          <div id='center'>
            {centerSection}
          </div>
          <InfoSidebar />
          <UploadSidebar />
        </div>
      </div>
    );
  }
});

module.exports = ApplicationView;

/** @jsx React.DOM */

var ImageActions = require('../actions/image_actions.js');
var DispatcherMixin = require('../mixins/dispatcher_mixin.js');

function throttle(fn, threshhold) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

var ImageList = React.createClass({
  mixins: [DispatcherMixin],

  getInitialState: function() {
    return { loading: false, checkedForMore: false };
  },

  render: function() {
    var images = this.props.imageList.ids || [];

    var imageEls = images.map(function(img) {
      return (
        <div className='image-list-item' key={img}>
          <a href={'/image/' + img}>
            <img src={'http://localhost:5000/i/' + img + '-t.gif'} />
          </a>
        </div>
      )
    });

    return (
      <div id='image-list'>
        <div className='selector'>
          Showing the most [ <a href='#' className='active'>recent</a> / <a href='#'>voted</a> ] images
        </div>

        {imageEls}
      </div>
    );
  },

  componentDidMount: function() {
    if (this.props.imageList.ids.length === 0) {
      this.setState({loading: true});
      this.dispatcher.dispatch(ImageActions.loadIndex(null, 'date', 'desc'));
    } else {
      this.checkScrollPosition();
    }

    this._throttledCheckScrollPosition = throttle(this.checkScrollPosition, 100);
    window.addEventListener('scroll', this._throttledCheckScrollPosition);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this._throttledCheckScrollPosition);
  },

  componentWillReceiveProps: function(nextProps) {
    if ((this.state.loading && nextProps.imageList.length !== this.props.imageList.length) || !this.state.checkedForMore) {
      this.setState({loading: false});
    }
  },

  componentDidUpdate: function() {
    this.checkScrollPosition();
  },

  checkScrollPosition: function() {
    if (this.state.loading) return;
    if (document.body.scrollTop < 0) return;
    if (this.props.imageList.done) return;

    var node = this.getDOMNode();
    var listHeight = node.clientHeight;
    var listTop = node.offsetTop
    var listBottom = listHeight + listTop;
    var bottomPixel = document.documentElement.clientHeight + document.body.scrollTop;
    var diff = listBottom - bottomPixel;

    if (diff < 200) this.fetchNextPage();
  },

  fetchNextPage: function() {
    this.setState({loading: true});
    var lastImage = this.props.imageList.ids[this.props.imageList.ids.length - 1];
    this.dispatcher.dispatch(ImageActions.loadIndex(lastImage, 'date', 'desc'));
  }
});

module.exports = ImageList;

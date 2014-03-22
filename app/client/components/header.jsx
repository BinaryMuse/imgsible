/** @jsx React.DOM **/

var Header = React.createClass({
  getInitialState: function() {
    return { homepageLink: '/' }
  },

  render: function() {
    return (
      <div id='header'>
        <a className="title" href={this.state.homepageLink}>img<span className='highlight'>sible</span></a>
      </div>
    );
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.currentRoute.page === 'list') {
      if (nextProps.currentRoute.params.sortdir === 'asc')
        this.setState({homepageLink: '/?sortdir=asc'})
      else
        this.setState({homepageLink: '/'});
    }
  }
});

module.exports = Header;

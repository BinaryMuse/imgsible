/** @jsx React.DOM **/

var Header = React.createClass({
  render: function() {
    return (
      <div id='header'>
        <a className="title" href='/'>img<span className='highlight'>sible</span></a>
      </div>
    );
  }
});

module.exports = Header;

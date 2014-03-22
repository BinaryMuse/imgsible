/** @jsx React.DOM */

var InfoSidebar = React.createClass({
  render: function() {
    return (
      <div id='info-sidebar'>
        <h1>What is this?</h1>
        <p>Imgsible is a small application in the spirit of the awesome image sharing
          site <a href='http://imgur.com/'>Imgur</a> to demonstrate a
          non-trivial <a href='http://facebook.github.io/react/'>React</a> application. It is
          not intended for general use; you should head over to Imgur for that!</p>
        <p>Check out the source for the app <a href='https://github.com/BinaryMuse/imgsible'>on GitHub</a>!</p>
      </div>
    );
  }
});

module.exports = InfoSidebar;

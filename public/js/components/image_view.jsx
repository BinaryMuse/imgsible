/** @jsx React.DOM **/

var ImageActions = require('../actions/image_actions.js');

var ImageView = React.createClass({
  render: function() {
    var content;
    if (this.props.image) {
      var image = this.props.image;
      content = (
        <div>
          <div>{image.title}</div>
          <div className='main-image-container'>
            <img className='main-image' src={'/i/' + image.id + '.' + image.extension} />
          </div>
          <div>{image.description}</div>
        </div>
      );
    } else {
      content = <div>Loading...</div>;
    }

    return (
      <div id='single-image'>
        {content}
      </div>
    );
  },

  componentDidMount: function() {
    ImageActions.loadImage(this.props.imageId);
  }
});

module.exports = ImageView;

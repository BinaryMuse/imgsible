/** @jsx React.DOM */

var ImageList = React.createClass({
  render: function() {
    var images = ['7pt', '7pu', '7pv', '7pw', '7px'];

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
  }
});

module.exports = ImageList;

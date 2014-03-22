/** @jsx React.DOM */

var ImageActions = require('../actions/image_actions.js');
var DispatcherMixin = require('../mixins/dispatcher_mixin.js');

var UploadSidebar = React.createClass({
  mixins: [DispatcherMixin],

  render: function() {
    var data = this.props.upload;

    var form = (
      <div>
        <h1>Upload an Image</h1>
        <form id='upload-image' encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <div><input name='title' type='text' placeholder='Title' /></div>
          <div><textarea name='description' placeholder='Description'></textarea></div>
          <div><input name='upload' type='file' /></div>
          <div><input type='submit' value='Upload' /></div>
        </form>
      </div>
    );

    if (data.view === 'form')
      return (
        <div id='upload-sidebar'>
          {form}
        </div>
      );
    else if (data.view === 'progress')
      return (
        <div id='upload-sidebar'>
          <h1>Uploading...</h1>
        </div>
      );
    else if (data.view === 'success')
      return (
        <div id='upload-sidebar'>
          <h1>Success</h1>
          <p>Your image was uploaded successfully!
          {' '}<a href={'/image/' + data.image.id}>View your image</a>.</p>
          {form}
        </div>
      );
    else if (data.view === 'error')
      return (
        <div id='upload-sidebar'>
          <h1>Error</h1>
          There was an error with your upload.
          {' '}<a href='#' onClick={this.handleUploadAgain}>Try again</a>
        </div>
      );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.dispatcher.dispatch(ImageActions.uploadImage(e.target));
  },

  handleUploadAgain: function(e) {
    e.preventDefault();
    this.dispatcher.dispatch(ImageActions.resetUploadForm());
  }
});

module.exports = UploadSidebar;

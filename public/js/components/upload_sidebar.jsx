/** @jsx React.DOM */

var UploadSidebar = React.createClass({
  render: function() {
    return (
      <div id='upload-sidebar'>
        <h1>Upload an Image</h1>
        <form id='upload-image' encType="multipart/form-data">
          <div><input name='title' type='text' placeholder='Title' /></div>
          <div><textarea name='description' placeholder='Description'></textarea></div>
          <div><input name='upload' type='file' /></div>
          <div><input type='submit' value='Upload' /></div>
        </form>
      </div>
    );
  }
});

module.exports = UploadSidebar;

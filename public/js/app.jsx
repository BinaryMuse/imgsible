// function upload(file) {
function upload(form) {
  var reader = new FileReader();
  var xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', function(e) {
    console.log("upload.progress", e);
    if (e.lengthComputable) {
      var percent = Math.round((e.loaded * 100) / e.total);
      console.log("percent:", percent);
    }
  }, false);

  xhr.addEventListener('load', function(e) {
    console.log('load', e);
  });

  var formData = new FormData(form);
  // formData.append('files', file);

  xhr.open('POST', '/api/upload');
  xhr.responseType = 'text';
  xhr.send(formData);
  xhr.onload = function(e) {
    console.log(JSON.parse(this.responseText));
  };
}

function handleFile(file) {
  if (file.type.indexOf('image/') == -1) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    var div = document.createElement('div');
    var img = document.createElement('img');
    img.src = e.target.result;
    div.appendChild(img);
    document.body.appendChild(div);
  }
  reader.readAsDataURL(file);
}

document.getElementById('upload-image').addEventListener('submit', function(e) {
  e.preventDefault();
  upload(this);
})

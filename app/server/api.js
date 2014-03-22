var fs = require('fs');
var os = require('os');

var formidable = require('formidable');
var gm = require('gm');
var Q = require('q');

var errors = require('./errors.js');
var ImageDb = require('./databases/image_db.js');

var FILE_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/png': 'png'
};

function createThumbnail(imagePath) {
  var d = Q.defer();
  gm(imagePath)
    .adjoin()
    .gravity('Center')
    .thumb(200, 200, imagePath + "_thumb.jpg", 90, d.makeNodeResolver());
  return d.promise;
}

function getImageDimensions(imagePath) {
  var d = Q.defer();
  gm(imagePath)
    .size(function(err, value) {
      if (!value) err = (err || new Error("No value from gm().size()"));
      d.makeNodeResolver()(err, value);
    });
  return d.promise;
}

function getImageStats(imagePath) {
  return Q.nfcall(fs.stat, imagePath);
}

function addImageToDatabase(db, id, extension, width, height, size, title, description) {
  var d = Q.defer();
  // TODO: add user votes?
  db.multi()
    .hmset('img:' + id, {
      title: title,
      description: description,
      type: extension,
      views: 0,
      votesUp: 0,
      votesDown: 0,
      width: width,
      height: height,
      bytes: size
    })
    .zadd('imgs:votes', 0, id)
    .zadd('imgs:dates', new Date().valueOf(), id)
    .exec(d.makeNodeResolver());
  return d.promise;
}

function createImage(db, file, uploadDir, title, description) {
  var id, filename, targetPath;
  var extension = FILE_TYPE_MAP[file.type];

  return Q.nfcall(db.incr.bind(db), 'imgcount').then(function(imgNum) {
    id = (parseInt(imgNum, 10) + 10000).toString(36);
    filename = id + '.' + extension;
    targetPath = uploadDir + '/' + id;

    return Q.nfcall(fs.rename, file.path, targetPath);
  }).then(function() {
    return [ createThumbnail(targetPath), getImageDimensions(targetPath), getImageStats(targetPath) ];
  }).spread(function(_, size, stat) {
    return addImageToDatabase(db, id, extension, size.width, size.height, stat.size, title, description);
  }).then(function() {
    return {
      id: id,
      filename: id + '.' + extension,
      thumbnail: id + '-t.' + extension
    };
  });
}

module.exports = function(app, db) {
  var imageDb = ImageDb(db);

  app.all('/api*', function(req, res, next) {
    if (app.get('dbConnected')) {
      next();
    } else {
      errors.genericError(res);
    };
  });

  app.get('/api/', function(req, res) {
    res.json({debug: true});
  });

  app.get('/api/image/:id', function(req, res) {
    Q.nfcall(db.hgetall.bind(db), 'img:' + req.params.id).then(function(reply) {
      if (!reply) {
        res.json(404, {
          error: true,
          status: 404,
          message: 'Image not found'
        });
      } else {
        res.json(200, {
          id: req.params.id,
          title: reply.title,
          description: reply.description,
          extension: reply.type,
          width: parseInt(reply.width, 10),
          height: parseInt(reply.height, 10),
          bytes: parseInt(reply.bytes, 10),
          views: parseInt(reply.views, 10),
          votesUp: parseInt(reply.votesUp, 10),
          votesDown: parseInt(reply.votesDown, 10)
        });
      }
    }, function(reason) {
      console.error('Error in api/image');
      console.error(reason);
      errors.genericError(res);
    });
  });

  app.get('/api/list', function(req, res) {
    imageDb.list(req.query.since, req.query.by || 'date', req.query.order || 'desc')
    .then(function(ids){
      res.json({ids: ids});
    });
  });

  app.post('/api/upload', function(req, res) {
    var fileHandled = false;
    var form = new formidable.IncomingForm();
    form.uploadDir = os.tmpdir();
    form.encoding = 'utf-8';

    form.on('error', function(e) {
      console.error('Erorr in api/upload form parsing:');
      console.error(e);
      errors.genericError(res);
    });

    form.parse(req, function(err, fields, files) {
      if (err) return errors.genericError(res);

      var file = files.upload;
      if (!FILE_TYPE_MAP[file.type]) {
        res.json(415, {
          error: true,
          status: 415,
          message: 'Invalid file format: ' + file.type
        });
      } else {
        createImage(db, file, app.get('uploadDir'), fields.title, fields.description)
        .then(function(img) {
          res.header('Location', '/api/image/' + img.id);
          res.json(201, {
            id: img.id,
            url: '/i/' + img.filename,
            thumbUrl: '/i/' + img.thumbnail
          });
        }, function(reason) {
          console.error('Error in api/upload:');
          console.error(reason);
          errors.genericError(res);
        });
      }
    });
  });
};

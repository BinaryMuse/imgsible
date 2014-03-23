var url = require('url');

module.exports = {
  sameOrigin: function(a, b) {
    uriA = url.parse(a);
    uriB = url.parse(b);

    uriB.protocol = uriB.protocol || uriA.protocol;
    uriB.port = uriB.port || uriA.port;
    uriB.hostname = uriB.hostname || uriA.hostname;

    return uriA.protocol === uriB.protocol &&
           uriA.port === uriB.port &&
           uriA.hostname === uriB.hostname;
  },

  getNewPath: function(oldPath, mod, params) {
    params = params || {};

    var oldUri = url.parse(oldPath, true);
    var newUri;
    if (mod) newUri = url.parse(mod, true);
    delete oldUri.search; // interferes with using uri.query later
    delete oldUri.hash; // don't want to keep this

    if (mod) oldUri.query = newUri.query;
    if (mod) oldUri.pathname = newUri.pathname;

    for (key in params) {
      oldUri.query[key] = params[key];
    }

    return url.parse(url.format(oldUri)).path;
  }
};

var assert = require('chai').assert;

var mod = require('../app/lib/urlmod.js');

var basePath = 'http://imgsible.com/some/path'
var basePathWithQuery = basePath + '?abc=123';

describe ('URL mod', function() {
  describe ('#sameOrigin', function() {
    describe ('when the new URL has the same protocol, port, domain', function() {
      var sameOrigin = mod.sameOrigin(basePath, 'http://imgsible.com/another/path');
      assert.equal(sameOrigin, true);
    });

    describe ('when the new URL is just a path', function() {
      var sameOrigin = mod.sameOrigin(basePath, '/some/new/path');
      assert.equal(sameOrigin, true);
    });

    describe ('when the protocols dont match', function() {
      var sameOrigin = mod.sameOrigin(basePath, 'https://imgsible.com/some/path');
      assert.equal(sameOrigin, false);
    });

    describe ('when the ports dont match', function() {
      var sameOrigin = mod.sameOrigin(basePath, 'http://imgsible.com:1234/some/path');
      assert.equal(sameOrigin, false);
    });

    describe ('when the domains dont match', function() {
      var sameOrigin = mod.sameOrigin(basePath, 'http://imgsible2.com/some/path');
      assert.equal(sameOrigin, false);
    });
  });

  describe ('#getNewPath', function() {
    it ('doesnt keep hashes', function() {
      var newPath = mod.getNewPath(basePath + '#yolo', '/another/path');
      assert.equal(newPath, '/another/path');
    });

    describe ('when given a path', function() {
      it ('returns that path', function() {
        var newPath = mod.getNewPath(basePath, '/another/path');
        assert.equal(newPath, '/another/path');
      });

      it ('uses that paths query string', function() {
        var newPath = mod.getNewPath(basePathWithQuery, '/another/path?def=234');
        assert.equal(newPath, '/another/path?def=234');

        var newPath = mod.getNewPath(basePathWithQuery, '/another/path');
        assert.equal(newPath, '/another/path');
      });
    });

    describe ('when given no path and query params', function() {
      it ('returns the current path with the query params', function() {
        var newPath = mod.getNewPath(basePath, null, {abc: '123', def: '456'});
        assert.equal(newPath, '/some/path?abc=123&def=456');
      });

      it ('merges any existing query params', function() {
        var newPath = mod.getNewPath(basePathWithQuery, null, {abc: '456', def: '456'});
        assert.equal(newPath, '/some/path?abc=456&def=456');

        newPath = mod.getNewPath(basePathWithQuery, null, {def: '456'});
        assert.equal(newPath, '/some/path?abc=123&def=456');
      });
    });
  });
});

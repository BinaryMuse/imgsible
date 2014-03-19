function genErr(res, code, msg) {
  res.format({
    html: function() {
      res.sendfile('public/errors/' + code + '.html');
    },

    json: function() {
      res.json(code, {
        error: true,
        status: code,
        message: message
      });
    }
  });
}

module.exports = {
  notFound: function(res) {
    genErr(res, 404, 'Not found');
  },

  genericError: function(res) {
    genErr(res, 500, 'Internal server error');
  }
};

var files = require('../../models/user.files.js');

var utils = {
  range: function(range) {

    console.log('utils range', range);

    var data = {
      start: 0
    };

    if (range !== undefined && (range = range.match(/bytes=(.+)-(.+)?/)) !== null) {

      data.start = parseInt(range[1], 10);

      if (range[2] === undefined) {
        range[2] = data.start + 1024;
      }
      data.end = range[2];
    }

    return data;
  }
};

module.exports = {

  upload: function(req, res) {

    files.save(req.cookies.token, req.files, function(file, user) {

      res.send(file);

    });
  },

  list: function(req, res) {

    files.find(req.cookies.token, function(file, user) {

      res.send(file);

    });

  },

  download: function(req, res) {

    var range = utils.range(req.headers.range);

    //files.private(req.cookies.token, req.params.id, function(file, data, user) {
    files.public(req.params.id, range, function(file, data) {

      file.length = file.length || file.size;
      range.end = range.end || (range.start + file.length - 1) || file.size - 1;

      res.setHeader('Content-Type', file.type);
      res.setHeader('Content-Length', file.size);
      res.setHeader('Content-Disposition', 'inline; filename="' + file.name + '"');

      res.setHeader('Content-Transfer-Encoding', 'binary');
      res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.size);
      res.setHeader('Accept-Ranges', 'bytes');

      console.log('header', res.getHeader('Content-Range'));

      res.send(206, data);

    });

  },

  delete: function(req, res) {

    files.delete(req.cookies.token, req.params.id, function(file, user) {

      res.send(file);

    });

  }

};

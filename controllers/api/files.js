var files = require('../../models/user.files.js');

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

    files.fetch(req.cookies.token, req.params.id, function(file, data, user) {

      res.setHeader('Content-Type', file.type);
      res.setHeader('Content-Length', file.size);
      res.setHeader('Content-Disposition', 'inline; filename="' + file.name + '"');

      res.end(data);

    });

  },

  delete: function(req, res) {

    files.delete(req.cookies.token, req.params.id, function(file, user) {

      res.send(file);

    });

  }

};

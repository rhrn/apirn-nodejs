var files = require('../../models/user.files.js');

module.exports = {

  upload: function(req, res) {

      files.save(req.cookies.token, req.files, function(file, user) {

        res.send(file);

      });
  }

};
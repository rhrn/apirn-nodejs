var auth = require('../controllers/auth.js'),
  index = require('../controllers/index.js'),
  fs = require('fs');

module.exports = function(app) {

  app.get('/cache.manifest', function(req, res) {

    res.header("Content-Type", "text/cache-manifest");
    res.header("Cache-Control", "no-cache, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "-1");

    fs.readFile('appcache/cache.manifest', 'utf8', function(err, data) {
      res.send(data);
    });

  });

  app.get('/', index.index);
  app.post('/', index.index);

  app.get('/join', auth.join);

};

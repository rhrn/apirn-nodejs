var auth = require('../controllers/api/auth.js');
var files = require('../controllers/api/files.js');

module.exports = function(app) {

  app.get('/api/v1/', auth.index);
  app.post('/api/v1/join', auth.join);
  app.post('/api/v1/upload', files.upload);

};

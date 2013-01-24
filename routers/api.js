var auth = require('../controllers/api/auth.js');

module.exports = function(app) {

  app.get('/api/v1/', auth.index);
  app.post('/api/v1/join', auth.join);

};

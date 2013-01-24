var auth = require('../controllers/auth.js'),
  index = require('../controllers/index.js');

module.exports = function(app) {

  app.get('/', index.index);
  app.post('/', index.index);
  app.get('/join', auth.join);

};

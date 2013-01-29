var adm = require('../controllers/adm/index.js');

module.exports = function(app) {

  app.get('/adm', adm.index);
  app.post('/adm/join', adm.join);

};

var models = {};
  models.pages = require('../models/pages.js');

module.exports = {

  join: function(req, res) {

    models.pages.incrementView('auth.join');

    res.render('join', {title : 'join Page'});

  } 

};

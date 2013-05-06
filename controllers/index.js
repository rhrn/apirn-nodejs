var models = {};
  models.pages = require('../models/pages.js');

module.exports = {

  index: function(req, res) {

    models.pages.incrementView('index');

    models.pages.getViews('index', function(views) {
      res.render('index', {title : 'title', views: views});
    });

  } 

};

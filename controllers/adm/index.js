module.exports = {

  index: function(req, res) {
    res.render('adm/index', {title: 'Adm index'});
  }, 

  join: function(req, res) {
    res.render('adm/join', {title: 'Adm join'});
  }

};

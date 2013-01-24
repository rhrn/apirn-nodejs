var models = {};
  models.auths = require('../../models/auths.js');

var validate = {

  income: function(data) {
    data.assert('email', 'not valid email').isEmail();
    data.assert('password', 'password len min 7 characters').len(7);
    return data.validationErrors();
  },

  outcome: function(data) {

    if (data.error) {
      return [{param: 'password', msg: 'password miss match', value: ''}];
    } else {
      return null;
    }
  }

};

module.exports = {

  index: function(req, res) {
    res.send({'index':'true'});
  },

  join: function(req, res) {

    var err = validate.income(req);

    if (err === null) {

      var data = {
        'email': req.body.email,
        'password': req.body.password
      };

      models.auths.join(data, function(data) {

        err = validate.outcome(data);

        if (err === null) {
          res.send(data);
        } else {
          res.send(418, err);
        }

      });

    } else {
      res.send(418, err);
    }
  }

};

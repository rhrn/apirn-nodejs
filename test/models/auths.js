var auths = require('../../models/auths.js');
var should = require('chai').should();

var user = {
  email: 'test@test.test',
  password: 'password'
};

describe('models auth', function() {

  it('join', function() {
    auths.join(user, function(data) {
      data.should.have.property('user_id');
      data.should.have.property('email');
      data.should.have.property('token');
    });
  });

});

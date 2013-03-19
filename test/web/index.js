var request = require('supertest');
var web = require('../../web.js');

describe('web index', function() {

  it('index', function(done) {

    request(web)
      .get('/')
      .expect(200, done);

  }); 

});

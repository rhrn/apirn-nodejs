var mongodb = require('../configure/mongodb.js');

describe('mongodb', function(done) {

  it('connected', function(done) {
    mongodb.connected = done;
  });

});

require('./models/auths.js');
require('./web/index.js');

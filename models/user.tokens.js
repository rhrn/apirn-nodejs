var collName = 'user.tokens';
var mongo = require('../configure/mongodb.js');
var assert = require('assert');
var crypto = require('crypto');

var utils = {

  genToken: function() {

    try {

      return crypto.randomBytes(32).toString('base64');

    } catch (ex) {

    }

  }

};

module.exports = {

  gen: function(data, callback) {

    mongo.db.collection(collName, function(err, collection) {

      assert.equal(null, err);

      data.token = utils.genToken();

      collection.update({ user_id: data.user_id }, {
        $push: {tokens: {
          token: data.token,
          created: new Date()
        }}
      }, {

        upsert:true

      }, function(err, doc) {

        assert.equal(null, err);

        callback(data);

      });

    });

  },

  check: function(data) {

    mongo.db.collection(collName, function(err, collection) {

      assert.equal(null, err);

      collection.findOne(data, function(err, doc) {

        assert.equal(null, err);

      });

    });

  }, 

  token: function(token, callback) {

    mongo.db.collection(collName, function(err, collection) {

      assert.equal(null, err);

      collection.findOne({"tokens.token": token}, {user_id: 1, _id: 0}, function(err, doc) {

        assert.equal(null, err);

        callback(doc);

      });

    });
  }

};

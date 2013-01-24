var collName = 'users';
var mongo = require('../configure/mongodb.js');
var tokens = require('./user.tokens.js');
var crypto = require('crypto');
var assert = require('assert');

var utils = {

  hashPassword: function(rawPassword) {

    try {

      return crypto.createHash('sha256').update(rawPassword).digest('base64');

    } catch (ex) {

    }

  },

  checkData: function(data, doc, callback) {

    if (doc.password === data.password) {

      tokens.gen({
        user_id: doc._id,
        email: doc.email
      }, callback);

    } else {
    
      callback({
        error: 1
      });

    }

  },

  insertUser: function(collection, data, callback) {

    collection.insert(data, function(err, doc) {

      assert.equal(null, err);

      tokens.gen({
        user_id: doc[0]._id,
        email: doc[0].email
      }, callback);

    });

  }

};

module.exports = {

  join: function(data, callback) {

    data.password = utils.hashPassword(data.password);

    mongo.db.collection(collName, function(err, collection) {

      assert.equal(null, err);

      collection.findOne({email: data.email}, function(err, doc) {

        assert.equal(null, err);

        if (doc !== null) {

          utils.checkData(data, doc, callback);

        } else {

          utils.insertUser(collection, data, callback);

        }

      });

    });
  }

};

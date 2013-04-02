var collName = 'user.files';
var monogodb = require('mongodb');
var mongo = require('../configure/mongodb.js');
var userTokens = require('./user.tokens.js');
var assert = require('assert');

module.exports = {

  save: function(token, files, callback) {

      userTokens.token(token, function(user) {

        var gs = mongo.file(files.file.name, "w", {
          "content_type": files.file.type
        });

        gs.writeFile(files.file.path, function(err, gs) {

          mongo.db.collection(collName, function(err, collection) {

            assert.equal(null, err);

            collection.update(user, {$push: {files : gs }}, {upsert: true}, function() {

              assert.equal(null, err);

              callback(gs, user);

            });

          });

        });

      });
  }, 

  find: function(token, callback) {

      userTokens.token(token, function(user) {

          mongo.db.collection(collName, function(err, collection) {

            assert.equal(null, err);

            collection.find(user, {files: 1, _id: 0}).nextObject(function(err, doc) {

              assert.equal(null, err);

              callback(doc.files, user);
            
            });

          });

      });
  }

};

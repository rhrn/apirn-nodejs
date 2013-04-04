var collName = 'user.files';
var monogodb = require('mongodb');
var mongo = require('../configure/mongodb.js');
var userTokens = require('./user.tokens.js');
var assert = require('assert');
var ObjectID = monogodb.ObjectID;

module.exports = {

  save: function(token, files, callback) {

      userTokens.token(token, function(user) {

        var gs = monogodb.GridStore(mongo.db, files.file.name, "w", {
          "content_type": files.file.type
        });

        gs.writeFile(files.file.path, function(err, gs) {

          mongo.db.collection(collName, function(err, collection) {

            assert.equal(null, err);

            var f = {};

            f["user_id"] = user["user_id"];
            f["file"] = gs;

            collection.insert(f, function() {

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


            collection.find(user, {file: 1, _id: 0}).toArray(function(err, doc) {

              assert.equal(null, err);

              if (doc !== null) {
                var files = [];
                for(i = 0, l = doc.length; l > i; i++) {
                  files.push(doc[i].file);
                }
                callback(files, user);
              }

            });

          });

      });
  }, 

  delete: function(token, fileId, callback) {

      userTokens.token(token, function(user) {

          mongo.db.collection(collName, function(err, collection) {

            assert.equal(null, err);
            
            user["file._id"] = ObjectID(fileId);

            collection.find(user).nextObject(function(err, doc) {

              assert.equal(null, err);
              assert.notEqual(null, doc);
              
              monogodb.GridStore.unlink(mongo.db, user["file._id"], function() {
                callback(collection.remove(user), user);
              });
            
            });

          });

      });
  }

};

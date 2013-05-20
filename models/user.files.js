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
          type: files.file.type
        });

        gs.writeFile(files.file.path, function(err, doc) {

          monogodb.GridStore.read(mongo.db, doc.fileId, function(err, fileData) {

            mongo.db.collection(collName, function(err, collection) {

              assert.equal(null, err);

              var f = {};

              f["user_id"] = user["user_id"];
              f["file"] = {
                "_id":   doc.fileId,
                id:      doc.fileId,
                name:    doc.filename,
                type:    doc.options.type,
                size:    fileData.length,
                created: doc.uploadDate
              };

              collection.insert(f, function() {

                assert.equal(null, err);

                callback(f["file"], user);

              });

            });

          });

        });

      });
  }, 

  find: function(token, callback) {

      userTokens.token(token, function(user) {

          mongo.db.collection(collName, function(err, collection) {

            assert.equal(null, err);

            collection.find(user, {file: 1, _id: 0}).sort({"file.created": 1}).toArray(function(err, doc) {

              assert.equal(null, err);

              if (doc !== null) {
                var files = [];
                var i = doc.length;
                while(i--) {
                  files.push(doc[i].file);
                }
                callback(files, user);
              }

            });

          });

      });
  }, 

  public: function(fileId, range, callback) {

    console.log('model files public', range);

    mongo.db.collection(collName, function(err, collection) {

      assert.equal(null, err);

      fileId = new ObjectID(fileId);

      var file = {"file._id": fileId};

      collection.findOne(file, function(err, doc) {

        assert.equal(null, err);
        assert.notEqual(null, doc);

        var gs = new monogodb.GridStore(mongo.db, fileId, "r");

        gs.open(function(err, gs) {

            gs.seek(range.start, function() {

              var length = null;
              if (range.end !== undefined) {
                length = range.end - range.start; 
              }

              doc.file.length = length;

              gs.read(length, function(err, data) {

                callback(doc.file, data);

              });

            });

        });

      });

    });
  },

  private: function(token, fileId, callback) {

      userTokens.token(token, function(user) {

          mongo.db.collection(collName, function(err, collection) {

            assert.equal(null, err);
            
            user["file._id"] = new ObjectID(fileId);

            collection.find(user).nextObject(function(err, doc) {

              assert.equal(null, err);
              assert.notEqual(null, doc);
              
              monogodb.GridStore.read(mongo.db, user["file._id"], function(err, data) {
                callback(doc.file, data, user);
              });
            
            });

          });

      });
  },

  delete: function(token, fileId, callback) {

      userTokens.token(token, function(user) {

          mongo.db.collection(collName, function(err, collection) {

            assert.equal(null, err);
            
            user["file._id"] = new ObjectID(fileId);

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

var mongo = require('mongodb'),
  Db = mongo.Db,
  Server = mongo.Server,
  ObjectID = mongo.ObjectID,
  connect = new Db('test', new Server('localhost', 27017, {w: 'majority', j: true}));

connect.open(function(err, db) {

  if (err) {
    console.log("MongoDB connect failed");
  } else {
    console.log("MongoDB connected");
  }

  module.exports.db = db;
});

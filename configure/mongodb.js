var mongo = require('mongodb'),
  Db = mongo.Db,
  Server = mongo.Server,
  ObjectID = mongo.ObjectID,
  connect = new Db('test', new Server('localhost', 27017, {w: 'majority', j: true}));

module.exports.connected = function() {
    console.log("MongoDB connected");
};

module.exports.connectFailed = function() {
    console.log("MongoDB connect failed");
};

connect.open(function(err, db) {

  if (err) {
    module.exports.connectFailed();
  } else {
    module.exports.connected();
  }

  module.exports.db = db;
});

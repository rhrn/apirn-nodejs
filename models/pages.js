var mongo = require('../configure/mongodb.js');

module.exports = {

  incrementView: function(page) {
    mongo.db.collection('pages', function(err, collection) {
      collection.update({_id: page}, {$inc: {views:1}}, {upsert:true});
    });
  },

  getViews: function(page, callback) {
    mongo.db.collection('pages', function(err, collection) {
      collection.findOne({_id:page}, function(err, doc) {
        callback(doc.views);
      });
    });
  }
};

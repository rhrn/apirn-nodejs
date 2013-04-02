(function() {

  var Files = Files || {};

  Files.Model = Backbone.Model.extend({
    _idAttribute: "_id"
  });

  Files.Collection = Backbone.Collection.extend({

    model: Files.Model,

    url: '/api/v1/files/list'

  });

  Files.View = Backbone.View.extend({

    initialize: function(_this) {

      _.extend(this, _this);

      this.collection.on("reset", this.reset, this);

    }, 

    reset: function(e) {

      var html = '', template = this.template;

      _.each(this.collection.models, function(model) {

        html += template({
          id: model.get('_id'),
          name: model.get('filename'),
          type: model.get('contentType'),
          size: model.get('length')
        });

      });

      this.$el.html(html);

    } 

  });

  if (typeof define === "function" && define.amd) {
    define(Files);
  }

})();

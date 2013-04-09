(function() {

  var Files = Files || {};

  Files.Model = Backbone.Model.extend({

    idAttribute: '_id'

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

    events: {
      'click .download-file': 'downloadFile',
      'click .delete-file': 'deleteFile'
    },

    downloadFile: function(e) {

      var fileId = $(e.target).data('id');

      var url = '/api/v1/files/download/' + fileId;

      window.open(url);

    },

    deleteFile: function(e) {

      var fileId = $(e.target).data('id');
      var model = this.collection.get(fileId);
      model.on('destroy', function() {
        this.$('#' + fileId).remove();
      }, this);

      model.destroy();
    },

    reset: function(e) {

      var html = '', template = this.template;

      _.each(this.collection.models, function(model) {

        html += template(model.attributes);

      });

      this.$el.html(html);

    },

    run: function() {
      this.collection.fetch();
    }

  });

  if (typeof define === "function" && define.amd) {
    define(Files);
  }

})();

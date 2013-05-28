(function() {

  var Upload = Upload || {};

  Upload.Events = Backbone.Events;

  Upload.View = Backbone.View.extend({

    initialize: function(_this) {

      _.extend(this, _this);

      Upload.params = _this;

      this.input.on('change', function() {

        Upload.show(this.files);

      });

      this.el.on('click', '.cancel-file', function() {
        Upload.cancel($(this).data('id'));
      });

    },

    run: function() {
      this.input.show();
    },

    stop: function() {
      this.input.hide();
    },

    events: Upload.Events

  });

  Upload.cancel = function(id) {
      $('#' + id).remove();
  };

  Upload.show = function(files) {

      var file;

      var progress = function(e, percent) {
          $(this).css('width', percent + '%');
      };

      var message = function(e, message) {
          $(this).html(message);
      };

      for(var i = 0, num = files.length; i < num ; i++) {

        file = files[i]; 

        file.id = 'f' + (+new Date()) + i;

        this.params.el.prepend(this.params.template(file));

        file.uploadBar = this.params.el.find('#' + file.id + ' .bar-info');

        file.uploadBar.on('progress', progress);
        file.uploadBar.on('message', message);

        Upload.send(file);
      }

  };

  Upload.send = function(file) {

      var xhr = new XMLHttpRequest();
      var formData = new FormData();

      xhr.upload.file = file;
    
      xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
          this.file.uploadBar.trigger('progress', Math.floor((e.loaded * 100) / e.total));
        }
      });

      xhr.upload.addEventListener('loadstart', function(e) {
        this.file.uploadBar.trigger('message', 'uploading...');
      });

      xhr.upload.addEventListener('load', function(e) {
        this.file.uploadBar.trigger('message', 'processing...');
      });

      xhr.upload.addEventListener('error', function(e) {
        this.file.uploadBar.trigger('message', 'error');
      });

      xhr.addEventListener('readystatechange', function(e) {
        if(this.readyState === 4) {
          var file = JSON.parse(this.responseText);
          $('#' + this.upload.file.id).after(Upload.params.template(file));
          Upload.cancel(this.upload.file.id);
          Upload.Events.trigger('uploaded', file);
        }
      });

      xhr.open('POST', this.params.url, true);

      formData.append('file', file);

      xhr.send(formData);

  };

  if (typeof define === "function" && define.amd) {
    define(Upload);
  }

})();

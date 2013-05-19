(function() {

  var Upload = Upload || {};

  Upload.instant = true;

  Upload.fileList = {};

  Upload.Events = Backbone.Events;

  Upload.View = Backbone.View.extend({

    initialize: function(_this) {

      _.extend(this, _this);

      Upload.params = _this;

      this.input.on('change', function() {

        Upload.show(this.files);

      });

      if (this.button.length) {

        Upload.instant = false;

        this.button.on('click', function(e) {
          e.preventDefault();
          Upload.to();
        });

      }

      this.el.on('click', '.cancel-file', function() {
        Upload.cancel($(this).data('id'));
      });

    },

    run: function() {
      this.input.show();
      if (this.button.length) {
        this.button.show();
      }
    },

    stop: function() {
      this.input.hide();
      if (this.button.length) {
        this.button.hide();
      }
    },

    events: Upload.Events

  });

  Upload.cancel = function(id) {
      delete Upload.fileList[id];
      $('#' + id).remove();
  };

  Upload.show = function(files) {

      var file;

      for(var i = 0, num = files.length; i < num ; i++) {

        file = files[i]; 

        file.id = 'f' + (+new Date()) + i;

        this.params.el.prepend(this.params.template(file));

        file.readerBar = this.params.el.find('#' + file.id + ' .bar-success');
        file.uploadBar = this.params.el.find('#' + file.id + ' .bar-info');

        Upload.read(file);
      }

  };

  Upload.to = function() {

    for(var id in this.fileList) {
      Upload.send(this.fileList[id]);
    }

  };

  Upload.read = function(file) {

    var reader = new FileReader();

    reader.file = file;

    reader.onload = function(e) {
      if (e.target.readyState === FileReader.DONE) {

        this.file.readerBar.css('width', '100%');
        this.file.readerBar.html('readed');
        
        if (Upload.instant) {
          Upload.send(this.file); 
        } else {
          Upload.fileList[this.file.id] = this.file;
        }

      } else {
        this.file.readerBar.html('failed');
      }
      this.file.readerBar.off('click');
    };

    reader.onloadstart = function() {
      this.file.readerBar.html('reading...');
      this.file.readerBar.on('click', function() {
        reader.abort();
      });
    };

    reader.onabort = function() {
      this.file.readerBar.html('aborted');
      this.file.readerBar.off('click');
    };

    reader.onprogress = function(e) {
      if (e.lengthComputable) {
        this.file.readerBar.css('width', ((e.loaded * 100) / e.total) + '%');
      }
    };

    reader.readAsArrayBuffer(file);

  };

  Upload.send = function(file) {

      var xhr = new XMLHttpRequest();
      var formData = new FormData();

      xhr.upload.file = file;
    
      xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
          this.file.uploadBar.css('width', ((e.loaded * 100) / e.total) + '%');
        }
      });

      xhr.upload.addEventListener('load', function(e) {
        console.log('xhr upload onload');
      });

      xhr.upload.addEventListener('error', function(e) {
        console.log('xhr error');
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

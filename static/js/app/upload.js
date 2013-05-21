(function() {

  var Upload = Upload || {};

  Upload.chunkSize = 1024 * 1024 * 1;

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

        file.readerBar = this.params.el.find('#' + file.id + ' .bar-success');

        file.readerBar.on('progress', progress);
        file.readerBar.on('message', message);

        file.uploadBar = this.params.el.find('#' + file.id + ' .bar-info');

        file.uploadBar.on('progress', progress);
        file.uploadBar.on('message', message);

        Upload.read(file);

        // Trying parts upload
        //Upload.readChunks(file);
      }

  };

  Upload.readChunks = function(file) {

    var size = file.size;

    if (size > Upload.chunkSize) {

      var part;
      var start = 0;
      var stop = Upload.chunkSize - 1;
      var chunksLength = Math.ceil(file.size / Upload.chunkSize);

      for (i = 1; i <= chunksLength; i++) {

        var reader = new FileReader();

        if (stop > size) {
          stop = size;
        }

        reader.onload = function() {
          file.readerBar.trigger('progress', Math.floor((stop * 100) / size));
          file.readerBar.trigger('message', Math.floor((stop * 100) / size));
        };

        part = file.slice(start, stop, file.type);

        reader.readAsBinaryString(part);

        start = stop + 1;
        stop = stop + Upload.chunkSize;
      } 

      //var formData = new FormData();
      //var xhr = new XMLHttpRequest();

    } else {
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

        this.file.readerBar.trigger('progress', 100);
        this.file.readerBar.trigger('message', 'readed');
        
        if (Upload.instant) {
          Upload.send(this.file); 
        } else {
          Upload.fileList[this.file.id] = this.file;
        }

      } else {
        this.file.readerBar.trigger('message', 'failed');
      }
      this.file.readerBar.off('click');
    };

    reader.onloadstart = function() {
      this.file.readerBar.trigger('message', 'reading...');
      this.file.readerBar.on('click', function() {
        reader.abort();
      });
    };

    reader.onabort = function() {
      this.file.readerBar.trigger('message', 'aborted');
      this.file.readerBar.off('click');
    };

    reader.onprogress = function(e) {
      if (e.lengthComputable) {
        this.file.readerBar.trigger('progress', (e.loaded * 100) / e.total);
      }
    };

    reader.readAsBinaryString(file);

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

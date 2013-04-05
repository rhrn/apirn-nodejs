(function() {

  var Upload = Upload || {};

  Upload.fileList = {};

  Upload.View = function(_this) {

    _.extend(this, _this);

    this.input.on('change', function() {

      Upload.show(this.files, _this);

    });

    this.button.on('click', function(e) {

      e.preventDefault();

      Upload.to(_this.url);

    });

  };

  Upload.show = function(files, params) {

      var file;

      for(var i = 0, num = files.length; i < num ; i++) {

        file = files[i]; 

        file.id = 'f' + (+new Date()) + i;

        params.el.append(params.template(file));

        file.readerBar = params.el.find('#' + file.id + ' .bar-success');
        file.uploadBar = params.el.find('#' + file.id + ' .bar-info');

        Upload.read(file);
      }

  };

  Upload.to = function(url) {

    for(var id in this.fileList) {
      
      Upload.send(url, this.fileList[id]);

    }

  };

  Upload.read = function(file) {

    var reader = new FileReader();

    reader.file = file;

    reader.onload = function(e) {
      Upload.fileList[this.file.id] = this.file;
      this.file.readerBar.css('width', '100%');
      this.file.readerBar.html('readed');
    };

    reader.onerror = function(e) {
      this.file.readerBar.html('error');
    };

    reader.onabort = function(e) {
      this.file.readerBar.html('aborted');
    };

    reader.onprogress = function(e) {
      this.file.readerBar.css('width', ((e.loaded * 100) / e.total) + '%');
    };

    reader.readAsArrayBuffer(file);

  };

  Upload.send = function(url, file) {

      var xhr = new XMLHttpRequest();
      var formData = new FormData();

      xhr.upload.file = file;
    
      xhr.upload.addEventListener('progress', function(e) {
        this.file.uploadBar.css('width', ((e.loaded * 100) / e.total) + '%');
      });

      xhr.upload.addEventListener('load', function(e) {
        console.log('xhr upload onload');
        console.log(this);
      });

      xhr.upload.addEventListener('error', function(e) {
        console.log('xhr error');
        console.log(this);
      });

      xhr.addEventListener('readystatechange', function(e) {
        if(this.readyState === 4) {
          this.upload.file.uploadBar.html('uploaded');
          console.log(this.responseText);
        }
      });

      xhr.open('POST', url, true);

      formData.append('file', file);

      xhr.send(formData);

  };

  if (typeof define === "function" && define.amd) {
    define(Upload);
  }

})();

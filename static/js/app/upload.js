(function() {

  var Upload = Upload || {};

  Upload.fileList = [];

  Upload.View = function(_this) {

    _.extend(this, _this);

    this.input.on('change', function() {

      Upload.show(this.files, _this.template, _this.el);

    });

    this.button.on('click', function(e) {

      e.preventDefault();

      Upload.to(_this.url, _this.el);

    });

  };

  Upload.show = function(files, template, el) {

      var num = files.length, file, html = '';

      for(var i = 0; num > i; i++) {

        file = files[i]; 

        file.id = 'f' + +new Date() + i;

        html += template(file);

        this.reader = new FileReader();

        this.reader.file = file;

        this.reader.bar = '#' + file.id + ' .bar-success';

        this.reader.addEventListener('load', function(e) {
          Upload.fileList.push(this.file);
        });

        this.reader.addEventListener('error', function(e) {
          el.find(this.bar).html('error');
        });

        this.reader.addEventListener('abort', function(e) {
          el.find(this.bar).html('aborted');
        });

        this.reader.addEventListener('progress', function(e) {
          el.find(this.bar).css('width', ((e.loaded * 100) / e.total) + '%');
        });

        this.reader.readAsArrayBuffer(file);
      }

      el.append(html);
  };

  Upload.to = function(url, el) {

    var _this = this;

    var num = this.fileList.length, file;

    for(var i = 0; num > i; i++) {

      file = this.fileList[i];

      this.xhr = new XMLHttpRequest();
      this.formData = new FormData();

      this.xhr.upload.bar = '#' + file.id + ' .bar-info';
    
      this.xhr.upload.addEventListener('progress', function(e) {
        el.find(this.bar).css('width', ((e.loaded * 100) / e.total) + '%');
      });

      this.xhr.upload.addEventListener('load', function(e) {
        console.log('xhr upload onload');
      });

      this.xhr.addEventListener('readystatechange', function(e) {
        if(_this.xhr.readyState === 4) {
          el.find(_this.xhr.upload.bar).html('uploaded');
          console.log(_this.xhr.responseText);
        }
      });

      this.xhr.upload.addEventListener('error', function(e) {
        console.log('xhr error');
        console.log(e);
      });

      this.xhr.open('POST', url, true);

      this.formData.append('file', file);

      this.xhr.send(this.formData);

    }

  };

  if (typeof define === "function" && define.amd) {
    define(Upload);
  }

})();

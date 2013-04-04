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

        file.id = 'f' + (+new Date()) + i;

        html += template(file);

        reader = new FileReader();

        reader.file = file;

        reader.bar = '#' + file.id + ' .bar-success';

        reader.onload = function(e) {
          Upload.fileList.push(this.file);
          el.find(this.bar).css('width', '100%');
          el.find(this.bar).html('readed');
        };

        reader.onerror = function(e) {
          el.find(this.bar).html('error');
        };

        reader.onabort = function(e) {
          el.find(this.bar).html('aborted');
        };

        reader.onprogress = function(e) {
          el.find(this.bar).css('width', ((e.loaded * 100) / e.total) + '%');
        };

        reader.readAsArrayBuffer(file);
      }

      el.append(html);
  };

  Upload.to = function(url, el) {

    var num = this.fileList.length, file, xhr, formData;

    for(var i = 0; num > i; i++) {

      file = this.fileList[i];

      xhr = new XMLHttpRequest();
      formData = new FormData();

      xhr.upload.bar = el.find('#' + file.id + ' .bar-info');
    
      xhr.upload.addEventListener('progress', function(e) {
        this.bar.css('width', ((e.loaded * 100) / e.total) + '%');
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
          this.upload.bar.html('uploaded');
          console.log(this.responseText);
        }
      });

      xhr.open('POST', url, true);

      formData.append('file', file);

      xhr.send(formData);

    }

  };

  if (typeof define === "function" && define.amd) {
    define(Upload);
  }

})();

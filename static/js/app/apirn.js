define(['app/auth', 'app/store', 'app/upload', 'app/files'],

  function(Auth, Store, Upload, Files) {

  var auth = new Auth.View({

    el: $('#e-join'),

    template: _.template($('#t-join').html()),

    model: new Auth.Model({

      url: '/api/v1/join',
    
      store: Store
      
    })

  });

  var files = new Files.View({

    el: $('#e-filelist'),

    upload: _.template($('#t-upload').html()),

    template: _.template($('#t-file').html()),

    collection: new Files.Collection({})

  });

  var upload = new Upload.View({

    el: $('#e-filelist'),

    template: _.template($('#t-file').html()),

    input: $('#i-files'),

    button: $('#upload'),

    url: '/api/v1/upload',

    type: /image.*/

  });

  auth.on('login', function() {
    files.run();
    upload.run();
  });

  Upload.Events.on('uploaded', function(file) {
    files.collection.push(file);
  });

  auth.on('logout', function() {
    files.stop();
    upload.stop();
  });

  auth.run();

});

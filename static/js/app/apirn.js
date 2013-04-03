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

  auth.on('login', function() {

    new Upload.View({

      el: $('#e-filelist'),

      template: _.template($('#t-file').html()),

      input: $('#i-files'),

      button: $('#upload'),

      url: '/api/v1/upload',

      type: /image.*/

    });

    var files = new Files.View({

      el: $('#e-filelist'),

      template: _.template($('#t-file').html()),

      collection: new Files.Collection({ })

    });

    files.collection.fetch();

  });

  auth.on('logout', function() {
    console.log('logout');
  });

  auth.model.auth();

});

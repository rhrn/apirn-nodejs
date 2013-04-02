define(['app/auth', 'app/store', 'app/upload', 'app/files'], function(Auth, Store, Upload, Files) {

  new Auth.View({

    el: $('#e-join'),

    template: _.template($('#t-join').html()),

    model: new Auth.Model({

      url: '/api/v1/join',
    
      store: Store
      
    })

  });

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

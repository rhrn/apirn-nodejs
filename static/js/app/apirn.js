define(['app/auth', 'app/store'], function(Auth, Store) {

  new Auth.View({

    el: $('#e-join'),

    template: _.template($('#t-join').html()),

    model: new Auth.Model({

      url: '/api/v1/join',
    
      store: Store
      
    })

  });

});

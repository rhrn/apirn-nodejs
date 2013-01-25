define(['app/auth', 'app/store'], function(Auth, Store) {

  var model = new Auth.Model();

  model.store = Store;

  new Auth.View({

    el: $('form'),

    model: model

  });

});

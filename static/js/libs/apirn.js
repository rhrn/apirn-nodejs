define(['app/auth'], function(Auth) {

  new Auth.View({

    el: $('form'),

    model: new Auth.Model()

  });

});

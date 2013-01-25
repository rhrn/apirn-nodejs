(function() {

  var Auth = Auth || {};

  Auth.url = '/api/v1/join';

  Auth.key = 'user';

  Auth.Model = Backbone.Model.extend({

    url: Auth.url,

    checkAuth: function() {
      this.user = this.getAuth();
      if (typeof this.user !== 'undefined') {
        this.trigger('authed', this.user);
      }
    }, 

    setAuth: function(key) {
      return this.store.set(Auth.key, key);
    },

    getAuth: function() {
      return this.store.get(Auth.key);
    }
    
  });

  Auth.View = Backbone.View.extend({

    initialize: function() {
      this.model.on('authed', this.render, this);
      this.model.checkAuth(); 
    },

    events: {
      "click .btn": "click",
    },

    click: function() {
    
      this.clearErrors();

      this.model.save(this.data(), {

        success: function(model, res) {
          model.setAuth(res);
          model.checkAuth();
        },

        error: function(model, res) {
          var data = JSON.parse(res.responseText);
          for(var i = 0, l = data.length; i < l; i++) {
            $('[name="' + data[i].param + '"] ~ .help-inline').text(data[i].msg);
          }
        },

        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'none');
        }

      });

      return false;
    },

    data: function() {
      return {
        email: this.$('[name="email"]').val(),
        password: this.$('[name="password"]').val()
      }
    },

    render: function(user) {
      this.$el.html('Hello: ' + user.email);
    },

    clearErrors: function() {
      this.$('[name] ~ .help-inline').text('');
    }

  });

  Auth.isAuthed = function() {
    console.log('isAuthed');
  };

  Auth.logout = function() {
    console.log('logout');
  };

  if (typeof define === "function") {
    define(Auth);
  }

})();

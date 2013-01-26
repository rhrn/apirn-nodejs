(function() {

  var Auth = Auth || {};

  Auth.url = '/api/v1/join';

  Auth.key = 'user';

  Auth.Model = Backbone.Model.extend({

    url: Auth.url,

    sendAuth: function(data) {

      this.save(data, {

        success: function(_this, res) {
          _this.setAuth(res);
          _this.checkAuth();
        },

        error: function(_this, res) {
          _this.trigger('error', JSON.parse(res.responseText));
        },

        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'none');
        }

      });

    },

    checkAuth: function() {
      this.user = this.getAuth();
      if (typeof this.user !== 'undefined') {
        this.trigger('authed', this.user);
      } else {
        this.trigger('notAuthed');
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

    fields: ['email', 'password'],

    initialize: function() {
      this.model.on('authed', this.user, this);
      this.model.on('notAuthed', this.login, this);
      this.model.on('error', this.error, this);
      this.model.checkAuth(); 
    },

    events: {
      "click .btn": "click",
    },

    click: function() {
    
      this.clearErrors();

      this.model.sendAuth(this.data());

      return false;
    },

    data: function() {
      return {
        email: this.$('[name="email"]').val(),
        password: this.$('[name="password"]').val()
      }
    },

    login: function(user) {
      this.$el.show();
    },

    user: function(user) {
      this.$el.show().html('Hello: ' + user.email);
    },

    error: function(data) {
      for(var i = 0, l = data.length; i < l; i++) {
        this.$('[name="' + data[i].param + '"] ~ .help-inline').text(data[i].msg);
      }
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

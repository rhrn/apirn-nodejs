(function() {

  "use strict";

  var Auth = Auth || {};

  Auth.Model = Backbone.Model.extend({

    initialize: function(_this) {
      _.extend(this, _this);
    },

    key: 'user',

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
        this.trigger('notAuthed', {user: null});
      }
    }, 

    setAuth: function(key) {
      return this.store.set(Auth.key, key);
    },

    getAuth: function() {
      return this.store.get(Auth.key);
    },

    removeAuth: function() {
      return this.store.set(Auth.key, null);
    }
    
  });

  Auth.View = Backbone.View.extend({

    fields: ['email', 'password'],

    initialize: function(_this) {

      _.extend(this, _this);

      this.model.on('authed', this.render, this);
      this.model.on('notAuthed', this.render, this);
      this.model.on('error', this.error, this);
      this.model.checkAuth(); 
    },

    events: {
      "click .join": "join",
      "click .logout": "logout"
    },

    join: function() {
    
      this.clearErrors();

      this.model.sendAuth(this.data());

      return false;
    },

    logout: function() {

      this.model.removeAuth();

      return false;
    },

    data: function() {
      return {
        email: this.$('[name="email"]').val(),
        password: this.$('[name="password"]').val()
      }
    },

    error: function(data) {
      for(var i = 0, l = data.length; i < l; i++) {
        this.$('[name="' + data[i].param + '"] ~ .help-inline').text(data[i].msg);
      }
    },

    clearErrors: function() {
      this.$('[name] ~ .help-inline').text('');
    },

    render: function(user) {
      console.log(user);
      this.$el.html(this.template(user));
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

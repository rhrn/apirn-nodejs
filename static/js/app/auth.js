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
          _this.auth();
        },

        error: function(_this, res) {
          _this.trigger('error', JSON.parse(res.responseText));
        },

        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'none');
        }

      });

    },

    auth: function() {
      this.trigger('auth', this.getAuth());
    },

    setAuth: function(key) {
      return this.store.set(this.key, key);
    },

    getAuth: function() {
      return this.store.get(this.key);
    },

    removeAuth: function() {
      this.store.set(this.key, null);
      this.trigger('auth', null);
    }
    
  });

  Auth.View = Backbone.View.extend({

    fields: ['email', 'password'],

    initialize: function(_this) {

      _.extend(this, _this);

      this.model.on('auth', this.render, this);
      this.model.on('error', this.error, this);

    },

    events: {
      "click .join": "join",
      "click .logout": "logout"
    },

    join: function(e) {

      e.preventDefault();
    
      this.clearErrors();

      this.model.sendAuth(this.data());
    },

    logout: function(e) {

      e.preventDefault();

      this.model.removeAuth();
    },

    data: function() {
      return {
        email: this.$('[name="email"]').val(),
        password: this.$('[name="password"]').val()
      };
    },

    error: function(data) {
      for(var i = 0, l = data.length; i < l; i++) {
        this.$('[name="' + data[i].param + '"] ~ .help-inline').html(data[i].msg);
      }
    },

    clearErrors: function() {
      this.$('[name] ~ .help-inline').empty();
    },

    render: function(user) {

      this.$el.html(this.template({user:user}));

      if (user) {
        this.trigger('login');
      } else {
        this.trigger('logout');
      }
    },
  
    run: function() {
      this.model.auth();
    }

  });

  if (typeof define === "function" && define.amd) {
    define(Auth);
  }

})();

(function() {

  var Auth = Auth || {};

  Auth.url = '/api/v1/join';

  Auth.Model = Backbone.Model.extend({
    'url': Auth.url
  });

  Auth.View = Backbone.View.extend({

    events: {
      "click .btn": "click",
    },

    click: function() {
    
      this.clearErrors();

      this.model.save(this.data(), {

        success: function(model, res) {
          console.log(model, res);
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

    clearErrors: function() {
      this.$('[name] ~ .help-inline').text('');
    }

  });

  Auth.isAuthed = function() {
    console.log('isAuthed');
  };

  Auth.getAuth = function() {
    console.log('getAuth');
  };

  Auth.login = function() {
    console.log('login');
  };

  Auth.logout = function() {
    console.log('logout');
  };

  if (typeof define === "function") {
    define(Auth);
  }

})();

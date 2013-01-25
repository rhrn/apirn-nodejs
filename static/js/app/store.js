define(['libs/amplify.store'], function() {

  return {
    
    set: function(key, value) {
      return amplify.store(key, value);
    },

    get: function(key) {
      return amplify.store(key);
    },

    remove: function(key) {
      return amplify.store(key, null);
    },

    clear: function() {
      console.log('not implemented');
    }

  };

});

require.config({

  deps: ['apirn'],

  baseUrl: '/static/js',

  paths: {

    'jquery': '/components/jquery/jquery.min',
    'bootstrap': '/components/bootstrap/docs/assets/js/bootstrap',
    'underscore': '/components/underscore/underscore-min',
    'backbone': '/components/backbone/backbone-min',

    'apirn': 'app/apirn'
  },

  shim: {

    bootstrap: {
      deps: ['jquery'],
    },
    
    backbone: {
      deps: ['jquery', 'underscore'],
    },

    apirn: {
      deps: ['backbone', 'bootstrap']
    }

  },

  waitSeconds: 0

});
